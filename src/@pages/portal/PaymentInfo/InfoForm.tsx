import PhoneNumberInput from "@components/PhoneWithCountryCode";
import Select from "@components/Select/Select";
import {Button} from "@components/Button";
import Drawer from "@components/Drawer";
import DrawerBody from "@components/Drawer/DrawerBody";
import DrawerFooter from "@components/Drawer/DrawerFooter";
import DrawerHeader from "@components/Drawer/DrawerHeader";
import TextInput from "@components/TextInput";
import Label from "@components/Label";
import WxRadio from "@components/WxRadio/WxRadio";
import { MASTER_META_KEY, MASTER_META_TYPE } from "config/constants";
import { IPaymentMetaType } from "@interfaces/common.interface";
import { IPortalPaymentMedia } from "@interfaces/portal.interface";
import Preferences from "@pages/onlineStore/preferences/Preferences";
import { AdminService } from "services/api/admin/Admin.service";
import { ProfileService } from "services/api/settings/Profile.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";

type IPaymentInfoFormProps = {
	isDrawerOpen: boolean;
	updateItem?: IPortalPaymentMedia | null;
	onModify?: (data: IPortalPaymentMedia) => void;
	handleClose: () => void;
};

const PaymentInfoForm = ({
	isDrawerOpen,
	updateItem,
	onModify,
	handleClose,
}: IPaymentInfoFormProps) => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [paymentTypes, setPaymentTypes] = useState<IPaymentMetaType[]>();
	const [medias, setMedias] = useState<any>();
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const { id } = useSelector((data: any) => data?.user?.user_data);
	const {
		register,
		control,
		watch,
		reset,
		getValues,
		formState: { errors },
		handleSubmit,
	} = useForm();

	useEffect(() => {
		AdminService.getByMetaType(MASTER_META_TYPE.PAYMENT_MEDIA_TYPE)
			.then(({ body }) => {
				setPaymentTypes(body);
				Promise.all(
					body?.map((media: IPaymentMetaType) =>
						AdminService.getPaymentMedia(media?.metaKey)
					)
				).then((respAll) => {
					let mRes = {};
					respAll.forEach(
						(resp, idx) => (mRes[body[idx]?.metaKey] = resp.body)
					);
					setMedias(mRes);
				});
			})
			.finally(() => setIsLoading(false));
	}, []);

	useEffect(() => {
		isDrawerOpen && !updateItem
			? reset({ metaKey: paymentTypes?.[0]?.metaKey })
			: reset({ ...updateItem, metaKey: updateItem?.paymentMedia.type });
	}, [isDrawerOpen, updateItem]);

	const onMediaTypeChange = (key: string) => {
		!!updateItem
			? reset(
					updateItem?.paymentMedia?.type === key
						? { ...updateItem, metaKey: key }
						: { id: updateItem?.id, userId: updateItem?.userId, metaKey: key }
			  )
			: reset({ metaKey: key });
	};

	const onSubmit = (data) => {
		setIsSaving(true);
		data.userId = id;
		let req = !!updateItem
			? ProfileService.updatePaymentMethod
			: ProfileService.setPaymentMethod;
		req(data)
			.then((resp) => {
				ToastService.success(resp?.message);
				onModify(resp?.body);
			})
			.catch((err) => ToastService.error(err?.message))
			.finally(() => setIsSaving(false));
	};

	console.log(getValues());
	

	return (
		<Drawer show={isDrawerOpen} handleClose={handleClose}>
			<div className="portal_payment_info">
				<DrawerHeader
					title={`${!!updateItem ? "Update" : "Add"} payment method`}
					onClickClose={handleClose}
				/>
				{isLoading ? (
					<Preferences />
				) : (
					<form onSubmit={handleSubmit(onSubmit)}>
						<DrawerBody>
							<Label>Method</Label>
							<div className="d-flex mb-3">
								{paymentTypes?.map((pType) => (
									<WxRadio
										label={pType?.title}
										id={pType?.id}
										singleUse
										isChecked={pType?.metaKey === watch("metaKey")}
										onChange={() => onMediaTypeChange(pType?.metaKey)}
									/>
								))}
							</div>
							{watch("metaKey") === MASTER_META_KEY.PAYMENT_MEDIA_TYPE_BANK ? (
								<div className="row">
									<div className="col-md-6 col-12">
										<Select
											key={watch("metaKey")}
											isRequired
											label="Bank Name"
											options={
												medias?.[MASTER_META_KEY.PAYMENT_MEDIA_TYPE_BANK]
											}
											placeholder="Select bank"
											valuesKey="id"
											textKey="title"
											registerProperty={{
												...register("paymentMediaId", {
													required: true,
													setValueAs: (v) => v || null,
												}),
											}}
											color={errors?.paymentMediaId ? "danger" : "secondary"}
											errorMessage={errors?.paymentMediaId?.message as string}
										/>
									</div>
									<div className="col-md-6 col-12">
										<TextInput
											key={watch("metaKey")}
											label="Branch name"
											isRequired
											registerProperty={{
												...register("branchName", { required: true }),
											}}
											color={errors?.branchName ? "danger" : "secondary"}
											errorMessage={errors?.branchName?.message as string}
										/>
									</div>
									<div className="col-md-6 col-12">
										<TextInput
											label="Account number"
											isRequired
											registerProperty={{
												...register("accountNumber", { required: true }),
											}}
											color={errors?.accountNumber ? "danger" : "secondary"}
											errorMessage={errors?.accountNumber?.message as string}
										/>
									</div>
									<div className="col-md-6 col-12">
										<TextInput
											label="Account name"
											isRequired
											registerProperty={{
												...register("accountName", { required: true }),
											}}
											color={errors?.accountName ? "danger" : "secondary"}
											errorMessage={errors?.accountName?.message as string}
										/>
									</div>
								</div>
							) : (
								<div className="row">
									<div className="col-md-6 col-12">
										<Select
											isRequired
											key={watch("metaKey")}
											label="Wallet provider"
											options={medias?.[MASTER_META_KEY.PAYMENT_MEDIA_TYPE_MFS]}
											placeholder="Select provider"
											valuesKey="id"
											textKey="title"
											registerProperty={{
												...register("paymentMediaId", {
													required: true,
													setValueAs: (v) => v || null,
												}),
											}}
											color={errors?.paymentMediaId ? "danger" : "secondary"}
											errorMessage={errors?.paymentMediaId?.message}
										/>
									</div>
									<div className="col-md-6 col-12">
										<Controller
											control={control}
											name="mobile"
											render={({
												field: { onChange, value },
												fieldState: { error },
											}) => (
												<PhoneNumberInput
													isRequired
													label="Phone Number"
													phoneNumber={value}
													setPhoneNumber={onChange}
													color={!!error ? "danger" : "secondary"}
													errorMessage={error?.message}
												/>
											)}
										/>
									</div>
								</div>
							)}
						</DrawerBody>

						<DrawerFooter>
							<div className="portal_payment_info__footer">
								<Button
									className="me-3"
									variant="outline"
									color="secondary"
									onClick={handleClose}
									disabled={isSaving}
								>
									Cancel
								</Button>
								<Button variant="fill" type="submit" disabled={isSaving}>
									{isSaving ? <Preloader /> : "Save"}
								</Button>
							</div>
						</DrawerFooter>
					</form>
				)}
			</div>
		</Drawer>
	);
};

export default PaymentInfoForm;
