import * as yup from "yup";

const min = new Date();
const max = new Date();

const couponFormSchema = yup.object({
  couponTitle: yup
    .string()
    .required("Please provide a Discount Name")
    .matches(/^\S/, "This field cannot contain only blankspaces")
    .max(160, "Title must be less than 160 characters"),

  couponCode: yup
    .string()
    .required("Please provide a Discount Code")
    .matches(/^(\S+$)/g, "This field cannot contain only blankspaces")
    .min(5, "Code must be 5 characters")
    .max(100, "Code must be less than 100 characters"),

  type_radio: yup.string().required("Please select"),
  maximumDiscountCheck: yup.boolean(),
  minimum_requirement_radio: yup.string(),
  userLimit: yup.number(),
  useLimit: yup.number(),

  isContinued: yup.boolean(),

  // couponDiscountAmount: yup.number().when("type_radio", {
  //   is: (type_radio) => type_radio === "COUPON_TYPE_PERCENT",
  //   then: yup
  //     .number()
  //     .typeError("Value must be number")
  //     .positive("Must be more than Zero")
  //     .max(100)
  //     .min(1)
  //     .required("Please provide valid number 1 to 100"),
  //   otherwise: yup.number().when("type_radio", {
  //     is: (type_radio) => type_radio === "COUPON_TYPE_FIXED_AMOUNT",
  //     then: yup
  //       .number()
  //       .typeError("Value must be number")
  //       .positive("Must be more than Zero")
  //       .required("Please provide Fixed amount"),
  //   }),
  // }),

  // percentage: yup.number().when("type_radio", {
  //   is: (type_radio) => type_radio === "COUPON_TYPE_PERCENT",
  //   then: yup
  //     .number()
  //     .typeError("Value must be number")
  //     .positive("Must be more than Zero")
  //     .max(100)
  //     .min(1)
  //     .required("Please provide valid number 1 to 100"),
  // }),

  // fixedAmount: yup.number().when("type_radio", {
  //   is: (type_radio) => type_radio === "COUPON_TYPE_FIXED_AMOUNT",
  //   then: yup
  //     .number()
  //     .typeError("Value must be number")
  //     .positive("Must be more than Zero")
  //     .required("Please provide Fixed amount"),
  // }),

  // maximumDiscount: yup.number().when(["type_radio", "maximumDiscountCheck"], {
  //   is: (type_radio: string, maximumDiscountCheck: boolean) =>
  //     type_radio === "COUPON_TYPE_PERCENT" && maximumDiscountCheck,
  //   then: yup
  //     .number()
  //     .typeError("Value must be number")
  //     .positive("Must be more than Zero")
  //     .required("Please provide maximum discount amount"),
  // }),

  // minimumOrderAmount: yup.number().when("minimum_requirement_radio", {
  //   is: (radio) => radio === "2",
  //   then: yup
  //     .number()
  //     .typeError("Value must be number")
  //     .positive("Must be more than Zero")
  //     .required("Please provide minimum purchase amount"),
  // }),

  // minimumQuantityOfItem: yup.number().when("minimum_requirement_radio", {
  //   is: (radio) => radio === "3",
  //   then: yup
  //     .number()
  //     .typeError("Value must be number")
  //     .positive("Must be more than Zero")
  //     .required("Please provide minimum quantity of items"),
  // }),

  // maximumUseLimit: yup.number().when("useLimit_radio", {
  //   is: (radio) => radio === "2",
  //   then: yup
  //     .number()
  //     .typeError("Value must be number")
  //     .positive("Must be more than Zero")
  //     .required("Please provide person purchase limit"),
  // }),

  // maximumUserUseLimit: yup.number().when("userLimit_radio", {
  //   is: (radio) => radio === "2",
  //   then: yup
  //     .number()
  //     .typeError("Value must be number")
  //     .positive("Must be more than Zero")
  //     .required("Please provide person purchase limit"),
  // }),
  // startDate: yup.date().when("endDate", {
  //   is: true,
  //   then: yup
  //     .date()
  //     .required("Please provide start date")
  //     .max(yup.ref("endDate"), "start date can't be before end date"),
  // }),
  // endDate: yup.date().when("isContinued", {
  //   is: (check: boolean) => check,
  //   then: yup
  //     .date()
  //     .required("Please provide end date")
  //     .min(yup.ref("startDate"), "end date can't be before start date"),
  // }),
  startTime: yup
    .date()
    .required()
    .max(yup.ref("endTime"), "start time can't be after end time"),
  endTime: yup
    .date()
    .required()
    .min(yup.ref("startTime"), "end time can't be after end time"),
});

export default couponFormSchema;
