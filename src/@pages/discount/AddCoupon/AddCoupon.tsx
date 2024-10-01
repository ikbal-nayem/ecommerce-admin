import WxMainLg from "@components/MainContentLayout/WxMainLg";
import WxButton from "@components/WxButton";
import {
  WxFormContainer,
  WxFormFooter,
  WxFormHeader,
} from "@components/WxFormLayout";
import WxHr from "@components/WxHr";
import { yupResolver } from "@hookform/resolvers/yup";
import { DISCOUNT } from "routes/path-name.route";
import { DiscountService } from "services/api/Discount.service";
import { ToastService } from "services/utils/toastr.service";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AddCouponDrawer from "../components/AddCouponDrawer/AddCouponDrawer";
import CouponForm from "../components/CouponForm/CouponForm";
import couponFormSchema from "../components/CouponValidation";
import { filterByCheck, objectModification } from "../objUtile";
import "./AddCoupon.scss";
import FormValues from "./FormValues";

const AddCoupon = () => {
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // drawer states
  const [drawer, setDrawer] = useState<boolean>(false);
  // drawer content states
  const [drawerContent, setDrawerContent] = useState<string>("");

  const [listContent, setListContent] = useState<{
    products: any[];
    categories: any[];
    customers: any[];
    customerGroups: any[];
  }>({
    products: [],
    categories: [],
    customers: [],
    customerGroups: [],
  });

  const [checkedData, setCheckedData] = useState<{
    products: any[];
    categories: any[];
    customers: any[];
    customerGroups: any[];
  }>({
    products: [],
    categories: [],
    customers: [],
    customerGroups: [],
  });

  const navigate = useNavigate();

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    getValues,
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(couponFormSchema),
    defaultValues: {
      couponCode: "",
      type_radio: "COUPON_TYPE_PERCENT",
      minimum_requirement_radio: "1",
      applicableForRadio: "1",
      customerEligibilityRadio: "1",
      useLimit_radio: "1",
      userLimit_radio: "1",
      maximumDiscount: 0,
      minimumOrderAmount: 0,
      minimumQuantityOfItem: 0,
      maximumUseLimit: 0,
      maximumUserUseLimit: 0,
      couponDiscountAmount: 0,
      products: [],
      categories: [],
      customers: [],
      customerGroups: [],
      startDate: new Date(),
      endDate: new Date(),
      startTime: new Date(),
      endTime: new Date(),
    },
  });

  const onSubmitting = async (requestData: FormValues) => {
    requestData = await objectModification(requestData, checkedData);
    setIsSaving(true);
    await DiscountService.addCoupon(requestData)
      .then((res: any) => {
        ToastService.success("Coupon has been added successfully.");
        reset();
        navigate(DISCOUNT);
      })
      .catch((err: any) => ToastService.error(err.message))
      .finally(() => setIsSaving(false));
  };

  const handleClose = () => {
    setDrawer(false);
    setListContent({
      products: [],
      categories: [],
      customers: [],
      customerGroups: [],
    });
  };

  return (
    <WxMainLg>
      <WxFormContainer>
        <WxFormHeader title="Add Coupon" backNavigationLink={DISCOUNT} />
        <form onSubmit={handleSubmit(onSubmitting)} noValidate>
          <div className="row">
            <div className="col-md-8 col-sm-12 wx__mt-3">
              <CouponForm
                register={register}
                errors={errors}
                setValue={setValue}
                getValues={getValues}
                setDrawer={setDrawer}
                setDrawerContent={setDrawerContent}
                listContent={listContent}
                setListContent={setListContent}
                checkedData={checkedData}
                setCheckedData={setCheckedData}
                filterByCheck={filterByCheck}
                watch={watch}
              />
            </div>
            <div className="col-md-4 col-sm-12 wx__mt-3">
              <div className="card wx__form_right">
                <WxButton
                  className="hide-mobile-view"
                  disabled={isSaving}
                  type="submit"
                  variant="fill"
                >
                  Add Coupon
                </WxButton>
                <WxHr className="hide-mobile-view" />
                <div style={{ maxWidth: "100%" }}>
                  <h6 className="wx__text_h6 wx__text_semibold">Summary</h6>
                  <div className="no_discount_card">
                    {watch("couponDiscountAmount") >= 1 ? (
                      <div className="wx__text-start">
                        <span>{watch("couponCode")}</span>
                        <ul className="wx__m-0">
                          {watch("couponDiscountAmount") >= 1 ? (
                            <li>
                              {watch("couponDiscountAmount")}% of
                              {filterByCheck(listContent.products).length
                                ? filterByCheck(listContent.products).length +
                                  " products"
                                : filterByCheck(listContent.categories).length
                                ? filterByCheck(listContent.categories).length +
                                  " categories"
                                : " any products"}
                            </li>
                          ) : (
                            ""
                          )}

                          {watch("minimumOrderAmount") >= 1 ? (
                            <li>
                              Minimum Purchase Amount{" "}
                              {watch("minimumOrderAmount")}
                            </li>
                          ) : (
                            ""
                          )}

                          {watch("minimumQuantityOfItem") >= 1 ? (
                            <li>
                              Minimum Purchase of{" "}
                              {watch("minimumQuantityOfItem")} items
                            </li>
                          ) : (
                            ""
                          )}

                          {watch("startDate") ? (
                            <li>
                              Active from{" "}
                              {new Date(watch("startDate")).toLocaleString(
                                "en-US",
                                {
                                  month: "short",
                                }
                              )}{" "}
                              {new Date(watch("startDate")).getUTCDate()}
                            </li>
                          ) : (
                            ""
                          )}
                        </ul>
                      </div>
                    ) : (
                      <span>
                        After adding coupon discount will be available.
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="card wx__form_right">
                <div className="d-flex wx__flex-column">
                  <h6 className="wx__text_body wx__text_strong  wx__mb-1">
                    0 Times
                  </h6>
                  <span className="wx__text_small">Coupon Used</span>
                </div>
                <WxHr />
                <div className="d-flex wx__flex-column">
                  <h6 className="wx__text_body wx__text_strong wx__mb-1">
                    0 Hour
                  </h6>
                  <span className="wx__text_small">Remaining Time</span>
                </div>
              </div>
            </div>
          </div>
          <WxFormFooter
            title="Unsaved Changes"
            saveButtonText="Add Coupon"
            isSaving={isSaving}
          />
        </form>
        {/* drawer div */}
        {drawer && (
          <div style={{ width: "413px" }}>
            <AddCouponDrawer
              drawer={drawer}
              setDrawer={setDrawer}
              onDrawerClose={handleClose}
              drawerContent={drawerContent}
              setDrawerContent={setDrawerContent}
              listContent={listContent}
              setListContent={setListContent}
              checkedData={checkedData}
              setCheckedData={setCheckedData}
            />
          </div>
        )}
        {/* <DevTool control={control} /> */}
      </WxFormContainer>
    </WxMainLg>
  );
};

export default AddCoupon;
