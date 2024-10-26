import MainFull from "@components/MainContentLayout/MainFull";
import WxNotFound from "@components/NotFound/NotFound";
import TableLoader from "@components/TableLoader/TableLoader";
import Icon from "@components/Icon";
import TextInput from "@components/TextInput";
import Pagination from "@components/Pagination";
import ProductTableSkelton from "@components/WxSkelton/ProductTableSkelton";
import { IRequestMeta } from "@interfaces/common.interface";
import { AdminService } from "services/api/admin/Admin.service";
import { ProductService } from "services/api/products/Product.services";
import { ToastService } from "services/utils/toastr.service";
import { memo, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useDebounce from "utils/debouncer";
import skeltonLoader from "../../../utils/skeltonLoader";
import InventoryTable from "./components/InventoryTable";

const Inventory = () => {
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [productMeta, setProductMeta] = useState<IRequestMeta>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoader, setIsLoader] = useState<boolean>(true);

  // search states
  const [searchQuery, setSearchQuery] = useState<string>(null);
  let search: string = useDebounce(searchQuery, 500);

  // pagination states
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(
    Number(searchParams.get("page"))
  );
  const [paginationLimit, setPaginationLimit] = useState(10);

  // reason list states
  const [reasonList, setReasonList] = useState<any[]>([]);

  const isInit = useRef(true);

  useEffect(() => {
    isInit.current &&
      AdminService.getVariantAdjustReason().then((res) =>
        setReasonList(res.body)
      );
    isInit.current = false;
    getProductsVariant();
  }, [currentPage, search, paginationLimit]);

  const getProductsVariant = () => {
    setIsLoading(true);
    ProductService.getProductVariant({
      body: { searchKey: search },
      meta: {
        offset: currentPage,
        limit: paginationLimit,
        sort: [{ order: "desc", field: "createdOn" }],
      },
    })
      .then((res) => {
        if (res.body.length > 0) {
          res.body.map((inventory: any) => {
            inventory.initialQuantity = inventory.quantity || 0;
            inventory.adjustment = 0;
            inventory.isUpdate = false;
          });
          setInventoryData(res.body);
          setProductMeta(res.meta);
          return;
        }
        setInventoryData([]);
        if (res.meta) setProductMeta(res.meta);
      })
      .catch((err) => ToastService.error(err))
      .finally(() => {
        setIsLoading(false);
        skeltonLoader(setIsLoader);
      });
  };

  return (
    <MainFull>
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Inventory List</h4>
      </div>
      {isLoader ? (
        <div className="bg-white rounded mt-3">
          <ProductTableSkelton thumb={false} viewBox="0 0 600 230" />
        </div>
      ) : (
        <div className="card mt-3">
          <div className="row p-4">
            <div className="col-md-12 col-sm-12">
              <TextInput
                className="mb-0"
                type="search"
                placeholder="Search by products, SKU"
                startIcon={<Icon icon="search" />}
                onChange={(e: any) => setSearchQuery(e.target.value)}
              />
            </div>
            {isLoading && <TableLoader />}
          </div>
          {inventoryData?.length ? (
            <>
              <InventoryTable
                inventoryData={inventoryData}
                reasonList={reasonList}
                setInventoryData={setInventoryData}
              />

              <div className="p-3">
                <Pagination
                  meta={productMeta}
                />
              </div>
            </>
          ) : null}

          {!isLoading && !inventoryData.length ? (
            <WxNotFound title="No inventory item found!" />
          ) : null}
        </div>
      )}
    </MainFull>
  );
};

export default memo(Inventory);
