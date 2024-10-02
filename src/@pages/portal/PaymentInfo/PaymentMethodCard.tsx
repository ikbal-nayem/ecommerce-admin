import WxDropdown from "@components/WxDropdown/WxDropdown";
import WxIcon from "@components/Icon";
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
    <div className="card payment_info_card">
      <div className="d-flex justify-content-between">
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
              <li className="text_subtitle">
                <span className="text_body" onClick={() => onUpdate(info)}>
                  <WxIcon icon="edit" />
                  Edit
                </span>
              </li>
              <li className="text_subtitle" style={{ cursor: "pointer" }}>
                <span className="text_body" onClick={() => onDelete(info)}>
                  <WxIcon icon="delete" color="danger" />
                  Delete
                </span>
              </li>
            </ul>
          </WxDropdown>
        </div>
      </div>
      <div className="mt-3">
        <span className="text-muted text_body text_regualar">
          {info?.paymentMedia?.typeMeta?.title}
        </span>
        <br />
        <span className="text_body text_strong">
          {info?.paymentMedia?.title}
        </span>
      </div>
      <div className="mt-3">
        <span className="text-muted text_body text_regualar">
          Branch Name
        </span>
        <br />
        <span className="text_body text_strong">
          {info?.branchName || "---"}
        </span>
      </div>
      <div className="mt-3">
        <span className="text-muted text_body text_regualar">
          Account Name
        </span>
        <br />
        <span className="text_body text_strong">
          {info?.accountName || "---"}
        </span>
      </div>
      <div className="mt-3">
        <span className="text-muted text_body text_regualar">
          Account / Mobile number
        </span>
        <br />
        <span className="text_body text_strong">
          {info?.accountNumber || info?.mobile}
        </span>
      </div>
    </div>
  );
};

export default PaymentMethodCard;
