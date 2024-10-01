import WxButton from "@components/WxButton";
import WxInput from "@components/WxInput";
import WxModal from "@components/WxModal";
import WxModalBody from "@components/WxModal/WxModalBody";
import WxModalFooter from "@components/WxModal/WxModalFooter";
import WxModalHeader from "@components/WxModal/WxModalHeader";
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
        closeIconAction={() => onHide(false)}
        title="Customer Update"
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <WxModalBody>
          <div className="row d-flex justify-content-between">
            <div className="col-12">
              <WxInput
                label="First Name"
                isDisabled
                registerProperty={{
                  ...register("firstName", { required: true }),
                }}
              />
            </div>
            <div className="col-12">
              <WxInput
                label="Last Name"
                isDisabled
                registerProperty={{
                  ...register("lastName", { required: true }),
                }}
              />
            </div>
          </div>
          <WxInput
            label="Email"
            registerProperty={{
              ...register("email"),
            }}
          />
          <WxInput
            label="Phone Number"
            registerProperty={{
              ...register("phoneNumber"),
            }}
            style={{ color: "black" }}
          />
        </WxModalBody>
        <WxModalFooter>
          <WxButton variant="fill" type="submit" disabled={isSubmitting}>
            Save
          </WxButton>
        </WxModalFooter>
      </form>
    </WxModal>
  );
};

// export default CustomerEditModal;
