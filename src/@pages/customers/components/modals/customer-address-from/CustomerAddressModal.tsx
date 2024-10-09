import React from "react";
import {Button} from "@components/Button";
import TextInput from "@components/TextInput";
import WxModal from "@components/Modal";
import WxModalBody from "@components/Modal/ModalBody";
import WxModalFooter from "@components/Modal/ModalFooter";
import WxModalHeader from "@components/Modal/ModalHeader";

interface CustomerPropsModalProps {
  register: any;
  show: boolean;
  onHide: Function;
  onSubmit: Function;
  handleSubmit: Function;
  errors?: any;
}

export const CustomerAddressModal = ({
  show,
  onHide,
  register,
  handleSubmit,
  onSubmit,
  errors,
}: CustomerPropsModalProps) => {
  return (
    <WxModal show={show}>
      <WxModalHeader
        title="Customer Address Update"
        onClickClose={() => onHide(false)}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <WxModalBody>
          <div className="row">
            <div className="col-md-12">
              <TextInput
                registerProperty={{
                  ...register("address.title", { required: false }),
                }}
                label="Title"
                className="mb-0"
              />
            </div>
            <div className="col-md-12">
              <TextInput
                registerProperty={{
                  ...register("address.addressLine1", {
                    required: true,
                  }),
                }}
                label="Address Line 1"
                className="mb-0"
                color={errors?.address?.addressLine1 ? "danger" : "secondary"}
                errorMessage={
                  errors?.address?.addressLine1 && "Address Line 1 is required!"
                }
              />
            </div>
            <div className="col-md-12">
              <TextInput
                registerProperty={{
                  ...register("address.addressLine2", {
                    required: false,
                  }),
                }}
                label="Address Line 2"
                className="mb-0"
              />
            </div>
            <div className="col-md-6">
              <TextInput
                registerProperty={{
                  ...register("address.cityName", { required: true }),
                }}
                label="District/City"
                className="mb-0"
                color={errors?.address?.cityName ? "danger" : "secondary"}
                errorMessage={
                  errors?.address?.cityName &&
                  "Address District/City is required!"
                }
              />
            </div>
            <div className="col-md-6">
              <TextInput
                registerProperty={{
                  ...register("address.state", { required: true }),
                }}
                label="Division/State"
                className="mb-0"
                color={errors?.address?.state ? "danger" : "secondary"}
                errorMessage={
                  errors?.address?.state &&
                  "Address Division/State is required!"
                }
              />
            </div>
            <div className="col-md-6">
              <TextInput
                registerProperty={{
                  ...register("address.postCode", { required: true }),
                }}
                label="Post code"
                className="mb-0"
              />
            </div>
            <div className="col-md-6">
              <TextInput
                registerProperty={{
                  ...register("address.country", { required: false }),
                }}
                label="Country"
                className="mb-0"
              />
            </div>
            <div className="col-md-6">
              <TextInput
                registerProperty={{
                  ...register("address.phone", {
                    required: false,
                  }),
                }}
                label="Phone Number"
                className="mb-0"
              />
            </div>
            <div className="col-md-6">
              <TextInput
                registerProperty={{
                  ...register("address.email", {
                    required: false,
                  }),
                }}
                label="Email Address"
                className="mb-0"
                type="email"
              />
            </div>
          </div>
        </WxModalBody>
        <WxModalFooter>
          <Button type="submit" variant="fill">
            Save
          </Button>
        </WxModalFooter>
      </form>
    </WxModal>
  );
};
