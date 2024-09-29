import WxSelect from "@components/Select/WxSelect";
import WxDropdown from "@components/WxDropdown/WxDropdown";
import WxIcon from "@components/WxIcon/WxIcon";
import WxInput from "@components/WxInput";
import WxThumbnail from "@components/WxThumbnail/WxThumbnail";
import { ProductService } from "services/api/products/Product.services";
import { LocalStorageService } from "services/utils/localStorage.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { memo, useState } from "react";
import { imageURLGenerate } from "utils/utils";
import "./InventoryTable.scss";

interface InventoryTableProps {
  inventoryData: any[];
  reasonList: any[];
  setInventoryData: any;
}

const InventoryTable = ({
  inventoryData,
  reasonList,
  setInventoryData,
}: InventoryTableProps) => {
  const [selectedIndex, setSelectedIndex] = useState<any>("");
  const [selectQuantityIndex, setSelectedQuantityIndex] = useState<any>("");

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [isSaving, setIsSaveing] = useState<boolean>(false);

  const userData: any = LocalStorageService.get("user_data") || {};

  const { store_currency_code } = userData;

  const onShowPopup = (index: number) => {
    setSelectedIndex(showPopup ? null : index);
    setShowPopup(!showPopup);
  };

  const onChangeReason = (value, index, pd) => {
    if (!value.target.value) return;
    const reason = JSON.parse(value.target.value);

    pd.reason = reason;
    pd.quantity = productQuantity(pd, pd.adjustment);

    inventoryData[index] = pd;
    setInventoryData([...inventoryData]);
  };
  const handleSave = (index, product: any) => {
    if (+product.quantity < 0) {
      ToastService.error("Quantity must be more then or equal 'Zero'!");
      return;
    }
    setIsSaveing(true);
    ProductService.updateProductQuantity({
      productId: product.id,
      variantId: product.variantId,
      quantity: product.quantity || 0,
      adjustment: product.adjustment || 0,
      referenceId: product?.reason?.id || reasonList[0].id,
      remarks:
        product?.reason?.title ||
        reasonList.find((item) => item.isDefault)?.title,
    })
      .then((res) => {
        inventoryData[index]["quantity"] = res.body.quantity;
        inventoryData[index]["isUpdate"] = false;
        inventoryData[index]["initialQuantity"] = res.body.quantity;
        inventoryData[index]["adjustment"] = 0;
        setInventoryData([...inventoryData]);
        ToastService.success(res.message);
        setShowPopup(false);
        setSelectedIndex("");
        setSelectedQuantityIndex("");
      })
      .catch((err) => {
        ToastService.error(err.message);
      })
      .finally(() => setIsSaveing(false));
  };

  const handleChanges = (e: any, index, productInfo: any) => {
    // productInfo.isRest = false;
    // console.log(productInfo);
    productInfo.quantity = Number(e.target.value) || 0;
    // productInfo.quantity = Number(e.target.value) || 0;
    productInfo.adjustment = Number(e.target.value)
      ? Number(e.target.value) - productInfo.initialQuantity
      : 0;

    productInfo.isUpdate =
      (Number(productInfo.initialQuantity) || 0) !==
      (Number(productInfo.quantity) || 0);

    inventoryData[index] = productInfo;
    setInventoryData([...inventoryData]);
    setSelectedQuantityIndex(index);
  };

  const handleClose = (index: number) => {
    // setSelectedIndex(0);
    inventoryData[index]["quantity"] = inventoryData[index].initialQuantity;
    inventoryData[index]["isUpdate"] = false;
    // inventoryData[index]["isRest"] = true;
    inventoryData[index]["adjustment"] = 0;
    setInventoryData([...inventoryData]);
    setShowPopup(false);
    setSelectedIndex("");
    setSelectedQuantityIndex("");
    // setTimeout(() => {
    //   inventoryData[index]["isRest"] = true;
    //   setInventoryData([...inventoryData]);
    // }, 500);
  };

  const onChangeAdjustment = (e: any, index: any, productInfo) => {
    productInfo.adjustment = Number(e.target.value) || 0;
    productInfo.quantity = productQuantity(
      productInfo,
      Number(e.target.value) || 0
    );

    productInfo.isUpdate =
      (Number(productInfo.initialQuantity) || 0) !==
      (Number(productInfo.quantity) || 0);

    inventoryData[index] = productInfo;
    setInventoryData([...inventoryData]);
  };

  const productQuantity = (productInfo, qty: number) => {
    const operation = productInfo?.reason?.description || "ALL";

    if (operation === "ADD")
      productInfo.quantity = (productInfo.initialQuantity || 0) + Math.abs(qty);

    if (operation === "SUB")
      productInfo.quantity = (productInfo.initialQuantity || 0) - Math.abs(qty);

    if (operation === "ALL")
      productInfo.quantity = (productInfo.initialQuantity || 0) + qty;

    return productInfo.quantity;
  };

  const handleOnkeyPress = (e: any, pd, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave(index, pd);
    }
  };

  const adjustIconClick = (pd: any, index?: number) => {
    onShowPopup(index);
    setSelectedQuantityIndex(index);
  };

  return (
    <div className="wx__responsive_table inventory-list-table">
      <table className="wx__table">
        <thead className="wx__thead">
          <tr className="wx__tr">
            <th className="wx__th">Product</th>
            <th className="wx__th">Regular Price</th>
            <th className="wx__th">Selling Price</th>
            <th className="wx__th">SKU</th>
            <th className="wx__th">Availability</th>
          </tr>
        </thead>
        <tbody className="wx__tbody">
          {inventoryData?.map((pd, index) => (
            <tr className="wx__tr" key={index}>
              <td className="wx__td">
                <div className="wx__table_cell_avatar wx__d-flex wx__align-items-center">
                  <WxThumbnail
                    name={pd?.title.toUpperCase()}
                    src={imageURLGenerate(pd?.thumbnail || pd?.images)}
                  />
                  <div className="wx__table_cell_focus_text wx__flex-column ">
                    <div className="text-overflow-hidden">{pd?.title}</div>
                    <div className="text-overflow-hidden">
                      {pd?.options?.map((item: any, indx: number) => (
                        <span
                          className="wx__text_small wx__text-secondary"
                          key={item?.key}
                        >
                          {item?.key} - {item?.value} {indx <= 0 ? "/ " : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </td>
              <td className="wx__td">
                {store_currency_code} {pd?.regularPrice?.toLocaleString()}
              </td>
              <td className="wx__td">
                {store_currency_code} {pd?.sellingPrice?.toLocaleString()}
              </td>
              <td className="wx__td">
                <div className="wx__text_body">{pd?.sku || "---"}</div>
              </td>
              <td className="wx__td">
                <div className="wx__table_cell_icon  wx__d-flex ">
                  <div className="avaiability_input">
                    <WxInput
                      onChange={(e: any) => handleChanges(e, index, pd)}
                      type="number"
                      key={
                        selectedIndex === index
                          ? pd?.quantity
                          : pd.initialQuantity
                      }
                      defaultValue={pd?.quantity}
                      isAutoFocus={
                        selectedIndex !== index && selectQuantityIndex === index
                      }
                      isDisabled={selectedIndex === index}
                      onKeyPress={(e: any) => handleOnkeyPress(e, pd, index)}
                      onFocus={(e) => {
                        e.target.select();
                      }}
                      min={0}
                    />
                  </div>
                  {selectedIndex === index && (
                    <WxDropdown
                      id="triggerPlace"
                      isOpen={showPopup}
                      setIsOpen={setShowPopup}
                      drop={false}
                    >
                      <div className="wx__availability_popup">
                        <div>
                          <div className="wx__mb-2">
                            <p className="wx__text_subtitle wx__text_semibold wx__d-block">
                              Adjust By
                            </p>
                            <WxInput
                              type="number"
                              defaultValue={pd.adjustment || "0"}
                              onChange={(e: any) =>
                                onChangeAdjustment(e, index, pd)
                              }
                              onKeyPress={(e: any) =>
                                handleOnkeyPress(e, pd, index)
                              }
                              isAutoFocus={selectedIndex === index}
                              onFocus={(e) => e.target.select()}
                            />
                          </div>
                          <p className="wx__my-3 wx__text_small quantity_text">
                            Original Quantity: {pd?.initialQuantity}
                          </p>
                          <WxSelect
                            valuesKey="object"
                            textKey="title"
                            options={reasonList}
                            onChange={(e: any) => onChangeReason(e, index, pd)}
                            defaultValue={JSON.stringify(
                              reasonList.find((item) => item.isDefault)
                            )}
                          />
                        </div>
                      </div>
                    </WxDropdown>
                  )}
                  <div className="action-section">
                    <div className="inventory-action wx__d-flex wx__align-items-center">
                      <WxIcon
                        icon="tune"
                        variants="round"
                        onClick={(e: any) => {
                          adjustIconClick(pd, index);
                        }}
                        className={`material-icons-round adjustQuantity_icon ${
                          (selectedIndex === index || pd.isUpdate) &&
                          "show-icon"
                        }`}
                      />

                      <div className="action-buttons wx__d-flex ">
                        {(selectedIndex === index || pd.isUpdate) && (
                          <div
                            onClick={(e: any) => {
                              pd.quantity = pd.quantity;
                              handleSave(index, pd);
                            }}
                            className={
                              isSaving || !pd.isUpdate
                                ? "action-btn checked"
                                : "action-btn checked active"
                            }
                            style={{
                              pointerEvents:
                                isSaving || !pd.isUpdate ? "none" : "painted",
                            }}
                          >
                            {isSaving &&
                            (selectedIndex === index ||
                              selectQuantityIndex === index) ? (
                              <Preloader absolutePosition />
                            ) : null}
                            <WxIcon icon="checked" disabled={isSaving} />
                          </div>
                        )}

                        {selectedIndex === index && (
                          <div
                            onClick={(e: any) => handleClose(index)}
                            className="action-btn close"
                          >
                            <WxIcon icon="close" />
                          </div>
                        )}
                      </div>
                    </div>
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
export default memo(InventoryTable);
