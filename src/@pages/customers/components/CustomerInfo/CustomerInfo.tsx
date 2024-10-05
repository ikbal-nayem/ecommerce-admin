import WxHr from "@components/WxHr";
import WxTag from "@components/WxTag";
import WxThumbnail from "@components/Thumbnail";
import { Fragment } from "react";
import { statusColorMapping } from "utils/colorMap";
import { dateFormate } from "utils/splitDate";
import "./CustomerInfo.scss";

interface CustomerInfoProps {
  customer: any;
  statistics: any;
}

const lastOrderDateTime = (details: any) => {
  const years = details?.lastorderedtime?.years;
  const months = details?.lastorderedtime?.months;
  const days = details?.lastorderedtime?.days;

  if (years && months && days)
    return `${years} Year(s) ${months} Month(s) ${days} Days(s)`;

  if (months && days) return `${months} Month(s) ${days} Days(s)`;

  if (days) return `${days} Days(s)`;

  return "Today";
};

const CustomerInfo = ({ customer, statistics }: CustomerInfoProps) => {
  // states for modal

  return (
    <Fragment>
      <div className="wx__customer_info ">
        <div className=" d-flex justify-space-between  w-100">
          <div className="customer__name d-flex w-100">
            <WxThumbnail name={customer?.customer?.name || ""} />
            <div className="d-block">
              <h6>
                {customer?.customer?.name || ""}
                <WxTag
                  label={customer?.customer?.status || ""}
                  color={statusColorMapping(customer?.customer?.status)}
                />
              </h6>
              <p className="customer_activity">
                Active from{" "}
                {customer?.customer?.activeFrom &&
                  dateFormate(customer?.customer?.activeFrom)}
              </p>
            </div>
          </div>
        </div>
        <WxHr />
        <div className="customer__activity d-flex justify-content-between align-items-center flex-wrap">
          <div className="item">
            <h6>{lastOrderDateTime(statistics)}</h6>
            <p className="sub-text">Last Order</p>
          </div>
          <div className="item">
            <h6>BDT {statistics?.totalspent?.toFixed("2") || "0.00"}</h6>
            <p className="sub-text">Total Spent till today</p>
          </div>
          <div className="item">
            <h6>BDT {statistics?.avgorderamount?.toFixed("2") || "0.00"}</h6>
            <p className="sub-text">Average Order value</p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CustomerInfo;
