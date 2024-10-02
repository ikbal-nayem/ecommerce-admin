import WxSelect from "@components/Select/WxSelect";
import WxButton from "@components/Button";
import WxDropdown from "@components/WxDropdown/WxDropdown";
import WxIcon from "@components/Icon";
import TextInput from "@components/TextInput";
import WxThumbnail from "@components/WxThumbnail/WxThumbnail";
import { memo, useState } from "react";
import "./InventoryTable.scss";
interface InventoryTableProps {
  inventoryData: any[];
  reasonList: any[];
  handleSave: Function;
  adjustValue: number;
  setAdjustValue: any;
}

const InventoryTable = ({
  inventoryData,
  handleSave,
  reasonList,
  adjustValue,
  setAdjustValue,
}: InventoryTableProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const onShowPopup = (index: number) => {
    setSelectedIndex(index);
    setShowPopup(!showPopup);
  };

  const onChangeGroup = (value, pd) => {
    const reason = JSON.parse(value.target.value);
    pd.reason = reason;
  };

  const handleChanges = (e: any, pd: any) => {
    const changeQuantity = Number(e.target.value);
    if (pd.quantity === changeQuantity) {
      pd.saveBtn = false;
      setAdjustValue(0);
    } else {
      pd.saveBtn = true;
      setAdjustValue(changeQuantity - pd.quantity);
      pd.quantity = changeQuantity;
    }
  };

  const adjustIconClick = (pd: any, index?: number) => {
    // console.log(pd);
    pd.saveBtn = !pd.saveBtn;

    // console.log(pd.quantity, quantity);
    // if (pd.quantity) {
    //   console.log(pd.quantity, quantity);
    //   pd.saveBtn = false;
    // } else {
    //   pd.saveBtn = true;
    // }
  };

  return (
    <div className="wx__responsive_table">
      <table className="wx__table">
        <thead className="wx__thead">
          <tr className="wx__tr">
            <th className="wx__th">Product</th>
            <th className="wx__th">Regular Price</th>
            <th className="wx__th">Selling Price</th>
            <th className="wx__th">SKU</th>
            <th className="wx__th">Availability</th>
            <th className="wx__th"></th>
          </tr>
        </thead>
        <tbody className="wx__tbody">
          {inventoryData?.map((pd, index) => {
            // adding new properties to object
            pd.reason = {
              id: "bd64cfce-46ff-4e52-bdf3-5817c3382ae1",
              title: "Correction",
              metaType: "QUANTITY_ADJUSTMENT_TYPE",
              isDefault: true,
            };
            pd.adjustValue = 0;
            // setQuantity(pd?.quantity);
            // end

            return (
              <tr className="wx__tr" key={index}>
                <td className="wx__td">
                  <div className="wx__table_cell_avatar d-flex align-items-center">
                    <WxThumbnail
                      name={pd?.title}
                      src={pd?.images[0]?.previewUrl}
                    />
                    <div className="wx__table_cell_focus_text flex-column">
                      <div>{pd?.title}</div>
                      <div className="">
                        {pd?.options?.map((item: any, indx) => {
                          return (
                            <span
                              className="text_small text-secondary"
                              key={indx}
                            >
                              {item?.key} - {item?.value}{" "}
                              {indx <= 0 ? "/ " : ""}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="wx__td">{pd?.regularPrice}</td>
                <td className="wx__td">
                  <div className="wx__table_cell_multi-lines">
                    {pd?.sellingPrice}
                  </div>
                </td>
                <td className="wx__td">
                  <div className="text_body">{pd?.sku || "---"}</div>
                </td>
                <td className="wx__td">
                  <div className="wx__table_cell_icon  d-flex ">
                    <div className="avaiability_input">
                      {/* {setQuantity(pd.quantity)} */}
                      <TextInput
                        // onBlur={(e: any) => {
                        //   // pd.quantity = Number(e.target.value);
                        //   // setQuantity(Number(e.target.value));
                        // }}
                        onChange={(e: any) => {
                          handleChanges(e, pd);
                          pd.adjustValue = Number(e.target.value) + pd.quantity;
                        }}
                        type="number"
                        min={0}
                        defaultValue={pd?.quantity}
                      />
                    </div>
                    {JSON.stringify(pd.adjustValue)}
                    {selectedIndex === index && (
                      <WxDropdown
                        id="triggerPlace"
                        isOpen={showPopup}
                        setIsOpen={setShowPopup}
                        backdrop={false}
                      >
                        <div className="wx__availability_popup">
                          <div>
                            <div>
                              <TextInput
                                label="Adjust By"
                                type="number"
                                defaultValue={pd.adjustValue}
                                onChange={(e: any) => {
                                  setAdjustValue(Number(e.target.value));
                                  pd.adjustValue = Number(e.target.value);
                                  console.log(Number(e.target.value));
                                  pd.saveBtn = true;
                                }}
                              />
                            </div>
                            <p className="my-3 text_small quantity_text">
                              Original Quantity: {pd?.quantity}
                            </p>
                            <WxSelect
                              defaultValue="All groups"
                              valuesKey="object"
                              textKey="title"
                              options={reasonList}
                              onChange={(e: any) => onChangeGroup(e, pd)}
                            />
                          </div>
                        </div>
                      </WxDropdown>
                    )}
                    {/* <span
                      onClick={(e: any) => {
                        onShowPopup(index);
                        // e.target.classList.toggle("show-icon");
                        adjustIconClick(pd);
                      }}
                      // style={
                      //   showPopup ? { display: "block" } : { display: "none" }
                      // }

                      className={`material-icons-round adjustQuantity_icon ${
                        showPopup && selectedIndex === index && "show-icon"
                      }`}
                    >
                      commit
                    </span> */}

                    <WxIcon
                      icon="commit"
                      variants="round"
                      onClick={(e: any) => {
                        onShowPopup(index);
                        // e.target.classList.toggle("show-icon");
                        adjustIconClick(pd);
                      }}
                      className={`material-icons-round adjustQuantity_icon ${
                        showPopup && selectedIndex === index ? "show-icon" : ""
                      }`}
                    />
                    {pd?.saveBtn && selectedIndex === index && (
                      <>
                        <WxButton
                          onClick={(e: any) => {
                            pd.quantity = pd.quantity;
                            console.log(adjustValue);
                            handleSave(pd);
                          }}
                          variant="fill"
                          size="sm"
                        >
                          Save
                        </WxButton>
                      </>
                    )}
                  </div>
                </td>
                <td className="wx__td"></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default memo(InventoryTable);
