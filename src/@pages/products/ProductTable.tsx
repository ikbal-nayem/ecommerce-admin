import WxDropdown from "@components/WxDropdown/WxDropdown";
import WxIcon from "@components/Icon";
import WxThumbnail from "@components/WxThumbnail";
import { IProductTable } from "@interfaces/product.interface";
import { PRODUCT_DETAILS } from "routes/path-name.route";
import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { statusColorMapping } from "utils/colorMap";
import { imageURLGenerate } from "utils/utils";

interface IProductTableProps {
  productsData?: any;
  handleDelete?: (item: any) => void;
}

const TableComponent = ({ productsData, handleDelete }: IProductTableProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const onShowPopup = (index: number) => {
    setSelectedIndex(index);
    setShowPopup(!showPopup);
  };

  const onDelete = (item: any) => {
    setShowPopup(false);
    handleDelete(item);
  };

  return (
    <div className="wx__responsive_table">
      <table className="wx__table">
        <thead className="wx__thead">
          <tr className="wx__tr">
            <th className="wx__th">
              <div className="text_subtitle text_semibold">Name</div>
            </th>
            <th className="wx__th">
              <div className="text_subtitle text_semibold">Status</div>
            </th>
            <th className="wx__th">
              <div className="text_subtitle text_semibold">
                Category
              </div>
            </th>
            <th className="wx__th">
              <div className="text_subtitle text_semibold">Vendor</div>
            </th>
            <th className="wx__th" />
          </tr>
        </thead>
        <tbody className="wx__tbody">
          {productsData?.map((pd: IProductTable, index: number) => (
            <tr className="wx__tr" key={pd?.id}>
              <td className="wx__td">
                <div className="wx__table_cell_avatar wx__product_name">
                  <WxThumbnail
                    name={pd?.title}
                    src={imageURLGenerate(pd?.thumbnail || pd?.images)}
                  />
                  <div className="wx__table_cell_focus_text">
                    <Link to={PRODUCT_DETAILS({ product_id: pd?.id })}>
                      {pd?.title}
                    </Link>
                  </div>
                </div>
              </td>
              <td className="wx__td">
                <div
                  className={`wx__btn_tags ${statusColorMapping(pd?.status)}`}
                >
                  {pd?.status}
                </div>
              </td>
              <td className="wx__td">{pd?.categoryName || "---"}</td>
              <td className="wx__td">{pd?.vendorName || "---"}</td>
              <td className="wx__td">
                <div className="wx__table_cell_more-icon">
                  <WxIcon
                    icon="more_vert"
                    id="triggerId"
                    className="top-0"
                    onClick={() => onShowPopup(index)}
                  />
                  {selectedIndex === index && (
                    <WxDropdown isOpen={showPopup} setIsOpen={setShowPopup}>
                      <ul>
                        <li className="text_subtitle">
                          <Link
                            to={PRODUCT_DETAILS({ product_id: pd.id })}
                            className="text_body"
                          >
                            <WxIcon icon="edit" className="top-0" />
                            <span className="text_body prod-table-dropdown-text">
                              Edit
                            </span>
                          </Link>
                        </li>
                        <li
                          className="text_subtitle"
                          onClick={() => onDelete(pd)}
                        >
                          <a className="text_body text-danger">
                            <WxIcon
                              icon="delete"
                              color="danger"
                              className="top-0"
                            />
                            <span className="text_small top-0 prod-table-dropdown-text">
                              Delete
                            </span>
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
export default memo(TableComponent);
