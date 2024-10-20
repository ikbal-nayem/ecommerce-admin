import WxDropdown from "@components/WxDropdown/WxDropdown";
import WxIcon from "@components/Icon";
import Switch from "@components/Switch";
import { IDeliveryZoneItem } from "@interfaces/Settings.interface";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./DeliveryZoneListTable.scss";

interface IDeviveryZoneTable {
  deliveryList: IDeliveryZoneItem[];
  onDelete: (item: IDeliveryZoneItem) => void;
  onEditItem: (data: IDeliveryZoneItem) => void;
  onChangeStatus: (data: IDeliveryZoneItem, isChecked: boolean) => void;
  onAdvanceStatusChange: (data: IDeliveryZoneItem, isChecked: boolean) => void;
  isLoading: boolean;
}

const DeliveryZoneListTable = ({
  deliveryList,
  onDelete,
  onEditItem,
  onChangeStatus,
  onAdvanceStatusChange,
  isLoading,
}: IDeviveryZoneTable) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const onShowPopup = (index: number) => {
    if (selectedIndex === index) {
      setSelectedIndex(0);
      setShowPopup(!showPopup);
      return;
    }
    setSelectedIndex(index);
    setShowPopup(!showPopup);
  };

  return (
    <div className="wx__delivery_zone_list">
      <div className="wx__responsive_table">
        <table className="wx__table user_role_table">
          <thead className="wx__thead">
            <tr className="wx__tr">
              <th className="wx__th">Area Name</th>
              <th className="wx__th">Country</th>
              <th className="wx__th">Delivery Charge</th>
              <th className="wx__th">Pre-booking</th>
              <th className="wx__th">Status</th>
            </tr>
          </thead>
          <tbody className="wx__tbody">
            {deliveryList?.map((item: IDeliveryZoneItem, index: number) => (
              <tr className="wx__tr" key={index}>
                <td className="wx__td" width="40%">
                  {item?.name}
                </td>
                <td className="wx__td">{item?.countryName || "---"}</td>
                <td className="wx__td text-end">
                  ৳ {item?.deliveryChargeAmount}
                </td>
                <td className="wx__td">
                  <Switch
                    defaultChecked={item?.hasAdvanceCharge}
                    checkedTitle="Yes"
                    unCheckedTitle="No"
                    disabled={isLoading}
                    onChange={(e: any) =>
                      onAdvanceStatusChange(item, e.target.checked)
                    }
                  />
                </td>
                <td className="wx__td">
                  <Switch
                    defaultChecked={item?.isActive}
                    checkedTitle="Active"
                    unCheckedTitle="inactive"
                    disabled={isLoading}
                    onChange={(e: any) =>
                      onChangeStatus(item, e.target.checked)
                    }
                  />
                </td>
                <td className="wx__td more">
                  <div className="wx__table_cell_more-icon">
                    <WxIcon
                      icon="more_vert"
                      onClick={() => onShowPopup(index)}
                    />
                    {selectedIndex === index && (
                      <WxDropdown
                        isOpen={showPopup}
                        setIsOpen={setShowPopup}
                        drop
                      >
                        <ul>
                          <li className="text_subtitle">
                            <a
                              className="text_body"
                              onClick={() => onEditItem(item)}
                            >
                              <span className="material-icons-round">edit</span>
                              Edit
                            </a>
                          </li>
                          <li className="text_subtitle delete">
                            <Link
                              to=""
                              className="text_body"
                              onClick={() => onDelete(item)}
                            >
                              <span className="material-icons-round">
                                delete
                              </span>
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
    </div>
  );
};

export default DeliveryZoneListTable;
