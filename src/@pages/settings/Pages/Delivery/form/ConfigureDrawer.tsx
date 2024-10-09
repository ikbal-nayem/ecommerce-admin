import {Button} from "@components/Button";
import WxDrawer from "@components/Drawer";
import WxDrawerBody from "@components/Drawer/DrawerBody";
import WxDrawerFooter from "@components/Drawer/DrawerFooter";
import WxDrawerHeader from "@components/WxDrawer/WxDrawerHeader";
import TextInput from "@components/TextInput";
import WxSwitch from "@components/WxSwitch";
import { useState } from "react";
import "./ConfigureDrawer.scss";

interface IConfigureDrawer {
  isOpen: boolean;
  handleFormClose: any;
  isSaving: boolean;
  setIsSaving: Function;
  configureFrom: any;
  makeCourierConfigure: Function;
  editDrawer: boolean;
  setEditDrawer: Function;
  onDelete;
  configuredCourierData;
}

const ConfigureDrawer = ({
  isOpen,
  handleFormClose,
  configureFrom,
  makeCourierConfigure,
  editDrawer,
  isSaving,
  setIsSaving,
  setEditDrawer,
  configuredCourierData,
  onDelete,
}: IConfigureDrawer) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = configureFrom;

  const [confirmationModal, setConfirmationModal] = useState<boolean>(false);

  return (
    <>
      <WxDrawer show={isOpen} handleClose={handleFormClose}>
        <div className="delivery_create_sec">
          <WxDrawerHeader
            title={`${editDrawer ? "Edit" : "Configure"} Delivery Zone`}
            onClickClose={handleFormClose}
          />
          <form onSubmit={handleSubmit(makeCourierConfigure)} noValidate>
            <WxDrawerBody>
              {getValues("courierProvider") === "COURIER_TYPE_ECOURIER" && (
                <div className="row">
                  <div className="col-md-12 col-sm-12">
                    <TextInput
                      label="API Key"
                      isRequired
                      placeholder="Type api key"
                      registerProperty={{
                        ...register("apiKey", {
                          required: true,
                        }),
                      }}
                      color={errors?.apiKey ? "danger" : "secondary"}
                      errorMessage={
                        errors?.apiKey ? "This field is required!" : ""
                      }
                    />
                  </div>
                  <div className="col-md-12 col-sm-12">
                    <TextInput
                      isRequired
                      label="API Secret"
                      placeholder="Type api secret"
                      registerProperty={{
                        ...register("apiSecret", { required: true }),
                      }}
                      color={errors?.apiSecret ? "danger" : "secondary"}
                      errorMessage={
                        errors?.apiSecret ? "This field is required!" : ""
                      }
                    />
                  </div>
                  <div className="col-md-12 col-sm-12">
                    <TextInput
                      label="User Id"
                      isRequired
                      placeholder="Type user id"
                      registerProperty={{
                        ...register("userId", {
                          required: true,
                        }),
                      }}
                      color={errors?.userId ? "danger" : "secondary"}
                      errorMessage={
                        errors?.userId ? "This field is required!" : ""
                      }
                    />
                  </div>
                  <div className="mt-4" style={{ maxWidth: "90%" }}>
                    <WxSwitch
                      label="Activity of service"
                      checkedTitle="Active"
                      unCheckedTitle="Inactive"
                      registerProperty={{
                        ...register("isActive"),
                      }}
                      defaultChecked={!editDrawer}
                    />
                  </div>
                </div>
              )}
              {getValues("courierProvider") === "COURIER_TYPE_REDX" && (
                <div className="row">
                  <div className="col-md-12 col-sm-12">
                    <TextInput
                      label="Token"
                      isRequired
                      placeholder="Enter Token"
                      registerProperty={{
                        ...register("token", {
                          required: true,
                        }),
                      }}
                      color={errors?.token ? "danger" : "secondary"}
                      errorMessage={
                        errors?.token ? "This field is required!" : ""
                      }
                    />
                  </div>
                  <div className="mt-4" style={{ maxWidth: "90%" }}>
                    <WxSwitch
                      label="Activity of service"
                      checkedTitle="Active"
                      unCheckedTitle="Inactive"
                      registerProperty={{
                        ...register("isActive"),
                      }}
                      defaultChecked={!editDrawer}
                    />
                  </div>
                </div>
              )}
            </WxDrawerBody>
            <WxDrawerFooter>
              <div className="delivery_create_sec__footer">
                {editDrawer ? (
                  <Button
                    color="danger"
                    variant="fill"
                    onClick={() => {
                      onDelete(configuredCourierData);
                    }}
                    disabled={isSaving}
                  >
                    Delete
                  </Button>
                ) : null}
                <div className="ms-auto d-flex">
                  <Button
                    color="secondary"
                    type="button"
                    variant="outline"
                    className="me-2"
                    onClick={handleFormClose}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button variant="fill" type="submit" disabled={isSaving}>
                    {editDrawer ? "Update" : "Save"}
                  </Button>
                </div>
              </div>
            </WxDrawerFooter>
          </form>
        </div>
      </WxDrawer>
    </>
  );
};
export default ConfigureDrawer;
