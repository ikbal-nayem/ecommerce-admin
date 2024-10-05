import WxSelect from "@components/Select/WxSelect";
import {Button} from "@components/Button";
import WxLabel from "@components/WxLabel";
import WxModal from "@components/WxModal";
import WxModalBody from "@components/WxModal/WxModalBody";
import WxModalFooter from "@components/WxModal/WxModalFooter";
import WxModalHeader from "@components/WxModal/WxModalHeader";
import { IDeliveryZoneItem } from "@interfaces/Settings.interface";
import { useEffect, useState } from "react";

const ShippingModal = ({
  isShippingOpen,
  handleShippingClose,
  onShipping,
  zoneList,
  selectedZone,
}) => {
  const [localSelectZone, setLocalSelectZone] =
    useState<IDeliveryZoneItem>(selectedZone);

  useEffect(() => {
    isShippingOpen && setLocalSelectZone(selectedZone);
  }, [isShippingOpen, selectedZone]);

  const handleShippingConfirm = () => {
    onShipping(localSelectZone);
    handleShippingClose();
  };

  return (
    <WxModal show={isShippingOpen} size="md" handleClose={handleShippingClose}>
      <WxModalHeader
        title="Add Shipping"
        closeIconAction={handleShippingClose}
        className="border-0"
      />
      <WxModalBody>
        <div className="row">
          <div className="col-md-6">
            <WxSelect
              label="Delivery Zone"
              options={zoneList}
              textKey="name"
              valuesKey="object"
              value={JSON.stringify(localSelectZone)}
              onChange={(e) =>
                setLocalSelectZone(JSON.parse(e.currentTarget.value))
              }
            />
          </div>
          <div className="col-md-6">
            <WxLabel>Amount</WxLabel>
            {localSelectZone?.deliveryChargeAmount || 0} BDT
          </div>
        </div>
      </WxModalBody>
      <WxModalFooter className="bg-white">
        <div className="d-flex justify-content-between">
          <Button
            variant="outline"
            color="secondary"
            onClick={handleShippingClose}
          >
            Cancel
          </Button>
          <Button variant="fill" onClick={handleShippingConfirm}>
            Done
          </Button>
        </div>
      </WxModalFooter>
    </WxModal>
  );
};

export default ShippingModal;
