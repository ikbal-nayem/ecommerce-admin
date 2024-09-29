import WxDropdown from "@components/WxDropdown/WxDropdown";
import WxIcon from "@components/WxIcon/WxIcon";
import WxSwitch from "@components/WxSwitch";
import { DISCOUNT_EDIT } from "routes/path-name.route";
import { useState } from "react";
import { Link } from "react-router-dom";
import { generateDateFormat } from "utils/splitDate";

interface ICouponsTable {
  couponsData: any[];
  onDelete: (customerId: string) => void;
  onChangeStatus: (index: number, couponId: string, status: string) => void;
}

const CouponListTable = ({
  couponsData,
  onDelete,
  onChangeStatus,
}: ICouponsTable) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const onShowPopup = (index: number) => {
    // a trigger id is need to show the popup
    if (selectedIndex === index) {
      setSelectedIndex(0);
      setShowPopup(!showPopup);
      return;
    }
    setSelectedIndex(index);
    setShowPopup(!showPopup);
  };

  const deleteFun = (coupon) => {
    setShowPopup(!showPopup);
    onDelete(coupon);
  };

  return (
    <div className="wx__responsive_table">
      <table className="wx__table">
        <thead className="wx__thead">
          <tr className="wx__tr">
            <th className="wx__th">Discount Name</th>
            <th className="wx__th">Coupon Code</th>
            <th className="wx__th">Discount Type</th>
            <th className="wx__th">Status</th>
            <th className="wx__th">Validity Period</th>
            <th className="wx__th"></th>
          </tr>
        </thead>
        <tbody className="wx__tbody">
          {couponsData?.map((coupon: any, index: number) => (
            <tr className="wx__tr" key={coupon?.id}>
              <td className="wx__td td-overflow-hidden">
                <Link
                  to={DISCOUNT_EDIT({ id: coupon.id })}
                  className="wx__text_body hover-underline"
                >
                  {coupon?.couponTitle}
                </Link>
              </td>
              <td className="wx__td">{coupon?.couponCode}</td>
              <td className="wx__td">{coupon?.couponTypeName || ""}</td>
              <td className="wx__td">
                <WxSwitch
                  checkedTitle="Active"
                  unCheckedTitle="Inactive"
                  isChecked={coupon?.status === "Active"}
                  onChange={(e: any) => {
                    onChangeStatus(index, coupon.id, e.target.checked);
                  }}
                />
              </td>
              <td className="wx__td">
                <span>
                  {" "}
                  {generateDateFormat(coupon?.publishDate, "%date%th %MM%")}
                </span>{" "}
                -
                <span
                  className={
                    coupon?.closeDate ? "wx__text-danger" : "wx__text-success"
                  }
                >
                  {coupon?.closeDate
                    ? " " +
                      generateDateFormat(coupon?.closeDate, "%date%th %MM%")
                    : " No expiry Date"}
                </span>
              </td>

              <td className="wx__td more">
                <div className="wx__table_cell_more-icon">
                  <WxIcon
                    icon="more_vert"
                    id="triggerId"
                    onClick={() => onShowPopup(index)}
                  />{" "}
                  {selectedIndex === index && (
                    <WxDropdown isOpen={showPopup} setIsOpen={setShowPopup}>
                      <ul>
                        {/* TODO:: li margin and padding is not set yet */}
                        <li className="wx__text_subtitle">
                          <Link
                            to={DISCOUNT_EDIT({ id: coupon.id })}
                            className="wx__text_body"
                          >
                            <WxIcon icon="edit" />
                            Edit
                          </Link>
                        </li>
                        <li className="wx__text_subtitle delete">
                          <Link
                            to=""
                            className="wx__text_body"
                            onClick={() => deleteFun(coupon)}
                          >
                            <WxIcon icon="delete" />
                            Delete
                          </Link>
                        </li>
                      </ul>
                    </WxDropdown>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CouponListTable;
