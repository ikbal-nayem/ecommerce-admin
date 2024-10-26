import { ConfirmationModal } from "@components/ConfirmationModal/ConfirmationModal";
import WxMainMd from "@components/MainContentLayout/WxMainMd";
import { FormHeader } from "@components/FormLayout";
import PaymentMethodSkelton from "@components/WxSkelton/Setting/Payment/PaymentMethodSkelton";
import WxTag from "@components/WxTag";
import { MASTER_META_KEY } from "config/constants";
import {
  IPaymentConfigured,
  IPaymentSupported,
} from "@interfaces/common.interface";
import { SETTINGS } from "routes/path-name.route";
import { PaymentService } from "services/api/Payment.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useRef, useState } from "react";
import skeltonLoader from "utils/skeltonLoader";
import { imageURLGenerate } from "utils/utils";
import ConfigurePayment from "./configure/Configure";
import "./Payment.scss";

const Payment = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [configuredList, setConfiguredList] = useState<{
    gateway: IPaymentConfigured[];
    offlinePayment: any;
  }>();
  const [supportedList, setSupportedList] = useState<IPaymentSupported[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [confirmationModal, setConfirmationModal] = useState<boolean>(false);

  const editItem = useRef(null);

  const [configureLoader, setConfigureLoader] = useState<boolean>(true);
  const [supportLoader, setSupportLoader] = useState<boolean>(true);

  useEffect(() => {
    getList();
  }, []);

  const getList = () => {
    const configuredReq = PaymentService.getConfigured();
    const supportedReq = PaymentService.getSupported();
    Promise.all([configuredReq, supportedReq])
      .then(([configured, supported]) => {
        setConfiguredList(configured.body);
        setSupportedList(supported.body);
      })
      .finally(() => {
        setLoading(false);
        skeltonLoader(setSupportLoader);
        skeltonLoader(setConfigureLoader);
      });
  };

	const onFormOpen = (formType: string, item: any) => {
		let formData = item;
		if (formType === "SUPPORTED") {
			formData = item?.isOffline
				? {
						isOffline: item.isOffline,
						gatewayProvider: item?.metaKey,
						mediaType: item?.metaType,
						title: item?.title,
						isActive: true,
						isServiceChargeApplicable: true,
						willTakeAccountNo: 2,
						willTakeTrxId: 0,
						willTakeFile: 0,
				  }
				: {
						gatewayProvider: item?.metaKey,
						title: item?.title,
						isActive:
							item?.metaKey === MASTER_META_KEY.PAYMENT_GATEWAY_TYPE_COD,
						isSandbox: false,
						secretKey:
							item?.metaKey === MASTER_META_KEY.PAYMENT_GATEWAY_TYPE_COD
								? MASTER_META_KEY.PAYMENT_GATEWAY_TYPE_COD
								: null,
						secretPwd:
							item?.metaKey === MASTER_META_KEY.PAYMENT_GATEWAY_TYPE_COD
								? MASTER_META_KEY.PAYMENT_GATEWAY_TYPE_COD
								: null,
				  };
		}
		editItem.current = formData;
		if (
			formType === "SUPPORTED" &&
			item?.metaKey === MASTER_META_KEY.PAYMENT_GATEWAY_TYPE_COD
		) {
			setConfirmationModal(true);
			return;
		}
		if (formType === "CONFIGURED" && item?.type)
			editItem.current = { ...editItem.current, isOffline: true };
		setOpen(true);
	};

  const handleClose = (shouldReload: boolean = false) => {
    editItem.current = null;
    setOpen(false);
    setConfirmationModal(false);
    if (shouldReload) getList();
  };

  const onConfirm = () => onSubmit(editItem.current);

  const onSubmit = (reqData: IPaymentConfigured) => {
    setSaving(true);
    const requestURL = editItem.current?.id
      ? reqData?.isOffline
        ? PaymentService.offlineUpdate
        : PaymentService.update
      : reqData?.isOffline
      ? PaymentService.offlineCreate
      : PaymentService.create;
    requestURL(reqData)
			.then((res) => {
				ToastService.success(res?.message);
				handleClose(true);
			})
			.catch((err) => ToastService.error(err?.message))
			.finally(() => setSaving(false));
  };

  return (
    <div>
      <WxMainMd className="setting_patment_page">
        <FormHeader title="Payment" backNavigationLink={SETTINGS} />
        {!configureLoader ? (
          configuredList?.gateway?.length ||
          configuredList?.offlinePayment?.length ? (
            <div className="card p-3 mt-3">
              <h6 className="text_heading text_semibold mb-0">
                Configured Payment Methods
              </h6>
              {configuredList?.gateway?.map((item, index) => (
                <div
                  className="payment_btn mt-3"
                  key={index}
                  onClick={() => onFormOpen("CONFIGURED", item)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <img
                      src={imageURLGenerate(item?.banner)}
                      alt={item?.gatewayProvider}
                      height={30}
                    />
                    <div>
                      <WxTag
                        label={item?.isActive ? "Active" : "Inactive"}
                      />
                      {item?.isSandbox ? (
                        <WxTag label="Sandbox" color="warning" />
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
              {configuredList?.offlinePayment?.map((item, index) => (
                <div
                  className="payment_btn mt-3"
                  key={index}
                  onClick={() => onFormOpen("CONFIGURED", item)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <img
                      src={imageURLGenerate(item?.banner)}
                      alt={item?.gatewayProvider}
                      height={30}
                    />
                    <div>
                      <WxTag
                        label={item?.isActive ? "Active" : "Inactive"}
                      />
                      {item?.isSandbox ? (
                        <WxTag label="Sandbox" color="warning" />
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted">
              <strong>Nothing configured yet!</strong>
            </div>
          )
        ) : (
          <div className="bg-white mt-3 rounded">
            <PaymentMethodSkelton viewBox="0 0 595 150" />
          </div>
        )}

        {!supportLoader ? (
          supportedList?.length > 0 ? (
            <div className="card p-3 mt-3">
              <h6 className="text_heading text_semibold mb-0">
                Supported Payment Methods
              </h6>
              {supportedList?.map((item, index) => (
                <div
                  className="payment_btn mt-3"
                  key={index}
                  onClick={() => onFormOpen("SUPPORTED", item)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <img
                      src={imageURLGenerate(item?.banner)}
                      alt={item?.title}
                      height={30}
                    />
                    <WxTag label="Not configured" />
                  </div>
                </div>
              ))}
            </div>
          ) : null
        ) : (
          <div className="bg-white mt-3 rounded">
            <PaymentMethodSkelton viewBox="0 0 595 150" />
          </div>
        )}
      </WxMainMd>
      <ConfigurePayment
        isOpen={open}
        editItem={editItem.current}
        handleClose={handleClose}
        onSubmit={onSubmit}
        saving={saving}
      />
      <ConfirmationModal
        onConfirm={onConfirm}
        isOpen={confirmationModal}
        onClose={handleClose}
        isSubmitting={loading || saving}
        title="Active Confirmation!"
        onConfirmLabel="Yes Active"
        body={
          <>
            Do you want to active <strong>{editItem.current?.title}</strong>?
          </>
        }
      />
    </div>
  );
};

export default Payment;
