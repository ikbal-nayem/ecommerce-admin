import MainLg from "@components/MainContentLayout/MainLg";
import WxNotFound from "@components/NotFound/NotFound";
import Select from "@components/Select/Select";
import {Button} from "@components/Button";
import { FormHeader } from "@components/FormLayout";
import WxHr from "@components/WxHr";
import TextInput from "@components/TextInput";
import WxRadio from "@components/WxRadio/WxRadio";
import { PAYMENT_SERVICE } from "config/api-constant";
import { MASTER_META_KEY } from "config/constants";
import { ENV } from "config/ENV.config";
import {
	IDistrict,
	IDivision,
	IPaymentSupported,
} from "@interfaces/common.interface";
import { IAddressesPayload } from "@interfaces/Customer.interface";
import { InvoiceService } from "services/api/Invoice.service";
import { LocationService } from "services/api/Location.service";
import { PaymentService } from "services/api/Payment.service";
import { ProfileService } from "services/api/settings/Profile.service";
import Preloader, { ButtonLoader } from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useAuth } from "context/auth";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

const getWayUrl = {
	[MASTER_META_KEY.PAYMENT_GATEWAY_TYPE_AAMAR_PAY]:
		PAYMENT_SERVICE + "public/payNow/aamarpay/merchantInvoice/",
	[MASTER_META_KEY.PAYMENT_GATEWAY_TYPE_SSL_COMMERZ]:
		PAYMENT_SERVICE + "public/payNow/sslcomrz/merchantInvoice/",
	[MASTER_META_KEY.PAYMENT_GATEWAY_TYPE_PAY_WITH_WALLET]:
		PAYMENT_SERVICE + "public/payNow/sslcomrz/merchantInvoice/",
	[MASTER_META_KEY.PAYMENT_GATEWAY_TYPE_BANK_TRANSFER]:
		PAYMENT_SERVICE + "public/payNow/sslcomrz/merchantInvoice/",
};

const Payment = () => {
	const [loading, setIsLoading] = useState<boolean>(false);
	const [openingGetway, setOpeningGetway] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);
	const [getWayList, setGetWayList] = useState<IPaymentSupported[]>([]);
	const [invoiceInfo, setInvoiceInfo] = useState<any>();
	const [districts, setDistricts] = useState<IDistrict[]>([]);
	const [divisions, setDivisions] = useState<IDivision[]>([]);
	const [userAddressList, setUserAddressList] = useState<any[]>([]);
	const [selectedAddress, setSelectedAddress] = useState<string>();
	const {
		handleSubmit,
		setValue,
		getValues,
		register,
		formState: { errors },
		reset,
	} = useForm<any>();
	const { logout } = useAuth();

	let [searchParams] = useSearchParams();

	const invoiceId = searchParams.get("invoiceId");

	useEffect(() => {
		setIsLoading(true);
		const getWayListReq = PaymentService.getWebXGateways();
		const invoiceInfoReq = InvoiceService.getInvoiceInfo(invoiceId);
		const divisionReq = LocationService.getDivision("19");
		const userAddressReq = ProfileService.getAllUserAddress();
		Promise.all([getWayListReq, invoiceInfoReq, divisionReq, userAddressReq])
			.then(([getWayListRes, invoiceInfoRes, divisionRes, userAddressRes]) => {
				setGetWayList(getWayListRes.body);
				setDivisions(divisionRes.body);
				setInvoiceInfo(invoiceInfoRes.body);
				setUserAddressList(userAddressRes.body);
				const preSelectedId =
					invoiceInfoRes?.body?.merchantPurchases?.billingAddress?.id;
				const address = preSelectedId
					? userAddressRes.body?.find(
							(item: IAddressesPayload) => item.id === preSelectedId
					  )
					: userAddressRes.body?.[0];
				const divisionId = divisionRes.body?.find(
					(val: IDivision) => val.division_name_eng === address?.state
				)?.division_id;
				getDistricts(divisionId);
				setSelectedAddress(address?.id);
				const gatewayProvider = getWayListRes.body?.length
					? getWayListRes.body?.[0]?.gatewayProvider
					: "";
				reset({ gatewayProvider, address });
			})
			.catch((err) => {
				ToastService.error(err.message);
				setIsError(true);
			})
			.finally(() => setIsLoading(false));
	}, []);

	const onDivisionSelect = (division: string) => {
		const divisionId = divisions?.find(
			(val: IDivision) => val.division_name_eng === division
		)?.division_id;
		setValue("address.cityName", null);
		getDistricts(divisionId);
	};

	const getDistricts = (divisionId: string) => {
		divisionId
			? LocationService.getDistrict("19", divisionId).then((res) =>
					setDistricts(res.body)
			  )
			: setDistricts([]);
	};

	const onPaymentMethodChange = (e: any, getway: IPaymentSupported) => {
		setValue("gatewayProvider", e.target.checked ? getway.gatewayProvider : "");
	};

	const onAddressChange = (e) => {
		setSelectedAddress(e.target.value);
		const values = getValues();
		const newSelectedAddress = userAddressList.find(
			(val) => val?.id === e.target.value
		);
		onDivisionSelect(newSelectedAddress.state);
		reset({
			...values,
			address: {
				...newSelectedAddress,
			},
		});
	};

	const onSubmit = (data) => {
		if (invoiceInfo?.merchantPurchases?.totalPayableAmount === 0) {
			setOpeningGetway(true);
			PaymentService.payFree(invoiceId)
				.then((resp) => {
					ToastService.success(resp?.message);
					resp?.body?.logout && logout();
				})
				.catch((err) => ToastService.error(err?.message))
				.finally(() => setOpeningGetway(false));
			return;
		}
		if (!data?.gatewayProvider) {
			ToastService.error("Please select payment method");
			return;
		}
		setOpeningGetway(true);
		InvoiceService.merchantPurchaseInvoice({
			invoiceId: invoiceId,
			address: data?.address,
		})
			.then((resp) => {
				window.open(
					ENV.ApiEndpoint + getWayUrl[data?.gatewayProvider] + invoiceId,
					"_self"
				);
			})
			.catch((err) => ToastService.error(err.message));
	};

	if (loading) return <Preloader />;

	return (
		<MainLg>
			<FormHeader title="Payment" />
			{isError ? (
				<WxNotFound
					title="Oops!"
					description="Something went wrong, please try again later."
				/>
			) : (
				<form onSubmit={handleSubmit(onSubmit)} noValidate>
					<div className="row">
						<div className="col-lg-8 col-md-12 col-sm-12">
							<div className="card p-3 mb-3">
								<h6>Payment Method</h6>
								{getWayList?.map((getway) => (
									<div key={getway.id}>
										<WxRadio
											singleUse
											id={getway?.id}
											isChecked={
												getValues("gatewayProvider") === getway.gatewayProvider
											}
											onChange={(e) => onPaymentMethodChange(e, getway)}
											label={getway.title}
										/>
									</div>
								))}
							</div>
							<div className="card border-0 p-3">
								<div className="d-flex justify-content-between align-items-center">
									<h6 className="m-0">Billing address</h6>
									<Select
										id="address-selector"
										options={userAddressList}
										textKey="title"
										valuesKey="id"
										value={selectedAddress}
										onChange={onAddressChange}
										noMargin
									/>
								</div>
								<WxHr />
								<TextInput
									label="Address line 1"
									isRequired
									registerProperty={{
										...register("address.addressLine1", {
											required: "Address is required",
										}),
									}}
									color={errors?.address?.addressLine1 ? "danger" : "secondary"}
									errorMessage={errors?.address?.addressLine1?.message}
								/>
								<div className="row">
									<div className="col-sm-6 col-12">
										<Select
											label="Division"
											isRequired
											options={divisions}
											placeholder="Select Division"
											textKey="division_name_eng"
											valuesKey="division_name_eng"
											registerProperty={{
												...register("address.state", {
													required: "Please select a division",
													onChange: (e) => onDivisionSelect(e.target.value),
												}),
											}}
											color={errors?.address?.state ? "danger" : "secondary"}
											errorMessage={errors?.address?.state?.message}
										/>
									</div>
									<div className="col-6">
										<Select
											key={districts?.length}
											label="District"
											isRequired
											options={districts}
											placeholder="Select District"
											valuesKey="zilla_name_eng"
											textKey="zilla_name_eng"
											registerProperty={{
												...register("address.cityName", {
													required: "Please select a division",
												}),
											}}
											color={errors?.address?.cityName ? "danger" : "secondary"}
											errorMessage={errors?.address?.cityName?.message}
										/>
									</div>
									<div className="col-6">
										<TextInput
											label="Post code"
											registerProperty={{ ...register("address.postCode") }}
										/>
									</div>
									<div className="col-sm-6 col-12">
										<TextInput
											label="Email address"
											type="email"
											isRequired
											registerProperty={{
												...register("address.email", {
													required: "Phone or Email is required",
												}),
											}}
											color={errors?.email ? "danger" : "secondary"}
											errorMessage={errors?.email?.message}
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="col-lg-4 col-md-12 col-sm-12">
							<div className="card p-3">
								<h6>Summary</h6>
								<div className="d-flex align-items-center justify-content-between">
									<span className="text_h6 text_subtitle text_strong">
										Total
									</span>
									<strong className="text_subtitle text_strong">
										{invoiceInfo?.merchantPurchases?.totalPayableAmount?.toLocaleString()}
										&nbsp;
										{invoiceInfo?.merchantPurchases?.currencyCode}
									</strong>
								</div>
								<WxHr />
								<Button type="submit" variant="fill" disabled={openingGetway}>
									{openingGetway ? <ButtonLoader /> : "Continue"}
								</Button>
							</div>
						</div>
					</div>
				</form>
			)}
		</MainLg>
	);
};

export default Payment;
