import {Button} from "@components/Button";
import TextInput from "@components/TextInput";
import WxModal from "@components/Modal";
import WxModalBody from "@components/Modal/ModalBody";
import WxModalFooter from "@components/Modal/ModalFooter";
import WxModalHeader from "@components/Modal/ModalHeader";
import React from "react";
interface CustomerModalProps {
  register: any;
  show: boolean;
  isSubmitting: boolean;
  onHide: Function;
  onSubmit: Function;
  handleSubmit: Function;
  handleCloseForm: Function;
}
export const CustomerEditModal = ({
  show,
  isSubmitting,
  onHide,
  register,
  handleSubmit,
  handleCloseForm,
  onSubmit,
}: CustomerModalProps) => {
  return (
    <WxModal show={show} handleClose={handleCloseForm}>
      <WxModalHeader
        onClickClose={() => onHide(false)}
        title="Customer Update"
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <WxModalBody>
          <div className="row d-flex justify-content-between">
            <div className="col-12">
              <TextInput
                label="First Name"
                isDisabled
                registerProperty={{
                  ...register("firstName", { required: true }),
                }}
              />
            </div>
            <div className="col-12">
              <TextInput
                label="Last Name"
                isDisabled
                registerProperty={{
                  ...register("lastName", { required: true }),
                }}
              />
            </div>
          </div>
          <TextInput
            label="Email"
            registerProperty={{
              ...register("email"),
            }}
          />
          <TextInput
            label="Phone Number"
            registerProperty={{
              ...register("phoneNumber"),
            }}
            style={{ color: "black" }}
          />
        </WxModalBody>
        <WxModalFooter>
          <Button variant="fill" type="submit" disabled={isSubmitting}>
            Save
          </Button>
        </WxModalFooter>
      </form>
    </WxModal>
  );
};

// export default CustomerEditModal;
