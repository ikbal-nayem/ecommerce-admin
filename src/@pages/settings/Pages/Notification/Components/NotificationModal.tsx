import WxButton from "@components/WxButton";
import WxInput from "@components/WxInput";
import WxModal from "@components/WxModal";
import WxModalBody from "@components/WxModal/WxModalBody";
import WxModalFooter from "@components/WxModal/WxModalFooter";
import WxModalHeader from "@components/WxModal/WxModalHeader";
import { MASTER_META_KEY } from "config/constants";
import { ISenderEmail } from "@interfaces/common.interface";
import { IRateInfo } from "@interfaces/Settings.interface";
import { EmailService } from "services/api/email/Email.service";
import { NotificationSettingService } from "services/api/settings/Notification.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface NotificationModalProps {
	isModalOpen: boolean;
	rateInfo: IRateInfo;
	handleDialogeClose: () => void;
	handleDone: any;
	data: any;
	senderEmail: ISenderEmail;
}

const NotificationModal = ({
	isModalOpen,
	rateInfo,
	handleDialogeClose,
	handleDone,
	data,
	senderEmail,
}: NotificationModalProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		reset,
	} = useForm<any>({ defaultValues: { inputValue: null } });

	useEffect(() => {
		if (isModalOpen) {
			senderEmail?.email
				? reset({ id: senderEmail?.id, inputValue: senderEmail.email })
				: reset({ inputValue: null });
		}
	}, [isModalOpen]);

	const value = watch("inputValue") || 0;
	const rate =
		data?.masterMetaKey === MASTER_META_KEY.WEBX_SERVICES_EMAIL
			? rateInfo?.emailRate
			: rateInfo?.nonMaskingSmsRate;

	const onSubmit = ({ id, inputValue }) => {
		setIsLoading(true);
		if (data?.task === "BUY") {
			NotificationSettingService.merchantPurchaseCreate({
				quantity: inputValue,
				sellingPrice: rate,
				serviceMetaKey: data?.masterMetaKey,
			})
				.then((resp) => {
					ToastService.success(resp?.message);
					handleDone(data?.task, resp.body);
				})
				.catch((err) => ToastService.error(err?.message))
				.finally(() => setIsLoading(false));
			return;
		}

		EmailService.saveSenderEmail({ id, email: inputValue })
			.then((resp) => {
				ToastService.success(resp?.message);
				handleDone(data?.task, resp.body);
			})
			.catch((err) => ToastService.error(err?.message))
			.finally(() => setIsLoading(false));
	};

	return (
		<WxModal show={isModalOpen} size="md" handleClose={handleDialogeClose}>
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<WxModalHeader
					title={data?.heading}
					closeIconAction={handleDialogeClose}
					className="border-0"
				/>
				<WxModalBody>
					<div className="row">
						<div className="col-md-12">
							<WxInput
								label={data?.inputLabel}
								isRequired
								isAutoFocus
								type={data?.inputType}
								placeholder={data?.placeholder}
								registerProperty={{
									...register(
										"inputValue",
										data?.task === "BUY"
											? {
													required: "Please set a value.",
													min: {
														value: 1,
														message: "Please set a positive value.",
													},
													valueAsNumber: true,
											  }
											: { required: "Please provide a valid email address." }
									),
								}}
								color={errors.inputValue ? "danger" : "secondary"}
								errorMessage={errors.inputValue?.message}
							/>
							{data?.task === "BUY" ? (
								<p className="wx__text_subtitle wx__text_regular">
									Total amount: {value || 0} X {rate}&nbsp;=&nbsp;
									{(value * rate).toFixed(2)} BDT
								</p>
							) : null}
						</div>
					</div>
				</WxModalBody>
				<WxModalFooter className="wx__bg-white">
					<div className="d-flex justify-content-end">
						<WxButton
							variant="outline"
							color="secondary"
							onClick={handleDialogeClose}
							disabled={isLoading}
							className="wx__me-3"
						>
							Cancel
						</WxButton>
						<WxButton variant="fill" type="submit" disabled={isLoading}>
							{isLoading ? <Preloader /> : data?.buttonLabel}
						</WxButton>
					</div>
				</WxModalFooter>
			</form>
		</WxModal>
	);
};

export default NotificationModal;
