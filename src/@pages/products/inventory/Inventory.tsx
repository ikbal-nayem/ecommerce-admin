import WxMainFull from "@components/MainContentLayout/WxMainFull";
import WxNotFound from "@components/NotFound/WxNotFound";
import TableLoader from "@components/TableLoader/TableLoader";
import WxIcon from "@components/WxIcon/WxIcon";
import WxInput from "@components/WxInput";
import WxPagination from "@components/WxPagination/WxPagination";
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
      ? Number(searchParams.get("page")) - 1
      : null || 0
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
    <WxMainFull>
      <div className="wx__d-flex wx__justify-content-between wx__align-items-center">
        <h4 className="mb-0">Inventory List</h4>
      </div>
      {isLoader ? (
        <div className="wx__bg-white wx__rounded wx__mt-3">
          <ProductTableSkelton thumb={false} viewBox="0 0 600 230" />
        </div>
      ) : (
        <div className="wx__card wx__mt-3">
          <div className="wx__row wx__p-4">
            <div className="wx__col-md-12 wx__col-sm-12">
              <WxInput
                className="wx__mb-0"
                type="search"
                placeholder="Search by products, SKU"
                startIcon={<WxIcon icon="search" />}
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

              <div className="wx__p-3">
                <WxPagination
                  meta={productMeta}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  paginationLimit={paginationLimit}
                  setPaginationLimit={setPaginationLimit}
                />
              </div>
            </>
          ) : null}

          {!isLoading && !inventoryData.length ? (
            <WxNotFound title="No inventory item found!" />
          ) : null}
        </div>
      )}
    </WxMainFull>
  );
};

export default memo(Inventory);
