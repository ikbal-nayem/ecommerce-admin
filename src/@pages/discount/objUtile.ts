import { ToastService } from "services/utils/toastr.service";
import { dateFormate } from "utils/splitDate";

export const filterByCheck = (data: any[]) =>
  data.filter((check: any) => check.checked);

export const objectModification = (obj: any, content) => {
  // for type radio button
  if (obj.type_radio === "COUPON_TYPE_PERCENT") {
    obj.couponDiscountAmount = obj.percentage;
    obj.fixedAmount = 0;
    obj.maximumDiscountCheck || (obj.maximumDiscount = 0);
  } else if (obj.type_radio === "COUPON_TYPE_FIXED_AMOUNT") {
    // console.log("obj");
    obj.percentage = 0;
    obj.couponDiscountAmount = obj.fixedAmount;
    obj.maximumDiscount = 0;
  } else if (obj.type_radio === "COUPON_TYPE_FREE_SHIPPING") {
    obj.percentage = 0;
    obj.fixedAmount = 0;
    obj.couponDiscountAmount = 0;
    obj.maximumDiscount = 0;
  }
  // end

  // minimum requirement radio
  if (obj.minimum_requirement_radio === "1") {
    obj.minimumOrderAmount = 0;
    obj.minimumQuantityOfItem = 0;
  } else if (obj.minimum_requirement_radio === "2") {
    obj.minimumQuantityOfItem = 0;
  } else if (obj.minimum_requirement_radio === "3") {
    obj.minimumOrderAmount = 0;
  }

  // applicable for radio
  if (obj.applicableForRadio === "1") {
    obj.products = [];
    obj.categories = [];
    obj.isOnlyForProduct = false;
    obj.isOnlyForProductCategory = false;
  } else if (obj.applicableForRadio === "2") {
    obj.products = content.products.map((item) => item.id);
    obj.categories = [];
    obj.isOnlyForProduct = true;
    obj.isOnlyForProductCategory = false;
  } else if (obj.applicableForRadio === "3") {
    obj.products = [];
    obj.categories = content.categories.map((item) => item.id);
    obj.isOnlyForProduct = false;
    obj.isOnlyForProductCategory = true;
  }
  // end

  // customer eligibility
  if (obj.customerEligibilityRadio === "1") {
    obj.customerGroups = [];
    obj.customers = [];
    obj.isOnlyForCustomerGroup = false;
    obj.isOnlyForCustomer = false;
  } else if (obj.customerEligibilityRadio === "2") {
    obj.customers = [];
    obj.customerGroups = content.customerGroups.map((item) => item.id);
    obj.isOnlyForCustomerGroup = true;
    obj.isOnlyForCustomer = false;
  } else if (obj.customerEligibilityRadio === "3") {
    obj.customers = content.customers.map((item) => item.id);
    obj.customerGroups = [];
    obj.isOnlyForCustomerGroup = false;
    obj.isOnlyForCustomer = true;
  }
  // end

  // coupon can be used
  if (obj.useLimit_radio === "1") {
    obj.maximumUseLimit = 0;
  }
  // end

  // user can use coupon
  if (obj.userLimit_radio === "1") {
    obj.maximumUserUseLimit = 0;
  }
  // end

  // isContinued
  if (!obj.isContinued) {
    obj.endDate = 0;
    obj.endTime = 0;
    obj.closeDate = null;
  } else {
    // Concatenation start date and start time
    obj.closeDate = new Date(
      dateFormate(obj.endDate, "iso") + " " + dateFormate(obj.endTime, "time")
    ).toISOString();
  }

  obj.publishDate = new Date(
    dateFormate(obj.startDate, "iso") + " " + dateFormate(obj.startTime, "time")
  ).toISOString();

  if (
    obj.isContinued &&
    JSON.stringify(obj.publishDate) >= JSON.stringify(obj.closeDate)
  ) {
    ToastService.error("Please provide valid date time ");
    return;
  }
  obj.isContinued = !obj.isContinued;

  obj.couponType = obj.type_radio;

  // delete unnecessary object properties
  delete obj.startDate;
  delete obj.startTime;
  delete obj.endDate;
  delete obj.endTime;
  delete obj.type_radio;
  delete obj.useLimit_radio;
  delete obj.userLimit_radio;
  delete obj.maximumDiscountCheck;
  delete obj.minimum_requirement_radio;

  return obj;
  // end
};
