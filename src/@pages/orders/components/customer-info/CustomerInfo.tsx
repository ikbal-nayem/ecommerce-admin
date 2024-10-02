import SelectOption from "@components/Select/Select";
import WxIcon from "@components/Icon";
import WxLabel from "@components/WxLabel";
import { STATUS_CONSTANT } from "config/constants";
import {
	ICustomerPayload,
	ICustomerResponse,
} from "@interfaces/Customer.interface";
import { CUSTOMER_CREATE } from "routes/path-name.route";
import { CustomerService } from "services/api/Customer.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type CustomerInfoProps = {
	customerId?: string;
	selectedCustomer: ICustomerResponse;
	onCustomerSelect?: (customer: ICustomerResponse | null) => void;
	handleAddressEdit: (type: string) => void;
	selectedAddress: any;
};

const CustomerInfo = ({
	customerId,
	selectedCustomer,
	onCustomerSelect,
	handleAddressEdit,
	selectedAddress,
}: CustomerInfoProps) => {
	const [loading, setLoading] = useState<boolean>(false);

	const navigate = useNavigate();

	useEffect(() => {
		customerId && handleCustomerChoose({ customerId });
	}, [customerId]);

	const getCustomerList = (
		customerQuery: string = null,
		setList?: (options: any[]) => void
	) => {
		CustomerService.get({
			body: { name: customerQuery },
			meta: {
				offset: 0,
				limit: 15,
				sort: [{ order: "asc", field: "name" }],
			},
		}).then((res) =>
			setList(
				res.body?.filter(
					(item: ICustomerPayload) => item.status === STATUS_CONSTANT.active
				)
			)
		);
	};

	const handleCustomerChoose = (customer: any) => {
		if (customer?.customerId) {
			setLoading(true);
			CustomerService.profile(customer?.customerId)
				.then((resp) => {
					onCustomerSelect(resp.body);
				})
				.catch((err) => ToastService.error(err))
				.finally(() => setLoading(false));
		}
	};

	const shippingAddress = selectedAddress?.shipping;
	const billingAddress = selectedAddress?.billing;

	return (
		<div className="card mt-3 p-3">
			<WxLabel
				isRequired
				labelRight={
					selectedCustomer && onCustomerSelect ? (
						<WxIcon
							variants="round"
							icon="cancel"
							role="button"
							onClick={() => onCustomerSelect(null)}
						/>
					) : null
				}
			>
				Customer
			</WxLabel>
			{selectedCustomer ? (
				<>
					<p className="text_body text_strong text-primary">
						{selectedCustomer?.customer?.name}
					</p>
					<div className="mb-3">
						<WxLabel
							labelRight={
								<span
									className="text-primary text_small"
									role="button"
									onClick={() => handleAddressEdit("shipping")}
								>
									Edit
								</span>
							}
						>
							Shipping Address
						</WxLabel>
						{shippingAddress ? (
							<div className="text_body text_regular">
								{shippingAddress?.email ? (
									<>
										<span>{shippingAddress?.email}</span>
										<br />
									</>
								) : null}
								<span>
									{shippingAddress?.addressLine1
										? shippingAddress?.addressLine1 + ","
										: null}
									&nbsp;
									{shippingAddress?.addressLine2
										? shippingAddress?.addressLine2 + ","
										: null}
									&nbsp;
									{shippingAddress?.cityName ? shippingAddress?.cityName : null}
									{shippingAddress?.postCode
										? "-" + shippingAddress?.postCode + ","
										: null}
									&nbsp;
									{shippingAddress?.state ? shippingAddress?.state + "," : null}
									&nbsp;
									{shippingAddress?.country
										? shippingAddress?.country + ","
										: null}
								</span>
								<br />
								<span>{shippingAddress?.phone || null}</span>
							</div>
						) : (
							"No address found"
						)}
					</div>
					<div className="mb-3">
						<WxLabel
							labelRight={
								<span
									className="text-primary text_small"
									role="button"
									onClick={() => handleAddressEdit("billing")}
								>
									Edit
								</span>
							}
						>
							Billing Address
						</WxLabel>
						{billingAddress ? (
							<div className="text_body text_regular">
								{billingAddress?.email ? (
									<>
										<span>{billingAddress?.email}</span>
										<br />
									</>
								) : null}
								<span>
									{billingAddress?.addressLine1
										? billingAddress?.addressLine1 + ","
										: null}
									&nbsp;
									{billingAddress?.addressLine2
										? billingAddress?.addressLine2 + ","
										: null}
									&nbsp;
									{billingAddress?.cityName ? billingAddress?.cityName : null}
									{billingAddress?.postCode
										? "-" + billingAddress?.postCode + ","
										: null}
									&nbsp;
									{billingAddress?.state ? billingAddress?.state + "," : null}
									&nbsp;
									{billingAddress?.country
										? billingAddress?.country + ","
										: null}
								</span>
								<br />
								<span>{billingAddress?.phone || null}</span>
							</div>
						) : (
							"No address found"
						)}
					</div>
				</>
			) : !loading ? (
				<SelectOption
					isAsyncList
					cacheOptions
					placeholder="Search Customer"
					loadAsyncOptions={getCustomerList}
					onChange={handleCustomerChoose}
					getOptionLabel={(op: ICustomerPayload) =>
						op.customerId ? (
							<>
								<span>{op.name}</span>
								<br />
								<span>{op.phoneNumber}</span>
							</>
						) : (
							"Create customer"
						)
					}
					onCreateOption={() => navigate(CUSTOMER_CREATE)}
					getOptionValue={(op: ICustomerPayload) => op}
				/>
			) : (
				<Preloader />
			)}
		</div>
	);
};

export default CustomerInfo;
