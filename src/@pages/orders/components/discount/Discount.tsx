import Select from "@components/Select/Select";
import {Button} from "@components/Button";
import Icon from "@components/Icon";
import TextInput from "@components/TextInput";
import WxModal from "@components/Modal";
import WxModalBody from "@components/Modal/ModalBody";
import WxModalFooter from "@components/Modal/ModalFooter";
import WxModalHeader from "@components/Modal/ModalHeader";
import React, { useState } from "react";

const dicountTypes = [
  { id: 1, type: "Percentage" },
  { id: 2, type: "Amount" },
];

const Discount = ({
  isDiscountOpen,
  subTotal,
  handleDiscountClose,
  onDiscount,
}) => {
  const [discount, setDiscount] = useState({
    amount: 0,
    type: dicountTypes[0]?.type,
  });

  const handleDiscountConfirm = () => {
    let discountValue = 0;
    if (discount.type === "Percentage")
      discountValue = subTotal * (discount.amount / 100);
    else if (discount.type === "Amount") discountValue = discount.amount;
    onDiscount(discountValue);
    handleDiscountClose();
  };

  return (
    <WxModal show={isDiscountOpen} size="md" handleClose={handleDiscountClose}>
      <WxModalHeader
        title="Add Discount"
        onClickClose={handleDiscountClose}
        className="border-0"
      />
      <WxModalBody>
        <div className="row">
          <div className="col-md-6">
            <Select
              label="Discount Type"
              options={dicountTypes}
              textKey="type"
              valuesKey="type"
              value={discount.type}
              onChange={(e) =>
                setDiscount({ ...discount, type: e.currentTarget.value })
              }
            />
          </div>
          <div className="col-md-6">
            <TextInput
              label="Discount Value"
              type="number"
              min={0}
              value={discount.amount}
              endIcon={
                discount.type === "Percentage" ? (
                  <Icon variants="round" icon="percent" />
                ) : (
                  "BDT"
                )
              }
              isAutoFocus
              onFocus={(e) => e.target.select()}
              onChange={(e) =>
                setDiscount({ ...discount, amount: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && handleDiscountConfirm()}
            />
          </div>
        </div>
      </WxModalBody>
      <WxModalFooter className="bg-white">
        <div className="d-flex justify-content-between">
          <Button
            variant="outline"
            color="secondary"
            onClick={handleDiscountClose}
          >
            Cancel
          </Button>
          <Button variant="fill" onClick={handleDiscountConfirm}>
            Done
          </Button>
        </div>
      </WxModalFooter>
    </WxModal>
  );
};

export default Discount;
