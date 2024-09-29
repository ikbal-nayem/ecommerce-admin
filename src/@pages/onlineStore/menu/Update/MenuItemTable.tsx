import WxDropdown from "@components/WxDropdown/WxDropdown";
import WxIcon from "@components/WxIcon/WxIcon";
import WxSwitch from "@components/WxSwitch";
import { useState } from "react";

type ItemsProps = {
  data?: any[];
  sub?: any;
  level?: number;
  index?: number;
  space?: number;
  handleEdit?: Function;
  handleVisibility?: Function;
  handleDelete?: Function;
  onStatusChange?: Function;
  handleCreateSubcategory?: Function;
};

const TableSubItem = ({
  sub,
  space = 0,
  index,
  level,
  handleEdit,
  handleVisibility,
  handleDelete,
  onStatusChange,
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
          className="wx__ul wx__d-flex wx__justify-content-between"
          style={{ marginLeft: `${space}px` }}
        >
          <li className="wx__li">
            <span className="material-icons wx__me-2" role="button">
              drag_indicator
            </span>
            <span>{sub.name}</span>
          </li>
          <li className="wx__td more wx__d-flex wx__align-items-center">
            <WxSwitch
              key={sub?.isActive}
              checkedTitle="Active"
              unCheckedTitle="Inactive"
              defaultChecked={sub?.isActive === false ? false : true}
              onChange={(e: any) => {
                onStatusChange(sub, e.target.checked);
              }}
            />
            <div className="wx__ms-1"></div>
            <WxIcon
              icon="more_vert"
              className="inline left wx__ms-5"
              onClick={() => setShowPopup(true)}
            />
            <WxDropdown isOpen={showPopup} setIsOpen={setShowPopup}>
              <ul>
                <li className="wx__text_subtitle">
                  <a className="wx__text_body" onClick={onEdit}>
                    <WxIcon icon="edit" />
                    Edit
                  </a>
                </li>
                {level > 0 && (
                  <li className="wx__text_subtitle">
                    <a className="wx__text_body" onClick={onAddSubcategory}>
                      <WxIcon icon="add" />
                      Add Submenu
                    </a>
                  </li>
                )}
                <li className="wx__text_subtitle delete">
                  <a className="wx__text_body" onClick={onDelete}>
                    <WxIcon icon="delete" />
                    Remove from list
                  </a>
                </li>
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
          onStatusChange={onStatusChange}
          handleDelete={handleDelete}
          handleCreateSubcategory={handleCreateSubcategory}
        />
      </>
    );
  }

  return (
    <ul
      className="wx__ul wx__d-flex wx__justify-content-between"
      style={{ marginLeft: `${space}px` }}
    >
      <li className="wx__li">
        <span className="material-icons wx__me-2" aria-disabled>
          drag_indicator
        </span>
        <span>{sub.name}</span>
      </li>
      <li className="wx__td more wx__d-flex wx__align-items-center">
        <WxSwitch
          key={sub?.isActive}
          className="wx__mb-auto"
          checkedTitle="Active"
          unCheckedTitle="Inactive"
          defaultChecked={sub?.isActive === false ? false : true}
          onChange={(e: any) => {
            onStatusChange(sub, e.target.checked);
          }}
        />
        <WxIcon
          icon="more_vert"
          className="inline left wx__ms-5"
          onClick={() => setShowPopup(true)}
        />
        <WxDropdown isOpen={showPopup} setIsOpen={setShowPopup}>
          <ul>
            <li className="wx__text_subtitle">
              <a className="wx__text_body" onClick={onEdit}>
                <WxIcon icon="edit" />
                Edit
              </a>
            </li>
            {level > 0 && (
              <li className="wx__text_subtitle">
                <a className="wx__text_body" onClick={onAddSubcategory}>
                  <WxIcon icon="add" />
                  Add Submenu
                </a>
              </li>
            )}

            <li className="wx__text_subtitle delete">
              <a className="wx__text_body" onClick={onDelete}>
                <WxIcon icon="delete" />
                Remove from list
              </a>
            </li>
          </ul>
        </WxDropdown>
      </li>
    </ul>
  );
};

const TableItems = ({
  data,
  space = 0,
  level,
  handleEdit,
  handleVisibility,
  handleDelete,
  onStatusChange,
  handleCreateSubcategory,
}: ItemsProps) => {
  return (
    <>
      {data?.map(
        (sub, index) =>
          sub?.id && (
            <TableSubItem
              key={sub.id}
              level={level - 1}
              sub={sub}
              space={space}
              index={index}
              onStatusChange={onStatusChange}
              handleEdit={handleEdit}
              handleVisibility={handleVisibility}
              handleDelete={handleDelete}
              handleCreateSubcategory={handleCreateSubcategory}
            />
          )
      )}
    </>
  );
};

export default TableItems;
