import DateInput from "@components/DatePicker/DateInput";
import {Button} from "@components/Button";
import Checkbox from "@components/Checkbox";
import WxHr from "@components/WxHr";
import Icon from "@components/Icon";
import TextInput from "@components/TextInput";
import WxRadio from "@components/WxRadio/WxRadio";
import WxThumbnail from "@components/Thumbnail";
import { useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import useDebounce from "utils/debouncer";
import makeSlug from "utils/make-slug";
import { dateFormate } from "utils/splitDate";
import { imageURLGenerate } from "utils/utils";
import "./CouponForm.scss";

interface ICouponForm {
  register?: Function;
  errors?: any;
  listContent?: {
    products: any[];
    categories: any[];
    customers: any[];
    customerGroups: any[];
  };
  setListContent?: any;
  checkedData?: {
    products: any[];
    categories: any[];
    customers: any[];
    customerGroups: any[];
  };
  setCheckedData?: Function;
  setValue?: any;
  watch?: any;
  getValues?: any;
  setDrawer?: any;
  setDrawerContent?: any;
  filterByCheck?: Function;
}

const CouponForm = ({
  register,
  errors,
  listContent,
  setListContent,
  checkedData,
  setCheckedData,
  setValue,
  setDrawer,
  setDrawerContent,
  filterByCheck,
  watch,
  getValues,
}: ICouponForm) => {
  const dCoupon = useDebounce(watch("couponCode"), 300);
  const couponCode = makeSlug(dCoupon);

  const handleDelete = (content: string, id: number) => {
    setCheckedData((state) => ({
      ...state,
      [content]: state[content].filter((item) => item.id !== id),
    }));
  };

  useEffect(() => {
    setValue("couponCode", makeSlug(couponCode));
  }, [couponCode]);

  return (
    <>
      <div className="wx__order_form">
        <div className="card p-4 wx__order_product">
          <h5 className="mb-0">Discount Code</h5>
          <div className="row">
            <div className="col-lg-6 col-md-12 col-sm-6 mt-4">
              <div className="input-group">
                <TextInput
                  className="mb-0"
                  placeholder="For example : Summer Offer 01"
                  label="Discount Name"
                  isRequired
                  registerProperty={{
                    ...register("couponTitle"),
                  }}
                  errorMessage={errors.couponTitle?.message}
                  color={errors.couponTitle ? "danger" : "secondary"}
                />
                <span className="text_subtitle text-secondary mt-2">
                  Customers want see this name
                </span>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-sm-6 mt-4">
              <div className="input-group">
                <TextInput
                  className="mb-0"
                  placeholder="Type Code"
                  label="Discount Code"
                  isRequired
                  registerProperty={{
                    ...register("couponCode"),
                  }}
                  errorMessage={errors.couponCode?.message}
                  color={errors.couponCode ? "danger" : "secondary"}
                />
                <span className="text_subtitle text-secondary mt-2">
                  Customers will enter this discount code during checkout
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="card wx__order_payment">
          <h5 className="mb-4">Type</h5>
          <WxRadio
            id="typeRadio1"
            name="typeRadioButton"
            returnValue="label"
            value="COUPON_TYPE_PERCENT"
            singleUse={true}
            label="Percentage"
            registerProperty={{
              ...register("type_radio"),
            }}
          >
            {watch("type_radio") === "COUPON_TYPE_PERCENT" && (
              <div className="w-md-50 my-3">
                <TextInput
                  placeholder="Type value here"
                  endIcon={<Icon variants="round" icon="percent" />}
                  isRequired
                  registerProperty={{
                    ...register("percentage"),
                  }}
                  errorMessage={errors.percentage?.message}
                  type="number"
                  defaultValue={0}
                  min={0}
                  max={100}
                  maxLength={3}
                  color={errors.percentage ? "danger" : "secondary"}
                  onFocus={(e) => e.target.select()}
                />
                <div>
                  <Checkbox
                    id="typeRadioButton"
                    label="Set maximum discount amount"
                    // checked={watch("maximumDiscount") > 0 ? true : false}
                    registerProperty={{
                      ...register("maximumDiscountCheck"),
                    }}
                  />
                  {watch("maximumDiscountCheck") && (
                    <TextInput
                      placeholder="Set Max Amount"
                      endIcon={'৳'}
                      isRequired
                      registerProperty={{
                        ...register("maximumDiscount"),
                      }}
                      errorMessage={errors.maximumDiscount?.message}
                      color={errors.maximumDiscount ? "danger" : "secondary"}
                      onFocus={(e) => e.target.select()}
                    />
                  )}
                </div>
              </div>
            )}
          </WxRadio>
          <WxRadio
            id="typeRadio2"
            name="typeRadioButton"
            returnValue="label"
            value="COUPON_TYPE_FIXED_AMOUNT"
            singleUse={true}
            label="Fixed Amount"
            registerProperty={{
              ...register("type_radio"),
            }}
          >
            {watch("type_radio") === "COUPON_TYPE_FIXED_AMOUNT" && (
              <div className="w-md-50  my-3">
                <TextInput
                  placeholder="Type value here"
                  endIcon={'৳'}
                  isRequired
                  defaultValue={0}
                  registerProperty={{
                    ...register("fixedAmount"),
                  }}
                  type="number"
                  errorMessage={errors.fixedAmount?.message}
                  color={errors.fixedAmount ? "danger" : "secondary"}
                  onFocus={(e) => e.target.select()}
                />
              </div>
            )}
          </WxRadio>
          <WxRadio
            id="typeRadio3"
            name="typeRadioButton"
            returnValue="label"
            value="COUPON_TYPE_FREE_SHIPPING"
            singleUse={true}
            label="Free Shipping"
            registerProperty={{
              ...register("type_radio"),
            }}
          />
        </div>
        <div className="card p-4 wx__order_payment">
          <h5 className="mb-3">Minimum Requirement</h5>
          <WxRadio
            id="requireRadio1"
            name="minimumRequirement"
            returnValue="label"
            value="1"
            singleUse={true}
            label="None"
            registerProperty={{
              ...register("minimum_requirement_radio"),
            }}
          />
          <WxRadio
            id="requireRadio2"
            name="minimumRequirement"
            returnValue="label"
            value="2"
            singleUse={true}
            label="Minimum purchase amount"
            registerProperty={{
              ...register("minimum_requirement_radio"),
            }}
          >
            {watch("minimum_requirement_radio") === "2" && (
              <div className="w-md-50 my-3">
                <TextInput
                  placeholder="Type value here"
                  endIcon={'৳'}
                  isRequired
                  defaultValue={0}
                  registerProperty={{
                    ...register("minimumOrderAmount"),
                  }}
                  type="number"
                  errorMessage={errors.minimumOrderAmount?.message}
                  color={errors.minimumOrderAmount ? "danger" : "secondary"}
                  onFocus={(e) => e.target.select()}
                />
              </div>
            )}
          </WxRadio>
          <WxRadio
            id="requireRadio3"
            name="minimumRequirement"
            returnValue="label"
            value="3"
            singleUse={true}
            label="Minimum quantity of items"
            registerProperty={{
              ...register("minimum_requirement_radio"),
            }}
          >
            {watch("minimum_requirement_radio") === "3" && (
              <div className="w-md-50 my-3">
                <TextInput
                  placeholder="Type value here"
                  registerProperty={{
                    ...register("minimumQuantityOfItem"),
                  }}
                  type="number"
                  errorMessage={errors.minimumQuantityOfItem?.message}
                  color={errors.minimumQuantityOfItem ? "danger" : "secondary"}
                  onFocus={(e) => e.target.select()}
                />
              </div>
            )}
          </WxRadio>
        </div>
        <div className="card p-4 wx__order_payment">
          <h5 className="mb-4">Applicable For</h5>
          <WxRadio
            id="applicableForRadio1"
            name="applicableFor"
            returnValue="label"
            value="1"
            singleUse={true}
            label="Any products"
            registerProperty={{
              ...register("applicableForRadio"),
            }}
          />

          <WxRadio
            id="applicableForRadio2"
            name="applicableFor"
            returnValue="label"
            value="2"
            singleUse={true}
            label="Specific product"
            registerProperty={{
              ...register("applicableForRadio"),
            }}
          >
            {/* {J} */}
            {watch("applicableForRadio") === "2" && (
              <div className="my-3">
                <Button
                  onClick={() => {
                    setDrawer(true);
                    setDrawerContent("products");
                  }}
                  variant="outline"
                  color="primary"
                >
                  Browse Products
                </Button>
                {checkedData?.products.map((pd: any, index: number) => {
                  return (
                    <div
                      key={pd.id}
                      className="w-100 my-3 d-flex align-items-center justify-content-between"
                    >
                      <div className="d-flex">
                        <WxThumbnail src={imageURLGenerate(pd.image)} />
                        <div className="ms_2">
                          <p className="m-0">{pd.name}</p>
                          <span className="text_subtitle text-secondary"></span>
                        </div>
                      </div>
                      <div>
                        {/* <Icon
                          onClick={() => {
                            setDrawer(true);
                            setDrawerContent("products");
                          }}
                          variants="round"
                          icon="edit"
                          className="text-primary"
                        /> */}
                        <Icon
                          onClick={() => {
                            handleDelete("products", pd?.id);
                          }}
                          variants="round"
                          icon="delete"
                          className="text-danger"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </WxRadio>
          <WxRadio
            id="applicableForRadio3"
            name="applicableFor"
            returnValue="label"
            value="3"
            singleUse={true}
            label="Specific category"
            registerProperty={{
              ...register("applicableForRadio"),
            }}
          >
            {watch("applicableForRadio") === "3" && (
              <div className="my-3">
                <Button
                  onClick={() => {
                    setDrawer(true);
                    setDrawerContent("categories");
                  }}
                  variant="outline"
                  color="primary"
                >
                  Browse Categories
                </Button>
                {checkedData.categories.map(
                  (categories: any, index: number) => {
                    return (
                      <div
                        key={categories.id}
                        className="w-100 my-3 d-flex align-items-center justify-content-between"
                      >
                        <div className="d-flex">
                          <WxThumbnail
                            src={imageURLGenerate(categories.image)}
                          />
                          <div className="ms_2">
                            <p className="m-0">{categories.name}</p>
                            <span className="text_subtitle text-secondary">
                              {/* (5 of 8 variant selected) */}
                            </span>
                          </div>
                        </div>
                        <div>
                          {/* <Icon
                            onClick={() => {
                              setDrawer(true);
                              setDrawerContent("categories");
                            }}
                            variants="round"
                            icon="edit"
                            className="text-primary"
                          /> */}
                          <Icon
                            onClick={() => {
                              handleDelete("categories", categories?.id);
                            }}
                            variants="round"
                            icon="delete"
                            className="text-danger"
                          />
                        </div>
                      </div>
                    );
                  }
                )}
                <WxHr />
              </div>
            )}
          </WxRadio>
        </div>
        <div className="card p-4 wx__order_payment">
          <h5 className="mb-4">Customer Eligibility</h5>
          <WxRadio
            id="customerEligibilityRadio1"
            name="customerEligibility"
            returnValue="label"
            value="1"
            singleUse={true}
            label="Everyone"
            registerProperty={{
              ...register("customerEligibilityRadio"),
            }}
          />
          <WxRadio
            id="customerEligibilityRadio2"
            name="customerEligibility"
            returnValue="label"
            value="2"
            singleUse={true}
            label="Specific customer group"
            registerProperty={{
              ...register("customerEligibilityRadio"),
            }}
          >
            {watch("customerEligibilityRadio") === "2" && (
              <div className="my-3">
                <Button
                  onClick={() => {
                    setDrawer(true);
                    setDrawerContent("customerGroups");
                  }}
                  variant="outline"
                  color="primary"
                >
                  Browse customer group
                </Button>

                {checkedData.customerGroups.map((group: any, index: any) => {
                  return (
                    <div
                      key={group.id}
                      className="w-100 my-3 d-flex align-items-center justify-content-between"
                    >
                      <div className="d-flex">
                        <WxThumbnail />
                        <div className="ms_2">
                          <p className="m-0">{group.name}</p>
                          <span className="text_subtitle text-secondary">
                            {/* (5 of 8 variant selected) */}
                          </span>
                        </div>
                      </div>
                      <div>
                        {/* <Icon
                          onClick={() => {
                            setDrawer(true);
                            setDrawerContent("customerGroups");
                          }}
                          variants="round"
                          icon="edit"
                          className="text-primary"
                        /> */}
                        <Icon
                          onClick={() => {
                            handleDelete("customerGroups", group.id);
                          }}
                          variants="round"
                          icon="delete"
                          className="text-danger"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </WxRadio>
          <WxRadio
            id="customerEligibilityRadio3"
            name="customerEligibility"
            returnValue="label"
            value="3"
            singleUse={true}
            label="Specific customer"
            registerProperty={{
              ...register("customerEligibilityRadio"),
            }}
          >
            {watch("customerEligibilityRadio") === "3" && (
              <div className="my-3">
                <Button
                  onClick={() => {
                    setDrawer(true);
                    setDrawerContent("customers");
                  }}
                  variant="outline"
                  color="primary"
                >
                  Browse customer
                </Button>
                {checkedData.customers.map((customer: any, index: number) => {
                  return (
                    <div
                      key={customer.id}
                      className="w-100 my-3 d-flex align-items-center justify-content-between"
                    >
                      <div className="d-flex">
                        <WxThumbnail />
                        <div className="ms_2">
                          <p className="m-0">{customer?.name || ""}</p>
                          <span className="text_subtitle text-secondary">
                            {/* (5 of 8 variant selected) */}
                          </span>
                        </div>
                      </div>
                      <div>
                        {/* <Icon
                          onClick={() => {
                            setDrawer(true);
                            setDrawerContent("customers");
                          }}
                          icon="edit"
                          variants="round"
                          className="text-primary"
                        /> */}
                        <Icon
                          onClick={() => {
                            handleDelete("customers", customer.id);
                            // setListContent({
                            //   ...listContent,
                            //   ...listContent["customers"],
                            // });
                          }}
                          variants="round"
                          icon="delete"
                          className="text-danger"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </WxRadio>
        </div>
        <div className="card p-4 wx__order_payment">
          <h5 className="mb-4">Usage Limit</h5>
          <div>
            <p className="subtitle_form">
              How many times this coupon can be used?
            </p>
            <WxRadio
              id="couponLimitRadio1"
              name="couponLimit"
              returnValue="label"
              value="1"
              singleUse={true}
              label="Unlimited"
              registerProperty={{
                ...register("useLimit_radio"),
              }}
            />
            <WxRadio
              id="couponLimitRadio2"
              name="couponLimit"
              returnValue="label"
              value="2"
              singleUse={true}
              label="Set Value"
              registerProperty={{
                ...register("useLimit_radio"),
              }}
            >
              {watch("useLimit_radio") === "2" && (
                <div className="w-md-50 my-3">
                  <TextInput
                    placeholder="Type value here"
                    isRequired
                    helpText={
                      <span className="text_subtitle text-secondary">
                        Limit number of times discount can be used in total
                      </span>
                    }
                    registerProperty={{
                      ...register("maximumUseLimit"),
                    }}
                    errorMessage={errors.maximumUseLimit?.message}
                    color={errors.maximumUseLimit ? "danger" : "secondary"}
                    onFocus={(e) => e.target.select()}
                  />
                </div>
              )}
            </WxRadio>
          </div>
          <div className="my-3">
            <p className="subtitle_form">
              How many times a single person can purchase this?
            </p>
            <WxRadio
              id="personPurchaseLimitRadio1"
              name="personPurchase"
              returnValue="label"
              value="1"
              singleUse={true}
              label="Unlimited"
              registerProperty={{
                ...register("userLimit_radio"),
              }}
            />
            <WxRadio
              id="personPurchaseLimitRadio2"
              name="personPurchase"
              returnValue="label"
              value="2"
              singleUse={true}
              label="Set Value"
              registerProperty={{
                ...register("userLimit_radio"),
              }}
            >
              {watch("userLimit_radio") === "2" && (
                <div className="w-md-50 my-3">
                  <TextInput
                    placeholder="Type value here"
                    helpText={
                      <span className="text_subtitle text-secondary">
                        Limit number of times discount can be used in total
                      </span>
                    }
                    isRequired
                    registerProperty={{
                      ...register("maximumUserUseLimit"),
                    }}
                    errorMessage={errors.maximumUserUseLimit?.message}
                    color={errors.maximumUserUseLimit ? "danger" : "secondary"}
                    onFocus={(e) => e.target.select()}
                  />
                </div>
              )}
            </WxRadio>
          </div>
        </div>
        <div className="card p-4 wx__order_payment">
          <h5 className="mb-0">Date & Time</h5>
          <div>
            <div className="row">
              <div className="col-lg-9 col-md-12">
                <DateInput
                  date={watch("startDate")}
                  setDate={(val: any) => {
                    const date = new Date(
                      dateFormate(val, "iso") +
                        "T" +
                        dateFormate(watch("startTime"), "time")
                    );
                    setValue("startDate", date);
                  }}
                  label="Start Date"
                  placeholder="DD / MM / YYYY"
                  registerProperty={{
                    ...register("startDate"),
                  }}
                  endIcon={<Icon variants="round" icon="calendartoday" />}
                  errorMessage={errors.startDate?.message}
                  color={errors.startDate ? "danger" : "secondary"}
                />
              </div>

              <div className="col-lg-3 col-md-12">
                <DateInput
                  label="Start Time (+06)"
                  type="time"
                  timeCaption="Time"
                  timeFormate="h:mm aa"
                  timeIntervals={15}
                  time={watch("startTime")}
                  setTime={(val: any) => {
                    const time = new Date(
                      dateFormate(watch("startDate"), "iso") +
                        "T" +
                        dateFormate(val, "time")
                    );
                    setValue("startTime", time);
                  }}
                  startIcon={<Icon variants="round" icon="schedule" />}
                  // time={startDate.toString()}
                  // onChange={(date) => setStartDate(date)}
                  registerProperty={{
                    ...register("startTime"),
                  }}
                  errorMessage={errors.startTime?.message}
                  color={errors.startTime ? "danger" : "secondary"}
                />
              </div>
            </div>
            <Checkbox
              id="sdf"
              label="Set end date"
              registerProperty={{
                ...register("isContinued"),
              }}
            />
            {watch("isContinued") && (
              <div className="row">
                <div className="col-lg-9 col-md-12">
                  <DateInput
                    date={watch("endDate")}
                    setDate={(val: any) => {
                      const date = new Date(
                        dateFormate(val, "iso") +
                          "T" +
                          dateFormate(watch("endTime"), "time")
                      );
                      setValue("endDate", date);
                    }}
                    label="End Date"
                    registerProperty={{
                      ...register("endDate"),
                    }}
                    endIcon={<Icon variants="round" icon="calendartoday" />}
                    errorMessage={errors.endDate?.message}
                    color={errors.endDate ? "danger" : "secondary"}
                  />
                </div>

                <div className="col-lg-3 col-md-12">
                  <DateInput
                    label="End Time (+06)"
                    type="time"
                    time={watch("endTime")}
                    setTime={(val: any) => {
                      const time = new Date(
                        dateFormate(watch("endDate"), "iso") +
                          "T" +
                          dateFormate(val, "time")
                      );
                      setValue("endTime", time);
                    }}
                    timeCaption="Time"
                    timeFormate="h:mm aa"
                    timeIntervals={15}
                    startIcon={<Icon variants="round" icon="schedule" />}
                    registerProperty={{
                      ...register("endTime"),
                    }}
                    errorMessage={errors.endTime?.message}
                    color={errors.endTime ? "danger" : "secondary"}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CouponForm;
