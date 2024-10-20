import WxDropdown from "@components/WxDropdown/WxDropdown";
import WxIcon from "@components/Icon";
import Switch from "@components/Switch";
import { ROLE_KEY } from "config/constants";
import { SETTINGS_SITE_OPERATOR_EDIT } from "routes/path-name.route";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./SiteOperatorListTable.scss";

interface ICouponsTable {
  siteOperatorData: any[];
  onDelete: (customerId: string) => void;
  onChangeStatus: (index: number, couponId: string, status: string) => void;
}

const SiteOperatorListTable = ({
  siteOperatorData,
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
      <table className="wx__table site_operator_table">
        <thead className="wx__thead">
          <tr className="wx__tr">
            <th className="wx__th">Role name</th>
            <th className="wx__th">Name</th>
            <th className="wx__th">Email</th>
            <th className="wx__th">Phone</th>
            <th className="wx__th">Status</th>
            <th />
          </tr>
        </thead>
        <tbody className="wx__tbody">
          {siteOperatorData?.map((operator: any, index: number) => (
            <tr className="wx__tr" key={operator?.id || index}>
              <td className="wx__td">{operator?.roleName}</td>
              <td className="wx__td">{operator?.name || "---"}</td>
              <td className="wx__td">{operator?.email || "---"}</td>
              <td className="wx__td">{operator?.phone || "---"}</td>
              <td className="wx__td" width={100}>
                <Switch
                  checkedTitle="Active"
                  unCheckedTitle="Inactive"
                  isChecked={
                    operator?.isActive ||
                    operator?.role_code === ROLE_KEY.MERCHANT ||
                    operator?.isActive === null
                  }
                  disabled={operator?.roleCode === ROLE_KEY.MERCHANT}
                  onChange={(e: any) => {
                    onChangeStatus(index, operator.id, e.target.checked);
                  }}
                />
              </td>
              <td className="wx__td" width={30}>
                <div className="wx__table_cell_more-icon">
                  <WxIcon
                    role="button"
                    icon="more_vert"
                    id="triggerId"
                    disabled={operator?.roleCode === ROLE_KEY.MERCHANT}
                    onClick={() => {
                      operator?.roleCode !== ROLE_KEY.MERCHANT &&
                        onShowPopup(index);
                    }}
                  />
                  {selectedIndex === index && (
                    <WxDropdown isOpen={showPopup} setIsOpen={setShowPopup}>
                      <ul>
                        <li className="text_subtitle">
                          <Link
                            key={operator.id}
                            to={SETTINGS_SITE_OPERATOR_EDIT({
                              id: operator.id,
                            })}
                            className="text_body"
                          >
                            <WxIcon icon="edit" />
                            Edit
                          </Link>
                        </li>
                        <li className="text_subtitle delete">
                          <Link
                            to=""
                            className="text_body"
                            onClick={() => deleteFun(operator)}
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

export default SiteOperatorListTable;
