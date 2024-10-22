import WxMainLg from "@components/MainContentLayout/MainLg";
import Select from "@components/Select/Select";
import {Button} from "@components/Button";
import { WxFormContainer, FormHeader } from "@components/FormLayout";
import TextInput from "@components/TextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { ORDER_DETAILS } from "routes/path-name.route";
import { RedXService } from "services/api/courier/RedX.sevice";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { orderDetailsByID } from "store/reducers/ordersReducer";
import { dispatch } from "store/store";
import { RedXOrderPlaceSchema } from "./RedXOrderPlaceSchema";

interface IRedXField {
  id: string;
  storeId: string;
  orderId: string;
  trackingId: string;
  customerName: string;
  customerPhone: string;
  deliveryArea: string;
  deliveryAreaId: number;
  address: string;
  merchantInvoiceId: string;
  cashCollectionAmount: string;
  parcelWeight: number;
  instruction: string;
  value: number;
  area: any;
  parcelDetail: [
    {
      name: string;
      category: string;
      value: string;
    }
  ];
}

const RedXOrderPlace = () => {
  const [deliveryAreaList, setDeliveryAreaList] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const orders = useSelector((state: any) => state.orders);

  const { orderDetails } = orders;
  const { order_id } = useParams();

  const {
    register,
    handleSubmit,
    watch,
    control,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IRedXField>({
    resolver: yupResolver(RedXOrderPlaceSchema),
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!Object.keys(orderDetails).length) {
      dispatch(orderDetailsByID(order_id));
    }

    const parcelDetail = orderDetails?.orderLineList?.map((order: any) => {
      return {
        name: order?.title,
        category: "",
        value: order?.subTotal,
      };
    });

    reset({
      customerName: orderDetails?.customerName,
      customerPhone: orderDetails?.customerPhone,
      address: orderDetails?.shippingAddress?.addressLine1,
      parcelDetail: parcelDetail,
    });
  }, [orderDetails]);

  useEffect(() => {
    getAreaList();
  }, []);

  const getAreaList = () => {
    setIsLoading(true);
    RedXService.getRedXAreaList()
      .then((res) => setDeliveryAreaList(res.body.areas))
      .catch((err) => ToastService.error(err))
      .finally(() => setIsLoading(false));
  };

  const handleDeliveryAreaValue = (area) => {
    const selectedArea = area ? JSON.parse(area) : null;
    if (selectedArea) {
      setValue("deliveryArea", selectedArea.name);
      setValue("deliveryAreaId", +selectedArea.id);
    }
  };

  const orderPlaceFormSubmit = (data: IRedXField) => {
    setIsSaving(true);

    data.orderId = order_id;
    delete data.area;
    RedXService.redXPlaceOrder(data)
      .then((res) => {
        navigate(ORDER_DETAILS({ order_id: order_id }));
      })
      .catch((err) => ToastService.error(err))
      .finally(() => setIsSaving(false));
  };

  return (
    <WxMainLg>
      <WxFormContainer>
        <form onSubmit={handleSubmit(orderPlaceFormSubmit)}>
          <FormHeader
            title="Redx Info"
            backNavigationLink={ORDER_DETAILS({ order_id: order_id })}
          />
          {(isLoading || isSaving) && <Preloader />}
          <div className="row">
            <div className="col-lg-8 col-md-12 col-sm-12">
              <div className="card p-4 mb-3">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    <TextInput
                      label="Customer Name"
                      registerProperty={{
                        ...register("customerName"),
                      }}
                      placeholder="write here"
                      isRequired
                      color={errors?.customerName ? "danger" : "secondary"}
                      errorMessage={errors?.customerName?.message}
                    />
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    <TextInput
                      label="Customer Phone"
                      registerProperty={{
                        ...register("customerPhone"),
                      }}
                      placeholder="write here"
                      isRequired
                      color={errors?.customerPhone ? "danger" : "secondary"}
                      errorMessage={errors?.customerPhone?.message}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    <Select
                      label="Delivery Area"
                      options={deliveryAreaList}
                      placeholder="Select Area"
                      valuesKey="object"
                      textKey="name"
                      isRequired
                      isDisabled={!deliveryAreaList?.length}
                      registerProperty={{
                        ...register("area", {
                          required: true,
                          onChange: (e) =>
                            handleDeliveryAreaValue(e.target.value),
                        }),
                      }}
                      // value={value}
                      // onChange={onChange}
                      // color={error ? "danger" : "secondary"}
                      // errorMessage={error && "District/City is required!"}
                    />
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    <TextInput
                      label="Cash collection amount"
                      registerProperty={{
                        ...register("cashCollectionAmount"),
                      }}
                      placeholder="write here"
                      isRequired
                      color={
                        errors?.cashCollectionAmount ? "danger" : "secondary"
                      }
                      errorMessage={errors?.cashCollectionAmount?.message}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <TextInput
                      label="Customer Address"
                      registerProperty={{
                        ...register("address"),
                      }}
                      placeholder="write here"
                      isRequired
                      color={errors?.address ? "danger" : "secondary"}
                      errorMessage={errors?.address?.message}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    <TextInput
                      label="Parcel Weight"
                      placeholder="write here"
                      isRequired
                      type="number"
                      registerProperty={{
                        ...register("parcelWeight"),
                      }}
                      color={errors?.parcelWeight ? "danger" : "secondary"}
                      errorMessage={errors?.parcelWeight?.message}
                    />
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    <TextInput
                      label="Value"
                      placeholder="write here"
                      isRequired
                      type="number"
                      registerProperty={{
                        ...register("value"),
                      }}
                      color={errors?.value ? "danger" : "secondary"}
                      errorMessage={errors?.value?.message}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <TextInput
                      label="Comment / Instruction"
                      registerProperty={{
                        ...register("instruction"),
                      }}
                      placeholder="write here"
                      color={errors?.instruction ? "danger" : "secondary"}
                      errorMessage={errors?.instruction?.message}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-12 col-sm-12">
              <div className="card">
                <div className="mb-3">
                  {watch("customerName") && (
                    <p className="my-0">
                      <span className="text_semibold">Name: </span>
                      {watch("customerName")}
                    </p>
                  )}
                  {watch("customerPhone") && (
                    <p className="my-0">
                      <span className="text_semibold">Phone: </span>
                      {watch("customerPhone")}
                    </p>
                  )}
                  {watch("deliveryArea") && (
                    <p className="my-0">
                      <span className="text_semibold">Delivery Area: </span>
                      {watch("deliveryArea")}
                    </p>
                  )}
                  {watch("address") && (
                    <p className="my-0">
                      <span className="text_semibold">Address: </span>
                      {watch("address")}
                    </p>
                  )}
                  {watch("cashCollectionAmount") && (
                    <p className="my-0">
                      <span className="text_semibold">Amount: </span>
                      {watch("cashCollectionAmount")}
                    </p>
                  )}
                  {watch("parcelWeight") && (
                    <p className="my-0">
                      <span className="text_semibold">Weight: </span>
                      {watch("parcelWeight")}
                    </p>
                  )}
                  {watch("value") && (
                    <p className="my-0">
                      <span className="text_semibold">Value: </span>
                      {watch("value")}
                    </p>
                  )}
                  {watch("instruction") && (
                    <p className="my-0">
                      <span className="text_semibold">Instruction: </span>
                      {watch("instruction")}
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

export default RedXOrderPlace;
