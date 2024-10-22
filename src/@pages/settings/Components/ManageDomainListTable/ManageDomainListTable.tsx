import WxDropdown from "@components/WxDropdown/WxDropdown";
import Icon from "@components/Icon";
import WxTag from "@components/WxTag";
import { IDomainSettingsItem } from "@interfaces/Settings.interface";
import { useState } from "react";
import { Link } from "react-router-dom";
import { generateDateFormat } from "utils/splitDate";
import "./ManageDomainListTable.scss";

interface IDomainTable {
  domainList: IDomainSettingsItem[];
  onDelete: (domain: IDomainSettingsItem) => void;
  onMarkAsPrimary: (domain: IDomainSettingsItem) => void;
}

const RoleListTable = ({
  domainList,
  onDelete,
  onMarkAsPrimary,
}: IDomainTable) => {
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
    <div className="wx__responsive_table wx__domain_table">
      <table className="wx__table user_role_table">
        <thead className="wx__thead">
          <tr className="wx__tr">
            <th className="wx__th">Domain Name</th>
            <th className="wx__th isConfigured">Configured</th>
            <th className="wx__th">Provider</th>
            <th className="wx__th">Status</th>
            <th className="wx__th">Date Added</th>
          </tr>
        </thead>
        <tbody className="wx__tbody">
          {domainList?.map((domain: IDomainSettingsItem, index: number) => (
            <tr className="wx__tr" key={index}>
              <td className="wx__td" width="30%">
                <p className="text_body">
                  {domain?.domainAddress}
                  {domain?.isFreeSsl || domain?.isOwnSsl ? (
                    <Icon
                      icon="lock"
                      color="success"
                      className="ms_2"
                      hoverTitle="Secured"
                    />
                  ) : (
                    <Icon
                      icon="lock_open"
                      color="danger"
                      className="ms_2"
                      hoverTitle={domain.sslRemarks}
                    />
                  )}
                </p>
              </td>
              <td className="wx__td isConfigured">
                {domain?.isConfigured ? (
                  <Icon icon="done_all" color="success" />
                ) : (
                  <Icon icon="close" color="danger" />
                )}
              </td>
              <td className="wx__td" width="30%">
                {domain?.providerName || "---"}
              </td>
              <td className="wx__td" width={200}>
                {domain?.isPrimary ? (
                  <WxTag label="Primary" color="success" className="me-2" />
                ) : null}
                {domain?.isDefault ? (
                  <WxTag label="default" color="warning" />
                ) : null}
              </td>
              <td className="wx__td" width={150}>
                {generateDateFormat(domain?.createdOn, "%date% %MM% %yyyy%")}
              </td>
              <td className="wx__td more">
                <div className="wx__table_cell_more-icon">
                  <Icon onClick={() => onShowPopup(index)} icon="more_vert" />
                  {selectedIndex === index && (
                    <WxDropdown
                      isOpen={showPopup}
                      setIsOpen={setShowPopup}
                      drop
                    >
                      <ul>
                        {!domain?.isPrimary ? (
                          <li className="text_subtitle">
                            <a onClick={() => onMarkAsPrimary(domain)}>
                              <Icon icon="public" />
                              Make Primary
                            </a>
                          </li>
                        ) : null}
                        {!domain?.isDefault && !domain?.isPrimary ? (
                          <li className="text_subtitle delete">
                            <Link
                              to=""
                              className="text_body"
                              onClick={() => onDelete(domain)}
                            >
                              <Icon icon="delete" />
                              Delete
                            </Link>
                          </li>
                        ) : null}
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
