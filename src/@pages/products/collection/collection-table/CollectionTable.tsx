import WxThumbnail from "@components/WxThumbnail/WxThumbnail";
import { IMAGE_URL } from "config/api-constant";
import React from "react";
import { imageURLGenerate } from "utils/utils";

type CollectionTableProps = {
  data?: any[];
  handleEdit?: Function;
  onDelete?: Function;
  handleVisibility?: Function;
};

const CollectionTable = ({
  data,
  handleEdit,
  onDelete,
}: CollectionTableProps) => {
  return (
    <div >
      <table className="collection_table">
        <thead>
          <tr>
            <th colSpan={2}>Collection Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((sub) => (
            <tr key={sub.id}>
              <td className="collection_image">
                <WxThumbnail
                  name={sub.name}
                  src={imageURLGenerate(sub?.banner || null)}
                />
              </td>
              <th>
                <span>{sub.name}</span>
              </th>
              <td className="more">
                <div className="d-flex align-items-center">
                  <span
                    className="material-icons"
                    role="button"
                    onClick={() => handleEdit(sub)}
                  >
                    edit
                  </span>
                  <div className="d-flex align-items-center ms_2">
                    <span
                      className="material-icons"
                      role="button"
                      onClick={() => onDelete(sub)}
                    >
                      delete
                    </span>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CollectionTable;
