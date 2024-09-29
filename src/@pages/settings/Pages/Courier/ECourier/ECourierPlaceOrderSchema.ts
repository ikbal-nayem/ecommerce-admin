import * as yup from "yup";

export const ECourierPlaceOrderSchema = yup.object().shape({
  recipient_address: yup
    .string()
    .required("Please provide a recipient address"),
  recipient_city: yup.string().required("Please select a city"),
  recipient_thana: yup.string().when("recipient_city", {
    is: (value) => value,
    then: yup.string().required("please select a thana"),
  }),
  recipient_zip: yup.string().when("recipient_thana", {
    is: (value) => value,
    then: yup.string().required("please select a postcode"),
  }),
  recipient_area: yup.string().required("please select area"),
  // pick_mobile: yup.number().required("please enter phone number"),
  // .nullable()
  comment: yup.string().required("please enter comment"),
  //   package_code: yup.object().required("please enter bank name"),
  //   product_price: yup.string().required("please enter bank name"),
  requested_delivery_time: yup.string().required("please select date"),
  package: yup.string().required("select package"),
});
