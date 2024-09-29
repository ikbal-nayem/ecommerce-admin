import * as yup from "yup";

export const RedXOrderPlaceSchema = yup.object().shape({
  customerName: yup.string().required("Please provide a name"),
  customerPhone: yup.string().required("Please provide a phone number"),
  parcelWeight: yup.number().required("Please provide parcel weight"),
  address: yup.string().required("Please provide customer address"),
  cashCollectionAmount: yup.string().required("Please provide amount"),
  instruction: yup.string(),
  area: yup.string().required("please select area"),
  value: yup.number().required("Please provide value"),
});
