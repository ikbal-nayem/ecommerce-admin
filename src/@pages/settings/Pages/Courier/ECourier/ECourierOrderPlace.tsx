import DateInput from "@components/DatePicker/DateInput";
import WxMainLg from "@components/MainContentLayout/MainLg";
import WxSelect from "@components/Select/Select";
import {Button} from "@components/Button";
import { WxFormContainer, FormHeader } from "@components/FormLayout";
import WxIcon from "@components/Icon";
import TextInput from "@components/TextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { ORDER_DETAILS } from "routes/path-name.route";
import { ECourierService } from "services/api/courier/ECourier.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { orderDetailsByID } from "store/reducers/ordersReducer";
import { dispatch } from "store/store";
import { generateDateFormat } from "utils/splitDate";
import { dateAction } from "utils/utils";
import { ECourierPlaceOrderSchema } from "./ECourierPlaceOrderSchema";

interface IECourierFiled {
  recipient_address: string;
  recipient_city: string;
  recipient_thana: string;
  recipient_zip: string;
  recipient_area: string;
  comment: string;
  requested_delivery_time: string;
  package: string;
  package_code: string;
  product_price: string;
}

const ECourierOrderPlace = () => {
  const orders = useSelector((state: any) => state.orders);
  const { orderDetails } = orders;

  const {
    register,
    handleSubmit,
    watch,
    control,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IECourierFiled>({
    resolver: yupResolver(ECourierPlaceOrderSchema),
    defaultValues: {
      requested_delivery_time: dateAction(-1, "day"),
    },
  });

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [districts, setDistricts] = useState([]);
  const [thana, setThana] = useState([]);
  const [postCodeList, setPostCodeList] = useState([]);
  const [packageList, setPackageList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [areaList, setAreaList] = useState([]);

  const navigate = useNavigate();
  const { order_id } = useParams();

  const capitalize = (word = "Comilla") => {
    return word[0].toUpperCase() + word.substring(1).toLowerCase();
  };

  useEffect(() => {
    if (!Object.keys(orderDetails).length) {
      dispatch(orderDetailsByID(order_id));
    }
    reset({
      recipient_address: orderDetails?.shippingAddress?.addressLine1,
      recipient_city: capitalize(orderDetails?.shippingAddress?.cityName),
    });
  }, [orderDetails]);

  useEffect(() => {
    Promise.allSettled([getCity(), getPackageList(), getBranchList()]);
  }, []);

  useEffect(() => {
    watch("recipient_city") && getThana(watch("recipient_city"));
  }, [watch("recipient_city"), orderDetails]);

  useEffect(() => {
    const requireOBJ = {
      city: watch("recipient_city"),
      thana: watch("recipient_thana"),
    };
    watch("recipient_city") &&
      watch("recipient_thana") &&
      getPostcodeList(requireOBJ);
  }, [watch("recipient_thana")]);

  useEffect(() => {
    watch("recipient_zip") && getAreaList(watch("recipient_zip"));
  }, [watch("recipient_zip")]);

  const getCity = () => {
    setIsSearching(true);
    setValue("recipient_thana", "");
    setValue("recipient_zip", "");
    setValue("recipient_area", "");
    setThana([]);
    setPostCodeList([]);
    setAreaList([]);

    ECourierService.eCourierCity()
      .then((res) => setDistricts(res.body))
      .catch((err) => ToastService.error(err.message))
      .finally(() => setIsSearching(false));
  };

  const getThana = (city = "dhaka") => {
    setIsSearching(true);
    setValue("recipient_zip", "");
    setValue("recipient_area", "");
    setPostCodeList([]);
    setAreaList([]);
    ECourierService.eCourierThana(city)
      .then((res) => {
        setThana(res.body);
      })
      .catch((err) => ToastService.error(err.message))
      .finally(() => setIsSearching(false));
  };

  const getPostcodeList = (requireOBJ: any) => {
    setIsSearching(true);
    setAreaList([]);
    setValue("recipient_area", "");
    ECourierService.eCourierPostcode(requireOBJ)
      .then((res) => setPostCodeList(res.body))
      .catch((err) => ToastService.error(err.message))
      .finally(() => setIsSearching(false));
  };

  const getPackageList = () => {
    ECourierService.eCourierPackageList()
      .then((res) => setPackageList(res.body))
      .catch((err) => ToastService.error(err.message));
  };

  const getBranchList = () => {
    ECourierService.eCourierBranchList()
      .then((res) => setBranchList(res.body))
      .catch((err) => ToastService.error(err.message));
  };
  const getAreaList = (postcode: string) => {
    setIsSearching(true);
    ECourierService.eCourierAreaList(postcode)
      .then((res) => setAreaList(res.body))
      .catch((err) => ToastService.error(err.message))
      .finally(() => setIsSearching(false));
  };

  const handlePackageValue = (obj) => {
    const packageOBJ = JSON.parse(obj);
    setValue("package_code", packageOBJ.package_code);
    setValue("product_price", packageOBJ.shipping_charge);
  };

  const onsubmit = (data) => {
    setIsSaving(true);
    data.requested_delivery_time = generateDateFormat(
      data.requested_delivery_time,
      "%yyyy%/%mm%/%dd%"
    );
    delete data.package;
    ECourierService.eCourierPlaceOrder({
      ...data,
      webx_order_id: order_id,
    })
      .then((res) => {
        ToastService.success(res.message);
        navigate(ORDER_DETAILS({ order_id: order_id }));
      })
      .catch((err) => ToastService.error(err.message))
      .finally(() => setIsSaving(false));
  };

  return (
    <WxMainLg className="delivery_zone_sec">
      <WxFormContainer>
        <form onSubmit={handleSubmit(onsubmit)}>
          <FormHeader
            title="E-Courier Info"
            backNavigationLink={ORDER_DETAILS({ order_id: order_id })}
          />
          {isSearching && <Preloader absolutePosition={true} />}
          <div className="row">
            <div className="col-lg-8 col-md-12 col-sm-12">
              <div className="card p-4 mb-3">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <TextInput
                      label="Customer Address"
                      registerProperty={{
                        ...register("recipient_address"),
                      }}
                      placeholder="write here"
                      isRequired
                      color={errors?.recipient_address ? "danger" : "secondary"}
                      errorMessage={errors?.recipient_address?.message}
                    />
                  </div>
                  {/* <div className="col-lg-6 col-md-12 col-sm-6">
                    <WxSelect
                      label="Branch List"
                      options={branchList}
                      placeholder="Select Branch"
                      valuesKey="name"
                      textKey="name"
                      isRequired
                      // value={value}
                      // onChange={onChange}
                      isDisabled={!branchList?.length}
                      registerProperty={{
                        ...register("branch"),
                      }}
                      // color={error ? "danger" : "secondary"}
                      // errorMessage={error && "District/City is required!"}
                    />
                  </div> */}
                  <div className="col-lg-6 col-md-12 col-sm-6">
                    <WxSelect
                      label="Package List"
                      options={packageList}
                      placeholder="Select Package"
                      valuesKey="object"
                      textKey="package_name"
                      isRequired
                      registerProperty={{
                        ...register("package", {
                          onChange: (e) => handlePackageValue(e.target.value),
                        }),
                      }}
                      // value={value}
                      // onChange={onChange}
                      isDisabled={!packageList?.length}
                      color={errors?.package ? "danger" : "secondary"}
                      errorMessage={
                        errors?.package && "District/City is required!"
                      }
                    />
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-6">
                    <Controller
                      control={control}
                      name="recipient_city"
                      rules={{ required: true }}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <WxSelect
                          label="District/City"
                          options={districts}
                          placeholder="Select District/City"
                          valuesKey="name"
                          textKey="name"
                          isRequired
                          value={value}
                          onChange={onChange}
                          isDisabled={!districts?.length}
                          color={error ? "danger" : "secondary"}
                          errorMessage={error && "District/City is required!"}
                        />
                      )}
                    />
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-6">
                    <Controller
                      control={control}
                      name="recipient_thana"
                      rules={{ required: false }}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <WxSelect
                          label="Customer Thana"
                          options={thana}
                          placeholder="Select thana"
                          valuesKey="name"
                          textKey="name"
                          isRequired
                          value={value}
                          onChange={onChange}
                          isDisabled={!thana?.length}
                          color={error ? "danger" : "secondary"}
                          errorMessage={error && "Thana is required!"}
                        />
                      )}
                    />
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-6">
                    <Controller
                      control={control}
                      name="recipient_zip"
                      rules={{ required: false }}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <WxSelect
                          label="Post Code List"
                          options={postCodeList}
                          placeholder="Select postcode"
                          valuesKey="name"
                          textKey="name"
                          isRequired
                          value={value}
                          onChange={onChange}
                          isDisabled={!postCodeList?.length}
                          color={error ? "danger" : "secondary"}
                          errorMessage={error && "District/City is required!"}
                        />
                      )}
                    />
                  </div>
                  <div className="col-lg-6 col-md-12 col-sm-6">
                    <Controller
                      control={control}
                      name="recipient_area"
                      rules={{ required: false }}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <WxSelect
                          label="Customer Area"
                          options={areaList}
                          placeholder="Select area"
                          valuesKey="name"
                          textKey="name"
                          isRequired
                          value={value}
                          onChange={onChange}
                          isDisabled={!areaList?.length}
                          color={error ? "danger" : "secondary"}
                          errorMessage={error && "District/City is required!"}
                        />
                      )}
                    />
                  </div>

                  <div className="col-lg-6 col-md-12 col-sm-6">
                    <DateInput
                      // date={watch("requested_delivery_time")}
                      date={watch("requested_delivery_time")}
                      setDate={(val) =>
                        setValue("requested_delivery_time", val)
                      }
                      label="Requested Delivery time"
                      registerProperty={{
                        ...register("requested_delivery_time"),
                      }}
                      endIcon={<WxIcon variants="round" icon="calendartoday" />}
                      errorMessage={errors?.requested_delivery_time?.message}
                      color={
                        errors?.requested_delivery_time ? "danger" : "secondary"
                      }
                      minDate={new Date()}
                    />
                  </div>

                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <TextInput
                      label="Order Note"
                      registerProperty={{
                        ...register("comment"),
                      }}
                      placeholder="note..."
                      color={errors?.comment ? "danger" : "secondary"}
                      errorMessage={errors?.comment?.message}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-12 col-sm-12">
              <div className="card">
                <div className="mb-3">
                  <p className="my-0">{watch("recipient_address")}</p>
                  {watch("recipient_city") && (
                    <p className="my-0">
                      <span className="text_semibold">City: </span>
                      {watch("recipient_city")}
                    </p>
                  )}
                  {watch("recipient_thana") && (
                    <p className="my-0">
                      <span className="text_semibold">Thana: </span>
                      {watch("recipient_thana")}
                    </p>
                  )}
                  {watch("recipient_zip") && (
                    <p className="my-0">
                      <span className="text_semibold">Zip/Post Code: </span>
                      {watch("recipient_zip")}
                    </p>
                  )}
                  {watch("recipient_area") && (
                    <p className="my-0">
                      <span className="text_semibold">Area: </span>
                      {watch("recipient_area")}
                    </p>
                  )}
                  {watch("package") && (
                    <p className="my-0">
                      <span className="text_semibold">Package: </span>
                      {JSON.parse(watch("package"))?.package_name}
                    </p>
                  )}
                  {watch("product_price") && (
                    <p className="my-0">
                      <span className="text_semibold">Package Price: </span>
                      {watch("product_price")}
                    </p>
                  )}
                  {watch("requested_delivery_time") && (
                    <p className="my-0">
                      <span className="text_semibold">Delivery Time: </span>
                      {generateDateFormat(
                        watch("requested_delivery_time"),
                        "%MM% %date%, %yyyy%"
                      )}
                    </p>
                  )}
                  {watch("comment") && (
                    <p className="my-0">
                      <span className="text_semibold">Comment: </span>
                      {watch("comment")}
                    </p>
                  )}
                </div>
                <Button disabled={isSaving} type="submit" variant="fill">
                  save
                </Button>
              </div>
            </div>
          </div>
        </form>
      </WxFormContainer>
    </WxMainLg>
  );
};

export default ECourierOrderPlace;
