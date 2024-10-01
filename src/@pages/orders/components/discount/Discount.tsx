import WxSelect from "@components/Select/WxSelect";
import WxButton from "@components/WxButton";
import WxIcon from "@components/WxIcon/WxIcon";
import WxInput from "@components/WxInput";
import WxModal from "@components/WxModal";
import WxModalBody from "@components/WxModal/WxModalBody";
import WxModalFooter from "@components/WxModal/WxModalFooter";
import WxModalHeader from "@components/WxModal/WxModalHeader";
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
        closeIconAction={handleDiscountClose}
        className="border-0"
      />
      <WxModalBody>
        <div className="row">
          <div className="col-md-6">
            <WxSelect
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
            <WxInput
              label="Discount Value"
              type="number"
              min={0}
              value={discount.amount}
              endIcon={
                discount.type === "Percentage" ? (
                  <WxIcon variants="round" icon="percent" />
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
          <WxButton
            variant="outline"
            color="secondary"
            onClick={handleDiscountClose}
          >
            Cancel
          </WxButton>
          <WxButton variant="fill" onClick={handleDiscountConfirm}>
            Done
          </WxButton>
        </div>
      </WxModalFooter>
    </WxModal>
  );
};

export default Discount;
