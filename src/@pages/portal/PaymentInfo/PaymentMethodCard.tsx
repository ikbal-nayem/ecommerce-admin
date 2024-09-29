import WxDropdown from "@components/WxDropdown/WxDropdown";
import WxIcon from "@components/WxIcon/WxIcon";
import { MASTER_META_KEY } from "config/constants";
import { IPortalPaymentMedia } from "@interfaces/portal.interface";
import { useState } from "react";

type IPaymentMethodCardProps = {
  info: IPortalPaymentMedia;
  onUpdate: (item: IPortalPaymentMedia) => void;
  onDelete: (item: IPortalPaymentMedia) => void;
};

const PaymentMethodCard = ({
  info,
  onUpdate,
  onDelete,
}: IPaymentMethodCardProps) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);

  return (
    <div className="wx__card payment_info_card">
      <div className="wx__d-flex wx__justify-content-between">
        {info?.paymentMedia?.type ===
        MASTER_META_KEY.PAYMENT_MEDIA_TYPE_BANK ? (
          <WxIcon
            icon="account_balance"
            color="primary"
            className="icon icon__bank"
          />
        ) : (
          <WxIcon
            icon="account_balance_wallet"
            color="warning"
            className="icon icon__mobile"
          />
        )}
        <div>
          <WxIcon icon="more_horiz" onClick={() => setShowPopup(true)} />
          <WxDropdown isOpen={showPopup} setIsOpen={setShowPopup} drop>
            <ul>
              <li className="wx__text_subtitle">
                <span className="wx__text_body" onClick={() => onUpdate(info)}>
                  <WxIcon icon="edit" />
                  Edit
                </span>
              </li>
              <li className="wx__text_subtitle" style={{ cursor: "pointer" }}>
                <span className="wx__text_body" onClick={() => onDelete(info)}>
                  <WxIcon icon="delete" color="danger" />
                  Delete
                </span>
              </li>
            </ul>
          </WxDropdown>
        </div>
      </div>
      <div className="wx__mt-3">
        <span className="wx__text-muted wx__text_body wx__text_regualar">
          {info?.paymentMedia?.typeMeta?.title}
        </span>
        <br />
        <span className="wx__text_body wx__text_strong">
          {info?.paymentMedia?.title}
        </span>
      </div>
      <div className="wx__mt-3">
        <span className="wx__text-muted wx__text_body wx__text_regualar">
          Branch Name
        </span>
        <br />
        <span className="wx__text_body wx__text_strong">
          {info?.branchName || "---"}
        </span>
      </div>
      <div className="wx__mt-3">
        <span className="wx__text-muted wx__text_body wx__text_regualar">
          Account Name
        </span>
        <br />
        <span className="wx__text_body wx__text_strong">
          {info?.accountName || "---"}
        </span>
      </div>
      <div className="wx__mt-3">
        <span className="wx__text-muted wx__text_body wx__text_regualar">
          Account / Mobile number
        </span>
        <br />
        <span className="wx__text_body wx__text_strong">
          {info?.accountNumber || info?.mobile}
        </span>
      </div>
    </div>
  );
};

export default PaymentMethodCard;
