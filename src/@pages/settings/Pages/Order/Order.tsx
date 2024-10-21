import WxMainMd from "@components/MainContentLayout/WxMainMd";
import WxCheckbox from "@components/Checkbox";
import { WxFormFooter, FormHeader } from "@components/FormLayout";
import WxHr from "@components/WxHr";
import TextInput from "@components/TextInput";
import { IOrderSettingsResponse } from "@interfaces/order.interface";
import { SETTINGS } from "routes/path-name.route";
import { OrderSettingService } from "services/api/settings/Order.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import "./Order.scss";

const Order = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [readMoreFlag, setReadMoreFlag] = useState<boolean>(false);
  const [orderSetting, setOrderSetting] = useState<IOrderSettingsResponse>();
  const [errorIndex, setErrorIndex] = useState<number[]>([]);

  useEffect(() => {
    OrderSettingService.getSettingsList()
      .then((res) => setOrderSetting(res.body))
      .catch((err) => ToastService.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChecked = (type: string, value: boolean, index: number) => {
    const newOrderSetting = { ...orderSetting };
    newOrderSetting[type][index].isChecked = value;
    newOrderSetting[type][index].dayCount = value ? 14 : null;
    setOrderSetting(newOrderSetting);
  };

  const handleDaycountChange = (value: string, index: number) => {
    const newOrderSetting = { ...orderSetting };
    const dayCount = parseInt(value);
    newOrderSetting.orderStatusList[index].dayCount =
      dayCount < 1 ? 1 : dayCount || null;
    setOrderSetting(newOrderSetting);
  };

  const handleSubmit = () => {
    setErrorIndex([]);
    const errors = [];
    orderSetting?.orderStatusList?.forEach((val, idx) => {
      if (val.isEditable && val.isChecked && !val.dayCount) {
        errors.push(idx);
      }
    });
    setErrorIndex(errors);
    if (!errors.length) {
      setSaving(true);
      OrderSettingService.update(orderSetting)
        .then((resp) => {
          ToastService.success(resp.message);
        })
        .finally(() => setSaving(false));
    }
  };

  if (loading) return <Preloader />;

  return (
    <WxMainMd className="setting_order_page">
      <FormHeader title="Order" backNavigationLink={SETTINGS} />
      <div className="card p-3 mt-4">
        <h6 className="text_heading text_semibold">
          Online Store Nature
        </h6>
        <div className="order_btn_group row">
          <div className="col-md-6 col-sm-12">
            <div
              className={`order_btn_single ${
                orderSetting?.isAcceptOrder ? "active" : ""
              }`}
              onClick={() =>
                setOrderSetting((prev) => ({
                  ...prev,
                  isAcceptOrder: true,
                }))
              }
            >
              <div className="me-2">
                <input
                  className="form-check-input"
                  type="radio"
                  id="redio__0"
                  checked={orderSetting?.isAcceptOrder}
                  name="fav_language"
                  style={{ cursor: "pointer" }}
                  readOnly
                />
              </div>
              <div>
                <h5 className="text_heading text_semibold mb-3">
                  Accept order
                </h5>
                <p className="text_subtitle text_regular">
                  Accept Order enabled means the eCommerce mechanism is active.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-12">
            <div
              className={`order_btn_single noselect${
                !orderSetting?.isAcceptOrder ? "active" : ""
              }`}
              // onClick={() =>
              //   setOrderSetting((prev) => ({
              //     ...prev,
              //     isAcceptOrder: false,
              //   }))
              // }
            >
              <div className="me-2">
                <input
                  className="form-check-input"
                  type="radio"
                  id="redio__0"
                  checked={!orderSetting?.isAcceptOrder}
                  name="fav_language"
                  style={{ cursor: "pointer" }}
                  readOnly
                />
              </div>
              <div className="showcase_order_btn">
                <h5 className="text_heading text_semibold mb-3">
                  Only Product Showcase
                </h5>
                <p className="text_subtitle text_regular">
                  Only Product Showcase enabled means, the Cart, Checkout,
                  Payment scel
                  {readMoreFlag ? (
                    <span>
                      erisque enim ligula venenatis dolor. Maecenas nisl est,
                      ultrices nec congue eget, auctor vitae massa. Fusce luctus
                      vestibulum augue ut aliquet.
                    </span>
                  ) : (
                    <span
                      className="read__more"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReadMoreFlag(true);
                      }}
                    >
                      ... Read More
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {orderSetting?.isAcceptOrder ? (
        <>
          <div className="card p-3 mt-3">
            <h6 className="text_heading text_semibold">
              Order status Type
            </h6>
            <p className="text_body text_regular">
              Some status can't be edited
            </p>
            {orderSetting?.orderStatusList?.map((orderStatus, index) => (
              <div key={orderStatus?.id}>
                <div className="d-flex align-items-start">
                  <WxCheckbox
                    disabled={!orderStatus?.isEditable}
                    checked={orderStatus?.isChecked}
                    onChange={(e) =>
                      handleChecked("orderStatusList", e.target.checked, index)
                    }
                  />
                  <div>
                    <p
                      className={`text_body text_strong ${
                        !orderStatus?.isEditable ? "disabled" : ""
                      }`}
                    >
                      {orderStatus?.title}:{" "}
                      <span className="text_body text_regular">
                        {orderStatus?.description}
                      </span>
                    </p>
                    {orderStatus?.isEditable && orderStatus?.isChecked ? (
                      <div className="mt-3">
                        <TextInput
                          value={
                            orderStatus?.dayCount ? orderStatus?.dayCount : ""
                          }
                          type="number"
                          endIcon="days"
                          min={1}
                          onChange={(e) =>
                            handleDaycountChange(e.target.value, index)
                          }
                          onFocus={(e) => e.target.select()}
                          color={
                            errorIndex.some((i) => i === index)
                              ? "danger"
                              : "primary"
                          }
                          errorMessage={
                            errorIndex.some((i) => i === index)
                              ? "This field is required!"
                              : ""
                          }
                        />
                        <p className="text_subtitle text_regular">
                          Specify order completion days
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
                <WxHr />
              </div>
            ))}
          </div>

          <div className="card p-3 mt-3">
            <h6 className="text_heading text_semibold">
              Payment Status Types
            </h6>
            <p className="text_body text_regular">
              Some status cant be edited
            </p>
            {orderSetting?.paymentStatusList?.map((paymentStatus, index) => (
              <div key={paymentStatus?.id}>
                <div className="d-flex align-items-start">
                  <WxCheckbox
                    disabled={!paymentStatus?.isEditable}
                    checked={paymentStatus?.isChecked}
                    onChange={(e) =>
                      handleChecked(
                        "paymentStatusList",
                        e.target.checked,
                        index
                      )
                    }
                  />
                  <p
                    className={`text_body text_strong ${
                      !paymentStatus?.isEditable ? "disabled" : ""
                    }`}
                  >
                    {paymentStatus?.title}:{" "}
                    <span className="text_body text_regular">
                      {paymentStatus?.description}
                    </span>
                  </p>
                </div>
                <WxHr />
              </div>
            ))}
          </div>
        </>
      ) : null}
      <div className="mt-3">
        <WxFormFooter
          saveButtonText="Save Changes"
          onClickSave={handleSubmit}
          isSaving={saving}
        />
      </div>
    </WxMainMd>
  );
};
export default Order;
