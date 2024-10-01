import { ConfirmationModal } from "@components/ConfirmationModal/ConfirmationModal";
import WxMainFull from "@components/MainContentLayout/WxMainFull";
import WxNotFound from "@components/NotFound/WxNotFound";
import WxButton from "@components/WxButton";
import WxPagination from "@components/WxPagination/WxPagination";
import ProductTableSkelton from "@components/WxSkelton/ProductTableSkelton";
import { DISCOUNT_CREATE } from "routes/path-name.route";
import { DiscountService } from "services/api/Discount.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useDebounce from "utils/debouncer";
import skeltonLoader from "utils/skeltonLoader";
import CouponListTable from "./components/CouponListTable/CouponListTable";
import "./Discounts.scss";

interface CouponStatusInfo {
  couponId: string;
  status: boolean;
  index: number;
}

const defaultMeta = {
  offset: 0,
  prevOffset: 0,
  nextOffset: 0,
  limit: 4,
  totalRecords: 4,
  resultCount: 4,
  totalPageCount: 1,
  sort: [
    {
      order: "desc",
      field: "createdOn",
    },
  ],
};

const Discount = () => {
  // coupon data
  const [couponsData, setCouponsData] = useState<any>([]);

  // pagination states
  const [metaData, setMetaData] = useState<any>(defaultMeta);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(
    Number(searchParams.get("page"))
      ? Number(searchParams.get("page")) - 1
      : null || 0
  );
  const [paginationLimit, setPaginationLimit] = useState(10);
  //
  const [deletedData, setDeletedData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoader, setIsLoader] = useState<boolean>(true);
  const [statusConfirmation, setStatusConfirmation] = useState<boolean>(false);
  const [statusUpdateInfo, setStatusUpdateInfo] = useState<
    CouponStatusInfo | any
  >();

  // search states
  const [searchQuery, setSearchQuery] = useState<string>(null);
  let search: string = useDebounce(searchQuery, 500);

  const navigate = useNavigate();
  const [confirmationModal, setConfirmationModal] = useState<boolean>(false);

  useEffect(() => {
    getCouponList();
  }, [currentPage]);

  const getCouponList = () => {
    DiscountService.getList({
      body: {},
      meta: {
        offset: currentPage,
        limit: paginationLimit,
        sort: [
          {
            order: "desc",
            field: "createdOn",
          },
        ],
      },
    })
      .then((res) => {
        setCouponsData(res.body);
        setMetaData(res.meta);
      })
      .catch((err) => ToastService.error(err))
      .finally(() => {
        setIsLoading(false);
        skeltonLoader(setIsLoader);
      });
  };

  const onDelete = (tempData: string) => {
    if (!tempData) return;
    setConfirmationModal(true);
    setDeletedData(tempData);
  };

  const onConfirmDelete = () => {
    setIsSubmitting(true);
    if (!deletedData) return;
    setConfirmationModal(false);
    DiscountService.deleteCoupon([deletedData.id])
      .then((res) => {
        ToastService.success("Coupon deleted successfully");
        setConfirmationModal(false);
        setDeletedData("");
        getCouponList();
      })
      .catch((err) => {
        ToastService.error(err.message);
      })
      .finally(() => {
        setConfirmationModal(false);
        setDeletedData("");
        setIsLoading(true);
        getCouponList();
        setIsSubmitting(false);
      });
  };

  const onCouponStatusUpdate = (
    index: number,
    couponId: string,
    status: boolean | string
  ) => {
    if (!couponId) return;
    setStatusConfirmation(true);
    setStatusUpdateInfo({ index, couponId, status });
  };

  const onConfirmStatusUpdate = () => {
    if (!statusUpdateInfo.couponId) {
      ToastService.error("Coupon Information is not Valid!");
      setStatusUpdateInfo("");
      return;
    }
    setIsSubmitting(true);
    const payload = {
      id: statusUpdateInfo.couponId,
      status: statusUpdateInfo.status ? "Active" : "Inactive",
    };
    DiscountService.update(payload)
      .then((res) => {
        ToastService.success("Coupon status updated successfully");
        couponsData[statusUpdateInfo.index].status = payload.status;
        setCouponsData([...couponsData]);
      })
      .catch((err) => {
        ToastService.error(err.message);
      })
      .finally(() => {
        setStatusConfirmation(false);
        setIsSubmitting(false);
        setStatusUpdateInfo({});
      });
  };

  return (
    <WxMainFull>
      <div className="d-flex wx__justify-content-between wx__align-items-center">
        <h4 className="_h4__medium mb-0">Discounts</h4>
        {couponsData.length ? (
          <WxButton variant="fill" onClick={() => navigate(DISCOUNT_CREATE)}>
            Add Coupon
          </WxButton>
        ) : null}
      </div>

      {/* {isLoading ? <Preloader /> : null} */}

      {!isLoader && !isLoading && couponsData.length === 0 ? (
        <WxNotFound
          title="No Coupon details found!"
          btn_link={DISCOUNT_CREATE}
          btn_text="Create Coupon"
        />
      ) : null}

      {isLoader ? (
        <div className="wx__bg-white rounded wx__mt-3">
          <ProductTableSkelton
            thumb={false}
            topSearchNSelect={false}
            viewBox="0 0 600 235"
          />
        </div>
      ) : (
        <>
          {couponsData.length ? (
            <div className="card wx__mt-3">
              <CouponListTable
                onDelete={onDelete}
                couponsData={couponsData}
                onChangeStatus={onCouponStatusUpdate}
              />
              <div className="pagination_div wx__p-4">
                <WxPagination
                  meta={metaData}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  paginationLimit={paginationLimit}
                  setPaginationLimit={setPaginationLimit}
                />
              </div>
            </div>
          ) : (
            ""
          )}
        </>
      )}
      <ConfirmationModal
        onConfirm={() => onConfirmDelete()}
        isOpen={confirmationModal}
        setIsOpen={setConfirmationModal}
        isSubmitting={isSubmitting}
        title="Coupon Delete Confirmation!"
        body={
          <span>
            Do you want to delete <b>{deletedData?.couponTitle}</b>? This action
            will delete permanently.
          </span>
        }
      />

      <ConfirmationModal
        onConfirm={() => onConfirmStatusUpdate()}
        isOpen={statusConfirmation}
        isSubmitting={isSubmitting}
        setIsOpen={setStatusConfirmation}
        title="Status Change"
        onConfirmLabel="Yes, Change"
        body={`Do you want to change the status?`}
      />
    </WxMainFull>
  );
};

export default Discount;
