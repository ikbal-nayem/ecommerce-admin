import WxDropdown from "@components/WxDropdown/WxDropdown";
import Icon from "@components/Icon";
import { useState } from "react";

type ItemsProps = {
  level?: number;
  data?: any[];
  sub?: any;
  index?: number;
  space?: number;
  handleEdit?: Function;
  handleVisibility?: Function;
  handleDelete?: Function;
  handleCreateSubcategory?: Function;
};

const TableSubItem = ({
  sub,
  space = 0,
  level,
  index,
  handleEdit,
  handleVisibility,
  handleDelete,
  handleCreateSubcategory,
}: ItemsProps) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const onEdit = () => {
    setShowPopup(false);
    handleEdit(sub);
  };

  const onAddSubcategory = () => {
    setShowPopup(false);
    handleCreateSubcategory(sub);
  };

  const onDelete = () => {
    setShowPopup(false);
    handleDelete(sub);
  };

  if (sub.children.length) {
    return (
      <>
        <ul
          className="wx__ul d-flex justify-content-between"
          style={{ marginLeft: `${space}px` }}
        >
          <li className="wx__li">
            <span className="material-icons me-2" role="button">
              drag_indicator
            </span>
            <span>{sub.name}</span>
          </li>
          <li className="wx__li more">
            <Icon
              icon="more_vert"
              className="inline left"
              onClick={() => setShowPopup(true)}
            />
            <WxDropdown isOpen={showPopup} setIsOpen={setShowPopup}>
              <ul>
                <li className="text_subtitle">
                  <a className="text_body" onClick={onEdit}>
                    <Icon icon="edit" />
                    Edit
                  </a>
                </li>
                {level > 0 && (
                  <li className="text_subtitle">
                    <a className="text_body" onClick={onAddSubcategory}>
                      <Icon icon="add" />
                      Add Submenu
                    </a>
                  </li>
                )}

                {/* <li className="text_subtitle delete">
                  <a className="text_body" onClick={onDelete}>
                    <Icon icon="delete" />
                    Remove from list
                  </a>
                </li> */}
              </ul>
            </WxDropdown>
          </li>
        </ul>
        <TableItems
          level={level - 1}
          data={sub.children}
          space={space + 24}
          handleEdit={handleEdit}
          handleVisibility={handleVisibility}
          handleDelete={handleDelete}
          handleCreateSubcategory={handleCreateSubcategory}
        />
      </>
    );
  }

  return (
    <ul
      className="wx__ul  d-flex justify-content-between"
      style={{ marginLeft: `${space}px` }}
    >
      <li className="wx__li">
        <span className="material-icons me-2" aria-disabled>
          drag_indicator
        </span>
        <span>{sub.name}</span>
      </li>
      <li className="wx__td more">
        <Icon
          icon="more_vert"
          className="inline left"
          onClick={() => setShowPopup(true)}
        />
        <WxDropdown isOpen={showPopup} setIsOpen={setShowPopup}>
          <ul>
            <li className="text_subtitle">
              <a className="text_body" onClick={onEdit}>
                <Icon icon="edit" />
                Edit
              </a>
            </li>
            {level > 0 && (
              <li className="text_subtitle">
                <a className="text_body" onClick={onAddSubcategory}>
                  <Icon icon="add" />
                  Add Submenu
                </a>
              </li>
            )}
            {/* <li className="text_subtitle delete">
              <a className="text_body" onClick={onDelete}>
                <Icon icon="delete" />
                Remove from list
              </a>
            </li> */}
          </ul>
        </WxDropdown>
      </li>
    </ul>
  );
};

const TableItems = ({
  level,
  data,
  space = 0,
  handleEdit,
  handleVisibility,
  handleDelete,
  handleCreateSubcategory,
}: ItemsProps) => {
  return (
    <>
      {data?.map((sub, index) => (
        <TableSubItem
          level={level - 1}
          key={sub.id}
          sub={sub}
          space={space}
          index={index}
          handleEdit={handleEdit}
          handleVisibility={handleVisibility}
          handleDelete={handleDelete}
          handleCreateSubcategory={handleCreateSubcategory}
        />
      ))}
    </>
  );
};

export default TableItems;
