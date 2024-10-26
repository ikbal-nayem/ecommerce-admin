import {Button} from "@components/Button";
import Drawer from "@components/Drawer";
import DrawerBody from "@components/Drawer/DrawerBody";
import DrawerFooter from "@components/Drawer/DrawerFooter";
import DrawerHeader from "@components/Drawer/DrawerHeader";
import TextInput from "@components/TextInput";
import Switch from "@components/Switch";
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
      <Drawer show={isOpen} handleClose={handleFormClose}>
        <div className="delivery_create_sec">
          <DrawerHeader
            title={`${editDrawer ? "Edit" : "Configure"} Delivery Zone`}
            onClickClose={handleFormClose}
          />
          <form onSubmit={handleSubmit(makeCourierConfigure)} noValidate>
            <DrawerBody>
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
                    <Switch
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
                    <Switch
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
            </DrawerBody>
            <DrawerFooter>
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
            </DrawerFooter>
          </form>
        </div>
      </Drawer>
    </>
  );
};
export default ConfigureDrawer;
