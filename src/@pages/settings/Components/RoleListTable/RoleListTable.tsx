import WxDropdown from "@components/WxDropdown/WxDropdown";
import Icon from "@components/Icon";
import { SETTINGS_ROLES_EDIT } from "routes/path-name.route";
import { useState } from "react";
import { Link } from "react-router-dom";
import { generateDateFormat } from "utils/splitDate";
import "./RoleListTable.scss";

interface IRoleTable {
  roleList?: any[];
  onDelete?: (role: any) => void;
}

const RoleListTable = ({ roleList, onDelete }: IRoleTable) => {
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
  const handleDelete = (role) => {
    setShowPopup(!showPopup);
    onDelete(role);
  };

  return (
    <div className="wx__responsive_table">
      <table className="wx__table user_role_table">
        <thead className="wx__thead">
          <tr className="wx__tr">
            <th className="wx__th">Role name</th>
            <th className="wx__th">Note</th>
            <th className="wx__th">Created On</th>
          </tr>
        </thead>
        <tbody className="wx__tbody">
          {roleList?.map((role: any, index: number) => (
            <tr className="wx__tr" key={role?.id}>
              <td className="wx__td">{role?.roleName}</td>
              <td className="wx__td">{role?.note}</td>
              <td className="wx__td" width={140}>
                {generateDateFormat(role?.createdOn, "%date% %MM% %yyyy%")}
              </td>
              <td className="wx__td more">
                <div className="wx__table_cell_more-icon">
                  <Icon
                    icon="more_vert"
                    onClick={() =>
                      role?.hasPermission ? onShowPopup(index) : null
                    }
                    disabled={!role?.hasPermission}
                  />
                  {selectedIndex === index && (
                    <WxDropdown isOpen={showPopup} setIsOpen={setShowPopup}>
                      <ul>
                        <li className="text_subtitle">
                          <Link
                            to={SETTINGS_ROLES_EDIT({ id: role?.id })}
                            className="text_body"
                          >
                            <Icon icon="edit" />
                            Edit
                          </Link>
                        </li>
                        <li className="text_subtitle delete">
                          <a
                            className="text_body"
                            onClick={() => handleDelete(role)}
                          >
                            <Icon icon="delete" />
                            Delete
                          </a>
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

export default RoleListTable;
