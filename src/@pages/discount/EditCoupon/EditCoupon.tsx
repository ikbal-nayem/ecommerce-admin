import MainLg from "@components/MainContentLayout/MainLg";
import {Button} from "@components/Button";
import {
  WxFormContainer,
  WxFormContent,
  WxFormFooter,
  FormHeader,
  WxFormLeft,
  WxFormRight,
} from "@components/FormLayout";
import WxHr from "@components/WxHr";
import { yupResolver } from "@hookform/resolvers/yup";
import { DISCOUNT } from "routes/path-name.route";
import { CustomerService } from "services/api/Customer.service";
import { DiscountService } from "services/api/Discount.service";
import { GroupService } from "services/api/Group.service";
import { CategoryService } from "services/api/products/Category.services";
import { ProductService } from "services/api/products/Product.services";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import FormValues from "../AddCoupon/FormValues";
import AddCouponDrawer from "../components/AddCouponDrawer/AddCouponDrawer";
import CouponForm from "../components/CouponForm/CouponForm";
import couponFormSchema from "../components/CouponValidation";
import { filterByCheck, objectModification } from "../objUtile";
import "./EditCoupon.scss";
// import FormValues from "./FormValues";

const EditCoupon = () => {
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const drawerComponent: any = useRef();

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

  const [couponDetails, setCouponDetails] = useState<FormValues | any>({});

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
      couponCode: couponDetails?.couponCode,
      maximumDiscount: couponDetails?.maximumDiscount,
      minimumOrderAmount: couponDetails?.minimumOrderAmount,
      minimumQuantityOfItem: couponDetails?.minimumQuantityOfItem,
      maximumUseLimit: couponDetails?.minimumQuantityOfItem,
      maximumUserUseLimit: couponDetails?.maximumUserUseLimit,
      couponDiscountAmount: couponDetails?.couponDiscountAmount,
      products: [],
      categories: [],
      customers: [],
      customerGroups: [],
    },
  });

  const navigate = useNavigate();
  let { id } = useParams();

  const onSubmitting = async (requestData: FormValues) => {
    requestData = objectModification(requestData, checkedData);
    setIsSaving(true);
    DiscountService.fullUpdate(requestData)
      .then((res: any) => {
        navigate(DISCOUNT);
        ToastService.success("Coupon has been edited successfully.");
        reset();
      })
      .catch((err: any) => ToastService.error(err.message))
      .finally(() => setIsSaving(false));
  };

  useEffect(() => {
    id && getCouponDetails();
  }, [id]);

  const getCouponDetails = () => {
    DiscountService.getById({
      id: id,
    })
      .then(async (res: any) => {
        const coupon = res.body;

        await reset({
          ...coupon,
          type_radio: coupon?.couponType,
          fixedAmount:
            coupon?.couponType === "COUPON_TYPE_FIXED_AMOUNT"
              ? coupon?.couponDiscountAmount
              : 0,
          percentage:
            coupon?.couponType === "COUPON_TYPE_PERCENT"
              ? coupon?.couponDiscountAmount
              : 0,
          maximumDiscountCheck: coupon?.maximumDiscount ? true : false,
          minimum_requirement_radio:
            coupon?.minimumOrderAmount > 0
              ? "2"
              : coupon?.minimumQuantityOfItem > 0
              ? "3"
              : "1",
          applicableForRadio: coupon?.isOnlyForProduct
            ? "2"
            : coupon?.isOnlyForProductCategory
            ? "3"
            : "1",
          customerEligibilityRadio: coupon?.isOnlyForCustomer
            ? "3"
            : coupon?.isOnlyForCustomerGroup
            ? "2"
            : "1",
          useLimit_radio: coupon?.maximumUseLimit > 0 ? "2" : "1",
          userLimit_radio: coupon?.maximumUserUseLimit > 0 ? "2" : "1",
          startDate: new Date(coupon?.publishDate),
          startTime: new Date(coupon?.publishDate),
          isContinued: !coupon?.isContinued,
          endDate: coupon.closeDate ? new Date(coupon?.closeDate) : new Date(),
          endTime: coupon.closeDate ? new Date(coupon?.closeDate) : new Date(),
        });
        await setCouponDetails(coupon);

        coupon.isOnlyForProduct && getCheckedProductData(coupon.products);
        coupon.isOnlyForProductCategory &&
          getCheckedCategoryListData(coupon.categories);
        coupon.isOnlyForCustomer && getCheckedCustomersData(coupon.customers);
        coupon.isOnlyForCustomerGroup &&
          getCheckedCustomerGroupsData(coupon.customerGroups);
      })
      .catch((err: any) => ToastService.error(err));
  };

  const requireProperties = (
    data: [],
    id: string | number,
    name: string | number,
    img = null
  ) => {
    const newArray = data.map((obj: any) => {
      return {
        id: obj[id],
        name: obj[name],
        image: img ? obj[img] : null,
      };
    });
    return newArray;
  };

  // get checked data start

  const getCheckedProductData = (productIds) => {
    // to get checked data
    ProductService.getByIds(productIds).then((res) => {
      const preSelectPD = requireProperties(
        res.body,
        "id",
        "title",
        "thumbnail"
      );
      setCheckedData((state) => ({ ...state, products: preSelectPD }));
    });
  };

  const getCheckedCategoryListData = (categoriesIds) => {
    if (categoriesIds) {
      CategoryService.getByIdSet({ ids: categoriesIds }).then((res) => {
        const preSelectCategories = requireProperties(
          res.body,
          "id",
          "name",
          "thumbnail"
        );
        setCheckedData((state) => ({
          ...state,
          categories: preSelectCategories,
        }));
      });
    }
  };

  const getCheckedCustomersData = (customersIds) => {
    // to get checked data
    if (customersIds) {
      CustomerService.getByIdSet(customersIds).then((res) => {
        const preSelectCustomers = requireProperties(
          res.body,
          "id",
          "name",
          "thumbnail"
        );
        setCheckedData((state) => ({
          ...state,
          customers: preSelectCustomers,
        }));
      });
    }
  };

  const getCheckedCustomerGroupsData = (customersGroupIds) => {
    // to get checked data
    if (customersGroupIds) {
      GroupService.getByIdSet(customersGroupIds).then((res) => {
        const preSelectCustomersGroup = requireProperties(
          res.body,
          "id",
          "title",
          "thumbnail"
        );
        setCheckedData((state) => ({
          ...state,
          customerGroups: preSelectCustomersGroup,
        }));
      });
    }
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
    <MainLg>
      <WxFormContainer>
        <FormHeader title="Update Coupon" backNavigationLink={DISCOUNT} />
        <form onSubmit={handleSubmit(onSubmitting)} noValidate>
          <WxFormContent>
            <WxFormLeft>
              <CouponForm
                register={register}
                errors={errors}
                setValue={setValue}
                getValues={getValues}
                setDrawer={setDrawer}
                setDrawerContent={setDrawerContent}
                watch={watch}
                listContent={listContent}
                setListContent={setListContent}
                checkedData={checkedData}
                setCheckedData={setCheckedData}
                filterByCheck={filterByCheck}
              />
            </WxFormLeft>
            <WxFormRight>
              <div className="card wx__form_right">
                <Button disabled={isSaving} type="submit" variant="fill">
                  Update Coupon
                </Button>
                <WxHr />
                <div style={{ maxWidth: "100%" }}>
                  <h6 className="text_h6 text_semibold">Summary</h6>
                  <div className="no_discount_card">
                    {watch("couponDiscountAmount") >= 1 ? (
                      <div className="text-start">
                        <span>{watch("couponCode")}</span>
                        <ul className="m-0">
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
                <div className="d-flex flex-column">
                  <h6 className="text_body text_strong  mb-1">
                    0 Times
                  </h6>
                  <span className="text_small">Coupon Used</span>
                </div>
                <WxHr />
                <div className="d-flex flex-column">
                  <h6 className="text_body text_strong mb-1">
                    0 Hour
                  </h6>
                  <span className="text_small">Remaining Time</span>
                </div>
              </div>
            </WxFormRight>
          </WxFormContent>
          <WxFormFooter
            title="Unsaved Changes"
            // onCancel={onCancel}
            saveButtonText="Update Coupon"
            isSaving={isSaving}
          />
        </form>
        {/* drawer div */}
        {couponDetails.id && drawer && (
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
              isEdit={true}
              productIds={couponDetails.products}
              categoriesIds={couponDetails.categories}
              customersIds={couponDetails.customers}
              customersGroupIds={couponDetails.customerGroups}
              ref={drawerComponent}
            />
          </div>
        )}
      </WxFormContainer>
    </MainLg>
  );
};

export default EditCoupon;
