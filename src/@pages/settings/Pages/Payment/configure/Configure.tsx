import "./Configure.scss";
import WxButton from "@components/WxButton";
import WxDrawer from "@components/WxDrawer";
import WxDrawerBody from "@components/WxDrawer/WxDrawerBody";
import WxDrawerFooter from "@components/WxDrawer/WxDrawerFooter";
import WxDrawerHeader from "@components/WxDrawer/WxDrawerHeader";
import WxIcon from "@components/WxIcon/WxIcon";
import WxInput from "@components/WxInput";
import WxSwitch from "@components/WxSwitch";
import { MASTER_META_KEY } from "config/constants";
import { IPaymentConfigured } from "@interfaces/common.interface";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import WxTextarea from "@components/WxTextarea";
import { ButtonLoader } from "services/utils/preloader.service";
import WxSelect from "@components/Select/WxSelect";
import WxCheckbox from "@components/WxCheckbox";
import WxRadio from "@components/WxRadio/WxRadio";
import WxLabel from "@components/WxLabel";

const accountType = [{ title: "Personal" }, { title: "Agent" }];
const options = [
	{ id: 2, title: "Yes" },
	{ id: 0, title: "No" },
	{ id: 1, title: "Optional" },
];

const CreatePayment = ({ isOpen, handleClose, editItem, onSubmit, saving }) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
		setValue,
		watch,
	} = useForm({ ...editItem });


	useEffect(() => {
		reset({ ...editItem });
	}, [editItem]);

	const onStatusChange = (statusName: string, status: boolean) => {
		if (statusName === "isActive" && status) {
			setValue("isSandbox", false);
		} else if (statusName === "isSandbox" && status) {
			setValue("isActive", false);
		}
	};

	const onSubmitting = (requestData: IPaymentConfigured) => {
		onSubmit(requestData);
	};

	return (
		<WxDrawer show={isOpen} handleClose={handleClose}>
			<div className="payment_create_sec">
				<WxDrawerHeader
					title={`Configure ${editItem?.title}`}
					closeIconAction={handleClose}
				/>
				<form onSubmit={handleSubmit(onSubmitting)} noValidate>
					<WxDrawerBody>
						{editItem?.gatewayProvider !==
							MASTER_META_KEY.PAYMENT_GATEWAY_TYPE_COD &&
						!editItem?.isOffline ? (
							<>
								<WxInput
									isRequired
									label="Secret Key"
									registerProperty={{
										...register("secretKey", {
											required: "Secret key is required",
										}),
									}}
									color={errors.secretKey ? "danger" : "secondary"}
									errorMessage={errors?.secretKey?.message}
								/>
								<WxInput
									isRequired
									label="Password"
									type="password"
									registerProperty={{
										...register("secretPwd", { required: true }),
									}}
									color={errors.secretPwd ? "danger" : "secondary"}
									errorMessage={
										errors?.secretPwd ? "Secret password is required" : ""
									}
								/>
								<div className="mt-4" style={{ maxWidth: "90%" }}>
									<WxSwitch
										label="Sandbox Mode"
										checkedTitle="Active"
										unCheckedTitle="Inactive"
										registerProperty={{
											...register("isSandbox", {
												onChange: (e) =>
													onStatusChange(e.target.name, e.target.checked),
											}),
										}}
									/>
								</div>
								<div className="status_msg mb-4 mt-2">
									<WxIcon icon="info" />
									<p className="text_small text_regular">
										Within sandbox mode only admin can test the payment gateway
										from the website.
									</p>
								</div>
							</>
						) : null}

						{editItem?.isOffline ? (
							<>
								<div className="row">
									<div className="col-sm-6 col-12">
										<WxInput
											isRequired
											label="Account number"
											placeholder="01XX-XXX-XXXX"
											registerProperty={{
												...register("accountNumber", {
													required: "Account number is required!",
												}),
											}}
											color={errors.accountNumber ? "danger" : "secondary"}
											errorMessage={errors?.accountNumber?.message}
										/>
									</div>
									<div className="col-sm-6 col-12">
										<WxSelect
											label="Agent/Personal"
											isRequired
											valuesKey="title"
											textKey="title"
											options={accountType}
											registerProperty={{ ...register("type") }}
										/>
									</div>
								</div>
								<WxCheckbox
									id="has-charge"
									label="Is service charge applicable?"
									registerProperty={{
										...register("isServiceChargeApplicable"),
									}}
								/>
								<WxTextarea
									label="Instructions"
									isRequired
									registerProperty={{
										...register("instructions", {
											required: "Please provide an instruction",
										}),
									}}
									color={errors.instructions ? "danger" : "secondary"}
									errorMessage={errors?.instructions?.message}
								/>
								<div className="mb-2">
									<WxLabel>Take customer account number?</WxLabel>
									<div className="d-flex gap-3">
										{options.map((op) => (
											<WxRadio
												id={`willTakeAccountNo-${op.id}`}
												key={op?.id}
												label={op.title}
												isChecked={watch("willTakeAccountNo") === op.id}
												onChange={() => setValue("willTakeAccountNo", op.id)}
												singleUse
											/>
										))}
									</div>
								</div>
								<div className="mb-2">
									<WxLabel>Take transection id?</WxLabel>
									<div className="d-flex gap-3">
										{options.map((op) => (
											<WxRadio
												id={`willTakeTrxId-${op.id}`}
												key={op?.id}
												label={op.title}
												isChecked={watch("willTakeTrxId") === op.id}
												onChange={() => setValue("willTakeTrxId", op.id)}
												singleUse
											/>
										))}
									</div>
								</div>
								<div>
									<WxLabel>Take proof file?</WxLabel>
									<div className="d-flex gap-3">
										{options.map((op) => (
											<WxRadio
												id={`willTakeFile-${op.id}`}
												key={op?.id}
												label={op.title}
												isChecked={watch("willTakeFile") === op.id}
												onChange={() => setValue("willTakeFile", op.id)}
												singleUse
											/>
										))}
									</div>
								</div>
							</>
						) : null}

						<div className="mt-4" style={{ maxWidth: "90%" }}>
							<WxSwitch
								label="Enable in website"
								checkedTitle="Active"
								unCheckedTitle="Inactive"
								registerProperty={{
									...register("isActive", {
										onChange: (e) =>
											onStatusChange(e.target.name, e.target.checked),
									}),
								}}
							/>
						</div>
						<div className="status_msg mb-3 mt-2">
							<WxIcon icon="info" />
							<p className="text_small text_regular">
								Turn off sandbox mode to enable in website
							</p>
						</div>
					</WxDrawerBody>
					<WxDrawerFooter>
						<div className="d-flex justify-content-end">
							<WxButton
								color="secondary"
								type="button"
								variant="outline"
								className="me-2"
								onClick={handleClose}
								disabled={saving}
							>
								Cancel
							</WxButton>
							<WxButton variant="fill" type="submit" disabled={saving}>
								{saving ? <ButtonLoader /> : "Save"}
							</WxButton>
						</div>
					</WxDrawerFooter>
				</form>
			</div>
		</WxDrawer>
	);
};
export default CreatePayment;
