import WxAlert from "@components/Alert/WxAlert";
import WxMainLg from "@components/MainContentLayout/MainLg";
import Select from "@components/Select/Select";
import {Button} from "@components/Button";
import Checkbox from "@components/Checkbox";
import { FormHeader } from "@components/FormLayout";
import WxHr from "@components/WxHr";
import Icon from "@components/Icon";
import TextInput from "@components/TextInput";
import { MASTER_META_KEY } from "config/constants";
import { IStatus } from "@interfaces/common.interface";
import {
	IAddressesPayload,
	ICustomerResponse,
} from "@interfaces/Customer.interface";
import { IProductVariant } from "@interfaces/product.interface";
import { ORDER, SETTINGS_PRICING_PLAN } from "routes/path-name.route";
import { StatusService } from "services/api/admin/Status.service";
import { OrderService } from "services/api/Order.service";
import { ProductService } from "services/api/products/Product.services";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import BrowseProduct from "../components/BrowseProduct/BrowseProduct";
import CustomerInfo from "../components/customer-info/CustomerInfo";
import OrderAddress from "../components/order-address/OrderAddress";
import PaymentInfo from "../components/payment-info/PaymentInfo";
import ProductCart from "../components/product-cart/ProductCart";

const calculateSubtotal = (productInfo: IProductVariant) => {
	return (
		(productInfo?.quantity || 0) *
		(productInfo?.sellingPrice || productInfo?.regularPrice)
	);
};

const CreateOrder = () => {
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
	const [addressDrawerOpen, setAddressDrawerOpen] = useState<boolean>(false);
	const [orderStatus, setOrderStatus] = useState<IStatus[]>([]);
	const [paymentStatus, setPaymentStatus] = useState<IStatus[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [saving, setSaving] = useState<boolean>(false);
	const [selectedProduct, setSelectedProduct] = useState<IProductVariant[]>([]);
	const [selectedCustomer, setSelectedCustomer] = useState<ICustomerResponse>();
	const [selectedAddress, setSelectedAddress] = useState<any>({});
	const editAddressType = useRef(null);
	const { register, handleSubmit, getValues, watch, setValue } = useForm();

	const navigate = useNavigate();

	const { activePlan } = useSelector((state: any) => state?.user);

	const [searchParams] = useSearchParams();
	const customerId = searchParams.get("customer_id");

	useEffect(() => {
		const order = StatusService.getOrderStatus();
		const payment = StatusService.getPaymentStatus();
		// const salesChannel = ProductService.getSalesChannel();
		Promise.all([order, payment])
			.then(([order, payment]) => {
				setValue(
					"orderStatus",
					order?.body?.find((item: IStatus) => item.isDefault)?.metaKey ||
						order?.body?.[0]?.metaKey
				);
				setValue(
					"paymentStatus",
					payment?.body?.find((item: IStatus) => item.isDefault)?.metaKey ||
						payment?.body?.[0]?.metaKey
				);
				setValue("channelKey", MASTER_META_KEY.SALES_CHANNEL_POS);
				setOrderStatus(order.body);
				setPaymentStatus(payment.body);
			})
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		setValue("orderLineList", []);
		selectedProduct.forEach((item, idx) => {
			setValue(`orderLineList.${idx}.productId`, item.id);
			setValue(
				`orderLineList.${idx}.productVariantCombinationId`,
				item.variantId || null
			);
			setValue(`orderLineList.${idx}.quantity`, item.quantity);
		});
	}, [selectedProduct]);

	useEffect(() => {
		setValue("shippingAddressId", selectedAddress?.shipping?.id);
		setValue("billingAddressId", selectedAddress?.billing?.id);
	}, [selectedAddress]);

	const addToCart = (product: IProductVariant) => {
		const id = product.variantId || product.id;
		const product_copy = { ...product };
		const newProductList = [...selectedProduct];
		const idx = newProductList.findIndex(
			(item) => (item?.variantId || item.id) === id
		);
		if (idx === -1) {
			product_copy.quantity = 1;
			product_copy.subTotal = calculateSubtotal(product_copy);
			newProductList.push(product_copy);
		} else {
			newProductList[idx].quantity += 1;
			newProductList[idx].subTotal = calculateSubtotal(newProductList[idx]);
		}
		setSelectedProduct([...newProductList]);
	};

	const removeFromCart = (product: IProductVariant) => {
		const id = product.variantId || product.id;
		const newProductList = [...selectedProduct];
		const idx = newProductList.findIndex(
			(item) => (item?.variantId || item.id) === id
		);
		newProductList.splice(idx, 1);
		setSelectedProduct([...newProductList]);
	};

	const updateQuantity = (productIndex: number, qty: number) => {
		// qty = qty > 0 ? qty : 1;
		const newProductList = [...selectedProduct];
		newProductList[productIndex].quantity = qty;
		newProductList[productIndex].subTotal = calculateSubtotal(
			newProductList[productIndex]
		);
		setSelectedProduct([...newProductList]);
	};

	const openDrawer = () => setDrawerOpen(true);
	const handleClose = () => setDrawerOpen(false);
	const handleCustomerDrawerClose = () => {
		editAddressType.current = null;
		setAddressDrawerOpen(false);
	};

	const handleAddressEdit = (type: string) => {
		editAddressType.current = type;
		setAddressDrawerOpen(true);
	};

	const onCustomerSelect = (customer: ICustomerResponse) => {
		setSelectedCustomer(customer);
		setValue("customerId", customer?.customer?.id);
		let address =
			customer?.address?.find((address) => address.isDefault) ||
			customer?.address?.[0];
		setSelectedAddress({ shipping: address, billing: address });
	};

	const onAddressChange = (address: IAddressesPayload) => {
		setSelectedAddress({
			...selectedAddress,
			[editAddressType.current]: address,
		});
		handleCustomerDrawerClose();
	};

	const onSubmitting = (requestData: any) => {
		if (!requestData?.customerId) {
			ToastService.error("Please select a customer");
			return;
		}
		setSaving(true);
		requestData.orderDate = new Date().toISOString().split("T")[0];
		requestData.directDiscountAmount = requestData.directDiscountAmount || 0;
		requestData.shippingAddress = selectedAddress?.shipping;
		requestData.billingAddress = selectedAddress?.billing;
		requestData.customerPhone = selectedCustomer?.customer?.phoneNumber;
		requestData.customerFirstName = selectedCustomer?.customer?.firstName;
		requestData.customerLastName = selectedCustomer?.customer?.lastName;
		requestData.customerName = selectedCustomer?.customer?.firstName?.concat(
			" ",
			selectedCustomer?.customer?.lastName
		);
		requestData.customerEmail = selectedCustomer?.customer?.email;
		OrderService.create(requestData)
			.then((resp) => {
				ToastService.success(resp.message);
				navigate(ORDER);
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setSaving(false));
	};

	if (loading) return <Preloader absolutePosition />;

	return (
		<WxMainLg>
			<FormHeader noMargin title="Create Order" backNavigationLink={ORDER} />
			<form onSubmit={handleSubmit(onSubmitting)}>
				<div className="row ">
					<div className="col-md-8 col-sm-12 mt-3">
						<div className="card p-3 mb-3">
							<h5 className="mb-3">Product</h5>
							<div className="d-flex">
								<div className="input-group search">
									<TextInput
										type="search"
										placeholder="Search products"
										startIcon={<Icon icon="search" />}
										onFocus={openDrawer}
									/>
								</div>
							</div>
							<ProductCart
								selectedProduct={selectedProduct}
								removeFromCart={removeFromCart}
								updateQuantity={updateQuantity}
							/>
						</div>
						<PaymentInfo
							selectedProduct={selectedProduct}
							watch={watch}
							getValues={getValues}
							setValue={setValue}
						/>
						<div className="card p-3 mt-3">
							<div className="col-md-12 col-sm-12">
								<TextInput
									label="Order note"
									noMargin
									registerProperty={{ ...register("orderNote") }}
								/>
							</div>
							<WxHr />
							<Checkbox
								id="sendEmail"
								label="Send email to customer"
								registerProperty={{ ...register("notifyWithEmail") }}
							/>
							{/* <WxHr />
							<div>
								<Button variant="outline" color="primary">
									Preview Invoice
								</Button>
							</div> */}
						</div>
					</div>
					<div className="col-md-4 col-sm-12 mt-3">
						<div className="card wx__form_right p-3 mb-3">
							<Button
								type="submit"
								variant="fill"
								className="hide-mobile-view"
								disabled={saving || !activePlan?.hasManualOrder}
							>
								{saving ? <Preloader /> : "Create Order"}
							</Button>
							{!activePlan?.hasManualOrder && (
								<WxAlert className="mt-3" noMargin>
									Please upgrade your{" "}
									<Link to={SETTINGS_PRICING_PLAN}>plan</Link> to create a
									manual order.
								</WxAlert>
							)}
							<WxHr className="" />
							<div className="w-100">
								<Select
									label="Set order status"
									key={getValues("orderStatus")}
									valuesKey="metaKey"
									textKey="title"
									options={orderStatus}
									registerProperty={{ ...register("orderStatus") }}
								/>
								<Select
									label="Set payment status"
									noMargin
									key={getValues("paymentStatus")}
									valuesKey="metaKey"
									textKey="title"
									options={paymentStatus}
									registerProperty={{ ...register("paymentStatus") }}
								/>
							</div>
						</div>
						<CustomerInfo
							customerId={customerId}
							onCustomerSelect={onCustomerSelect}
							selectedCustomer={selectedCustomer}
							handleAddressEdit={handleAddressEdit}
							selectedAddress={selectedAddress}
						/>
						<div className="card mt-3 p-3 show-mobile-view">
							<Button
								type="submit"
								variant="fill"
								className="w-100"
								disabled={saving || !activePlan?.hasManualOrder}
							>
								{saving ? <Preloader /> : "Create Order"}
							</Button>
						</div>
					</div>
				</div>
			</form>
			<BrowseProduct
				drawerOpen={drawerOpen}
				handleClose={handleClose}
				addToCart={addToCart}
			/>
			<OrderAddress
				drawerOpen={addressDrawerOpen}
				handleClose={handleCustomerDrawerClose}
				customerId={selectedCustomer?.customer?.id}
				selectedAddress={selectedAddress?.[editAddressType.current]}
				onAddressChange={onAddressChange}
			/>
		</WxMainLg>
	);
};

export default CreateOrder;
