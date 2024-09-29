import BlockSection from "@components/BlockSection/BlockSection";
import WxSelect from "@components/Select/WxSelect";
import WxButton from "@components/WxButton";
import WxImg from "@components/WxImg/WxImg";
import WxInput from "@components/WxInput";
import WxModal from "@components/WxModal";
import WxModalBody from "@components/WxModal/WxModalBody";
import WxModalFooter from "@components/WxModal/WxModalFooter";
import WxModalHeader from "@components/WxModal/WxModalHeader";
import WxRadio from "@components/WxRadio/WxRadio";
import { MASTER_META_KEY } from "config/constants";
import { IOrderTimeline } from "@interfaces/order.interface";
import { OrderService } from "services/api/Order.service";
import { PaymentService } from "services/api/Payment.service";
import { ButtonLoader } from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { memo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { imageURLGenerate } from "utils/utils";

type MarkAsPaidProps = {
	invoiceId: string;
	onPayment: (invoice: { [key: string]: string }) => void;
	isModalOpen?: boolean;
	handleClose?: () => void;
	approveData?: IOrderTimeline;
};

const MarkAsPaid = ({
	isModalOpen,
	handleClose,
	invoiceId,
	onPayment,
	approveData,
}: MarkAsPaidProps) => {
	const [isImageView, setImageView] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [paymentMethodList, setPaymentMethodList] = useState([]);
	const {
		register,
		watch,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<any>({
		defaultValues: { isPartial: "false", invoiceId },
	});

	useEffect(() => {
		if (isModalOpen) {
			setIsLoading(true);
			PaymentService.getConfigured()
				.then((resp) => {
					setPaymentMethodList([
						...resp.body?.gateway?.filter(
							(p) =>
								p?.gatewayProvider ===
									MASTER_META_KEY.PAYMENT_GATEWAY_TYPE_COD && p?.isActive
						),
						...resp.body?.offlinePayment?.filter((p) => p?.isActive),
					]);
				})
				.finally(() => setIsLoading(false));
			if (approveData) {
				reset({
					id: approveData?.id,
					isApprove: true,
					isPartial: approveData ? "true" : "false",
					invoiceId,
					payGateway: approveData?.payGateway || "",
					pgTxnid: approveData?.pgTxnid || "",
					referance: approveData?.paidAccountNumber || "",
				});
			} else reset({ isPartial: "false", invoiceId });
		}
	}, [isModalOpen, approveData]);

	const onSubmit = (data) => {
		setIsSaving(true);
		data.isPartial = data.isPartial === "true" ? true : false;
		const req = !!approveData
			? OrderService.changePaymentStatus
			: OrderService.createInvoicePayment;
		req(data)
			.then((resp) => {
				ToastService.success(resp?.message);
				handleClose();
				onPayment(resp.body);
			})
			.catch((err) => ToastService.error(err?.message))
			.finally(() => setIsSaving(false));
	};

	return (
		<>
			<WxModal show={isModalOpen} size="md" handleClose={handleClose}>
				<WxModalHeader title="Manual payment" closeIconAction={handleClose} />
				<BlockSection isblocked={isLoading} hasLoader>
					<form onSubmit={handleSubmit(onSubmit)} noValidate>
						<WxModalBody>
							{!approveData ? (
								<div className="wx__d-flex">
									<WxRadio
										id="FULL"
										label="Full pay"
										singleUse
										value={false}
										registerProperty={{ ...register("isPartial") }}
									/>
									<WxRadio
										id="PARTIAL"
										label="Partial pay"
										singleUse
										value={true}
										registerProperty={{ ...register("isPartial") }}
									/>
								</div>
							) : null}
							<div className="wx__row">
								<div className="wx__col-md-6">
									<WxSelect
										label="Payment method"
										placeholder="Choose method"
										options={paymentMethodList}
										textKey="title"
										valuesKey="gatewayProvider"
										isRequired
										isDisabled={!!approveData}
										registerProperty={{
											...register("payGateway", {
												required: "Select a payment method",
												disabled: !!approveData,
											}),
										}}
										errorMessage={errors?.payGateway?.message}
										color={errors?.payGateway ? "danger" : "secondary"}
									/>
								</div>
								<div className="wx__col-md-6">
									<WxInput
										label="Transection ID"
										isDisabled={!!approveData}
										registerProperty={{
											...register("pgTxnid", { disabled: !!approveData }),
										}}
									/>
								</div>
								{watch("isPartial") === "true" ? (
									<div className="wx__col-md-6">
										<WxInput
											label="Pay amount"
											type="number"
											min={0}
											isRequired
											registerProperty={{
												...register("payAmount", {
													valueAsNumber: true,
													required: "Pay amount is required",
												}),
											}}
											errorMessage={errors?.payAmount?.message}
											color={errors?.payAmount ? "danger" : "secondary"}
										/>
									</div>
								) : null}
							</div>
							<WxInput
								label="Referance"
								registerProperty={{ ...register("referance") }}
							/>
							{Object.keys(approveData?.file || {})?.length ? (
								<WxButton
									size="sm"
									variant="fill"
									color="secondary"
									onClick={() => setImageView(true)}
								>
									See prove
								</WxButton>
							) : null}
						</WxModalBody>
						<WxModalFooter className="wx__bg-white">
							<div className="wx__d-flex justify-content-between">
								<WxButton
									variant="outline"
									color="secondary"
									disabled={isSaving}
									onClick={handleClose}
								>
									Cancel
								</WxButton>
								<WxButton type="submit" variant="fill" disabled={isSaving}>
									{isSaving ? <ButtonLoader /> : "Done"}
								</WxButton>
							</div>
						</WxModalFooter>
					</form>
				</BlockSection>
			</WxModal>

			<WxModal
				show={isImageView}
				handleClose={() => setImageView(false)}
				size="lg"
			>
				<WxImg src={imageURLGenerate(approveData?.file)} alt="." width="100%" />
			</WxModal>
		</>
	);
};

export default memo(MarkAsPaid);
