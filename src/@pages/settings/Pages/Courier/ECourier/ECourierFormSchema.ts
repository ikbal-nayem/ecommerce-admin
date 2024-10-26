import * as yup from "yup";

export const ECourierSchema = yup.object().shape(
  {
    pick_contact_person: yup
      .string()
      .required("Please provide a pickup contact name")
      // .matches(/^(\S+$)/g, "This field cannot contain only blankspaces")
      .max(120, "name must be less than 120 characters"),
    // pick_contact_person: yup
    //   .string()
    //   .required("Please provide a pickup contact name")
    //   // .matches(/^(\S+$)/g, "This field cannot contain only blankspaces")
    //   .max(120, "name must be less than 120 characters"),
    // pick_division: yup.string(),
    pick_district: yup
      .string()
      .required("Please provide a pickup district name"),
    // pick_thana: yup.string().when("pick_district", {
    //   is: (value) => value,
    //   then: yup.string().required("please select a thana"),
    // }),
    // pick_union: yup.string().when("pick_thana", {
    //   is: (value) => value,
    //   then: yup
    //     .string()
    //     .required("please enter a postcode")
    //     .matches(/^[0-9]*$/g, "This field can contain only number"),
    // }),
    pick_address: yup.string().required("please fill address"),
    // pick_mobile: yup.number().required("please enter phone number"),
    // .nullable()
    accountNo: yup
      .string()
      .required("please enter account number")
      .typeError("value must be number"),
    bankName: yup.string().required("please enter bank name"),
    bankBranch: yup.string().required("please enter bank name"),
    accountHolderName: yup.string().required("please enter bank name"),
    bkash: yup
      .string()
      .matches(/^[0-9]*$/g, "This field can contain only number"),
    // bkashType: yup.string().when("bkash", {
    //   is: (value) => value,
    //   then: yup.string().required("please enter bkash type"),
    // }),
    rocket: yup
      .string()
      .matches(/^[0-9]*$/g, "This field can contain only number"),
    // rocketType: yup.string().when("rocket", {
    //   is: (value) => value,
    //   then: yup.string().required("please enter rocket type"),
    // }),
  },
  [["bkash", "bkash"]]
);
