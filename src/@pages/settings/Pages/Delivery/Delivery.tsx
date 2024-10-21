import { ConfirmationModal } from "@components/ConfirmationModal/ConfirmationModal";
import WxMainLg from "@components/MainContentLayout/MainLg";
import WxNotFound from "@components/NotFound/NotFound";
import {Button} from "@components/Button";
import { FormHeader } from "@components/FormLayout";
import {
  IConfigureDeliverService,
  IDeliveryZoneItem,
} from "@interfaces/Settings.interface";
import DeliveryZoneListTable from "@pages/settings/Components/DeliveryZoneListTable/DeliveryZoneListTable";
import { SETTINGS } from "routes/path-name.route";
import { CourierService } from "services/api/settings/Courier.service";
import { DeliverySettingService } from "services/api/settings/Delivery.service";
import { LocalStorageService } from "services/utils/local-storage.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Couriers from "./CouriersList";
import "./Delivery.scss";
import ConfigureDrawer from "./form/ConfigureDrawer";
import CreateDelivery from "./form/Create";

interface IMakeCourierConfigure {
  id: string;
  title: string;
  isActive: boolean;
  metaType: string;
  courierProvider: string;
  isDefault: boolean;
  banner: string;
  isAvailable: boolean;
  apiKey: string;
  apiSecret: string;
  userId: string;
  isCourier: boolean;
  token?: string;
}

const Delivery = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deliveryList, setDeliveryList] = useState<IDeliveryZoneItem[]>([]);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [openECourierDrawer, setOpenECourierDrawer] = useState<boolean>(false);
  const [editedData, setEditedData] = useState<IDeliveryZoneItem | null>();
  const deleteItem = useRef<IDeliveryZoneItem & IMakeCourierConfigure>(null);
  const [configuredCourierData, setConfiguredCourierData] = useState<any[]>([]);
  const [configuredCourierList, setConfiguredCourierList] = useState<any[]>([]);
  const [supportedCourierList, setSupportedCourierList] = useState<any[]>([]);
  const [editDrawer, setEditDrawer] = useState<boolean>(false);
  const [confirmationModal, setConfirmationModal] = useState<boolean>(false);

  const [isSaving, setIsSaving] = useState(false);

  const configureFrom = useForm<IConfigureDeliverService>();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    control,
    formState: { errors },
  } = configureFrom;

  useEffect(() => {
    // getDeliveryList();
    // getConfiguredList();
    // getSupportedList();

    // const getDeliveryList =

    Promise.allSettled([
      getDeliveryList(),
      getConfiguredList(),
      getSupportedList(),
    ]);
  }, []);

  const getFromDataDrawer = (courierProvider: string) => {
    CourierService.getConfiguredData(courierProvider)
      .then((res) => {
        res.body.isCourier = true;
        setValue("id", res.body.id);
        setConfiguredCourierData(res.body);
        reset(res.body);
      })
      .catch((err) => ToastService.error(err.message))
      .finally(() => setOpenECourierDrawer(true));
  };

  const getDeliveryList = () => {
    setIsLoading(true);
    DeliverySettingService.getList({
      meta: {
        offset: 0,
        limit: 20,
        sort: [
          {
            order: "decs",
            field: "name",
          },
        ],
      },
      body: {},
    })
      .then((res) => {
        setDeliveryList(res.body);
      })
      .finally(() => setIsLoading(false));
  };

  const handleConfirmClose = () => {
    deleteItem.current = null;
    setConfirmationModal(false);
  };

  const onEditItem = (data: IDeliveryZoneItem) => {
    setEditedData(data);
    setOpenForm(true);
  };

  const onDelete = (data: IDeliveryZoneItem & IMakeCourierConfigure) => {
    deleteItem.current = data;
    setConfirmationModal(true);
  };

  const onStatusChange = (data: IDeliveryZoneItem, isChecked: boolean) => {
    setIsLoading(true);
    const reqData = { id: data?.id, isActive: isChecked };
    DeliverySettingService.changeStatus(reqData)
      .then((res) => {
        ToastService.success("Delivery status changed!");
        const index = deliveryList.findIndex((item) => item?.id === data?.id);
        deliveryList[index] = data;
        setDeliveryList([...deliveryList]);
      })
      .catch((err) => ToastService.error(err.message))
      .finally(() => setIsLoading(false));
  };

  const onAdvanceStatusChange = (
    data: IDeliveryZoneItem,
    isChecked: boolean
  ) => {
    setIsLoading(true);
    data.isActive = isChecked;
    DeliverySettingService.update(data)
      .then((res) => {
        ToastService.success("Delivery status changed!");
        const index = deliveryList.findIndex((item) => item?.id === data?.id);
        deliveryList[index] = data;
        setDeliveryList([...deliveryList]);
      })
      .catch((err) => ToastService.error(err.message))
      .finally(() => setIsLoading(false));
  };

  const onConfirmDelete = () => {
    if (!deleteItem.current) return;
    setIsLoading(true);
    DeliverySettingService.deleteAll({ ids: [deleteItem.current.id] })
      .then((res) => {
        ToastService.success("Delivery zone deleted successfully");
        getDeliveryList();
        handleConfirmClose();
      })
      .catch((err) => ToastService.error(err.message))
      .finally(() => setIsLoading(false));
  };

  const handleFormClose = (reload: boolean = false) => {
    setEditedData(null);
    setOpenForm(false);
    reload && getDeliveryList();
  };

  const ECourierDrawerClose = (reload: boolean = false) => {
    setOpenECourierDrawer(false);
    reload && getDeliveryList();
  };

  const getConfiguredList = () => {
    CourierService.getConfigured()
      .then((res) => setConfiguredCourierList(res.body))
      .catch((err) => ToastService.error(err.message));
  };

  const getSupportedList = () => {
    CourierService.getSupported()
      .then((res) => {
        setSupportedCourierList(res.body);
      })
      .catch((err) => ToastService.error(err.message));
  };

  const makeCourierConfigure = (data: IMakeCourierConfigure) => {
    setIsSaving(true);
    const { apiKey, apiSecret, courierProvider, userId, isActive, token } =
      data;

    let modifiedOBJ: any = {
      courierProvider: courierProvider,
      isWebxSubMerchant: true,
      isSandbox: false,
      isActive: isActive,
      id: getValues("id"),
    };

    // modifying data according to courier type
    if (courierProvider === "COURIER_TYPE_ECOURIER") {
      modifiedOBJ = {
        ...modifiedOBJ,
        apiKey: apiKey,
        apiSecret: apiSecret,
        userId: userId,
      };
    } else if (courierProvider === "COURIER_TYPE_REDX") {
      modifiedOBJ = {
        ...modifiedOBJ,
        token: token,
      };
    }

    let courierApi;

    // checking is courier drawer is for update or create
    if (editDrawer) {
      courierApi = CourierService.update(modifiedOBJ);
    } else {
      courierApi = CourierService.makeConfigure(modifiedOBJ);
    }

    // calling the api after choosing the service and
    courierApi
      .then(() => {
        getConfiguredList();
        getSupportedList();
        ECourierDrawerClose();
      })
      .catch((err) => ToastService.error(err.message))
      .finally(() => setIsSaving(false));
  };

  const handleDeleteCourierService = () => {
    if (!deleteItem.current.isCourier) return;
    setIsSaving(true);
    CourierService.delete(deleteItem.current.courierProvider)
      .then((res) => {
        getConfiguredList();
        getSupportedList();
        handleConfirmClose();
        ECourierDrawerClose();
        setEditDrawer(false);
        ToastService.success(res.message);
        reset({});
      })
      .catch((err) => ToastService.error(err.message))
      .finally(() => setIsSaving(false));
  };

  return (
    <div>
      <WxMainLg className="delivery_zone_sec">
        <FormHeader
          title="Delivery"
          backNavigationLink={SETTINGS}
          rightContent={
            <Button variant="fill" onClick={() => setOpenForm(true)}>
              Add Delivery Zone
            </Button>
          }
        />

        {isLoading ? <Preloader absolutePosition /> : null}
        {!isLoading && deliveryList.length === 0 ? (
          <WxNotFound
            title="No delivery zone found!"
            btn_text="Create Delivery Zone"
          />
        ) : null}
        {deliveryList?.length ? (
          <div className="card">
            <DeliveryZoneListTable
              onDelete={onDelete}
              onEditItem={onEditItem}
              deliveryList={deliveryList}
              onChangeStatus={onStatusChange}
              onAdvanceStatusChange={onAdvanceStatusChange}
              isLoading={isLoading}
            />
          </div>
        ) : null}

        <Couriers
          configuredCourierList={configuredCourierList}
          supportedCourierList={supportedCourierList}
          setOpenECourierDrawer={setOpenECourierDrawer}
          getFromDataDrawer={getFromDataDrawer}
          configureFrom={configureFrom}
          setEditDrawer={setEditDrawer}
        />
      </WxMainLg>
      {openECourierDrawer && (
        <ConfigureDrawer
          isOpen={openECourierDrawer}
          isSaving={isSaving}
          setIsSaving={setIsSaving}
          handleFormClose={ECourierDrawerClose}
          configureFrom={configureFrom}
          makeCourierConfigure={makeCourierConfigure}
          editDrawer={editDrawer}
          setEditDrawer={setEditDrawer}
          onDelete={onDelete}
          configuredCourierData={configuredCourierData}
        />
      )}

      <ConfirmationModal
        onConfirm={() =>
          deleteItem.current.isCourier
            ? handleDeleteCourierService()
            : onConfirmDelete()
        }
        isOpen={confirmationModal}
        onClose={handleConfirmClose}
        isSubmitting={isLoading}
        title="Delete Confirmation!"
        body={
          <p>
            Do you want to delete{" "}
            <b>{deleteItem.current?.name || deleteItem.current?.title}</b>? This
            action will delete permanently.
          </p>
        }
      />
      <CreateDelivery
        isOpen={openForm}
        handleFormClose={handleFormClose}
        editedData={editedData}
        onDelete={onDelete}
      />
    </div>
  );
};

export default Delivery;
