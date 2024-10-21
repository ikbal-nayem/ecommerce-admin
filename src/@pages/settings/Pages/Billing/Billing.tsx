import WxMainXl from "@components/MainContentLayout/WxMainXl";
import WxNotFound from "@components/NotFound/NotFound";
import { FormHeader } from "@components/FormLayout";
import WxPagination from "@components/WxPagination/WxPagination";
import BillingTableSkelton from "@components/WxSkelton/Setting/Billing/BillingTableSkelton";
import UserPlanNInfoSkelton from "@components/WxSkelton/Setting/Billing/UserPlanNInfoSkelton";
import { ACCOUNT_SETTING, SETTINGS } from "routes/path-name.route";
import { AccountSettingService } from "services/api/AccountSetting.service";
import { AdminService } from "services/api/admin/Admin.service";
import { LocalStorageService } from "services/utils/local-storage.service";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import skeltonLoader from "utils/skeltonLoader";
import { generateDateFormat } from "utils/splitDate";
import { BillingTable } from "../../Components/BillingTable/BillingTable";

const Billing = () => {
  const [metaData, setMetaData] = useState<any>();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [billingData, setBillingData] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>();

  // loader
  const [userDataLoader, setUserDataLoader] = useState<boolean>(true);
  const [tableLoader, setTableLoader] = useState<boolean>(true);

  const navigator = useNavigate();

  const userId = LocalStorageService.get("uid");

  const { user_data, activePlan } = useSelector((data: any) => data?.user);

  useEffect(() => {
    getBilling();
  }, [paginationLimit, currentPage]);

  useEffect(() => {
    AccountSettingService.getBasicInfo(userId)
      .then((res) => {
        setUserData(res.body);
      })
      .finally(() => skeltonLoader(setUserDataLoader));
  }, []);

  const getBilling = () => {
    AdminService.getBilling({
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
        setBillingData(res.body);
        setMetaData(res.meta || {});
      })
      .finally(() => skeltonLoader(setTableLoader));
  };

  return (
    <WxMainXl className="billing_sec">
      <FormHeader title="Billing" backNavigationLink={SETTINGS} />
      {!userDataLoader ? (
        <div className="card p-3 mb-4">
          <div className="row">
            <div className="col-md-4 col-12">
              <span className="text_small">Subscribed to</span>
              <h5 className="m-0 text_h5 text_semibold">
                {activePlan?.title} - {activePlan?.billingCycleName}
              </h5>
            </div>
            <div className="col-md-4 col-12 mt-md-0 mt-3">
              <span className="text_small">Next invoice issue date</span>
              <h5 className="m-0 text_h5 text_semibold">
                {generateDateFormat(
                  user_data?.store_package_renewal_date,
                  "%date% %MM% %yyyy%"
                )}
              </h5>
              <span className="text_body text_secondary">
                Amount: BDT {activePlan?.price}
              </span>
            </div>
            <div className="col-md-4 col-12 mt-md-0 mt-3">
              <span className="text_small">Invoice sent to</span>
              <h5 className="m-0 text_h5 text_semibold">
                {userData?.email || "No Email"}
              </h5>
              <span
                style={{ cursor: "pointer" }}
                className="text_body text_semibold text-success"
                onClick={() =>
                  navigator(ACCOUNT_SETTING + "?basic-info-edit=true")
                }
              >
                Update Email
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded mb-3">
          <UserPlanNInfoSkelton viewBox="0 0 595 80" />
        </div>
      )}

      {!tableLoader ? (
        <div className="card p-3 mb-4">
          {!billingData.length ? (
            <WxNotFound title="No Billing found!" />
          ) : (
            <>
              <BillingTable tableData={billingData} />
              <div className="pagination_div p-4">
                <WxPagination
                  meta={metaData}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  paginationLimit={paginationLimit}
                  setPaginationLimit={setPaginationLimit}
                />
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white rounded ">
          <BillingTableSkelton viewBox="0 0 595 240" />
        </div>
      )}
    </WxMainXl>
  );
};

export default Billing;
