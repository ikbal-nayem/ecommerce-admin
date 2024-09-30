import { ConfirmationModal } from "@components/ConfirmationModal/ConfirmationModal";
import GenerateReactPDF from "@components/Invoice/GenerateReactPDF";
import Invoice from "@components/Invoice/Invoice";
import WxMainLg from "@components/MainContentLayout/WxMainLg";
import WxNotFound from "@components/NotFound/WxNotFound";
import WxButton from "@components/WxButton";
import WxDropdown from "@components/WxDropdown/WxDropdown";
import { WxFormHeader } from "@components/WxFormLayout";
import WxIcon from "@components/WxIcon/WxIcon";
import WxLabel from "@components/WxLabel";
import WxTag from "@components/WxTag";
import WxThumbnail from "@components/WxThumbnail/WxThumbnail";
import { MASTER_META_KEY, STATUS_CONSTANT } from "config/constants";
import { IStatus } from "@interfaces/common.interface";
import {
	IAddressesPayload,
	ICustomerResponse,
} from "@interfaces/Customer.interface";
import { IOrderDetails, IOrderTimeline } from "@interfaces/order.interface";
import { IDeliveryZoneItem } from "@interfaces/Settings.interface";
import { pdf } from "@react-pdf/renderer";
import {
	ORDER,
	ORDER_DELIVER,
	ORDER_EDIT,
	ORDER_REFUND,
	ORDER_RETURN,
} from "routes/path-name.route";
import { StatusService } from "services/api/admin/Status.service";
import { ECourierService } from "services/api/courier/ECourier.service";
import { RedXService } from "services/api/courier/RedX.sevice";
import { OrderService } from "services/api/Order.service";
import { CourierService } from "services/api/settings/Courier.service";
import { DeliverySettingService } from "services/api/settings/Delivery.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { saveAs } from "file-saver";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setOrderDetails } from "store/reducers/ordersReducer";
import { dispatch } from "store/store";
import { statusColorMapping } from "utils/colorMap";
import { imageURLGenerate } from "utils/utils";
import selfDeliveryImg from "../../../assets/images/self-collect.png";
import CustomerInfo from "../components/customer-info/CustomerInfo";
import Discount from "../components/discount/Discount";
import { generatePDF } from "../components/InvoiceUtil";
import OrderAddress from "../components/order-address/OrderAddress";
import ProductCart from "../components/product-cart/ProductCart";
import ShippingModal from "../components/shipping/Shipping";
import { EditNotes } from "./components/EditNotes";
import MarkAsPaid from "./components/MarkAsPaid";
import OrderPlacedInfo from "./components/OrderPlacedInfo";
import OrderTimeline from "./components/OrderTimeline";
import OrderTrack from "./components/OrderTrack";
import PaymentDetailsInfo from "./components/PaymentDetails";
import "./OrderDetails.scss";

const OrderDetails = () => {
	const [addressDrawerOpen, setAddressDrawerOpen] = useState<boolean>(false);
	const [isMoreOpen, setIsMoreOpen] = useState<boolean>(false);
	const [deliveryStatusDrop, setDeliveryStatusDrop] = useState<boolean>(false);
	const [isUnableToEdit, setIsUnableToEdit] = useState<boolean>(false);
	const [isDiscountOpen, setIsDiscountOpen] = useState<boolean>(false);
	const [isShippingOpen, setIsShippingOpen] = useState<boolean>(false);
	const [zoneList, setZoneList] = useState<IDeliveryZoneItem[]>([]);
	const [selectedZone, setSelectedZone] = useState<IDeliveryZoneItem>();
	const [isUpdating, setIsUpdating] = useState<boolean>(false);
	const [status, setStatus] = useState<IStatus[]>();
	const [orderDetails, setOrdersData] = useState<IOrderDetails>();
	const [orderTimeline, setTimeline] = useState<IOrderTimeline[]>();
	const [selectedCustomer, setSelectedCustomer] = useState<ICustomerResponse>();
	const [selectedAddress, setSelectedAddress] = useState<any>();
	const [menu, setMenu] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [trackCode, setTrackCode] = useState<string>("");
	const [orderTrackStatus, setOrderTrackStatus] = useState<any[]>([]);
	const { order_id } = useParams();
	const [configuredCourierList, setConfiguredCourierList] = useState<any[]>([]);
	const [loader, setLoader] = useState<boolean>(false);
	const [isPaymentFormOpen, setPaymentFormOpen] = useState<boolean>(false);
	const editAddressType = useRef(null);
	const paymentApproveData = useRef<IOrderTimeline | null>(null);

	const navigate = useNavigate();
	const [invoiceData, setInvoiceData] = useState<any>({});

	// const {
	// 	user_data: { store_id },
	// } = useSelector((state: any) => state?.user);

	useEffect(() => {
		const orderDetailsReq = OrderService.getDetails({ body: { id: order_id } });
		const orderStatusReq = StatusService.getOrderStatus();
		const paymentStatusReq = StatusService.getPaymentStatus();
		const deliveryZoneReq = DeliverySettingService.getList();
		Promise.all([
			orderDetailsReq,
			orderStatusReq,
			paymentStatusReq,
			deliveryZoneReq,
		])
			.then(([order, orderStatus, paymentStatus, deliveryZoneReq]) => {
				setOrdersData(order.body);
				dispatch(setOrderDetails({ orderDetails: order.body }));
				setSelectedAddress({
					billing: order.body?.billingAddress,
					shipping: order.body?.shippingAddress,
				});
				setSelectedCustomer({
					customer: {
						name: order.body?.customerName,
						phoneNumber: order.body?.customerPhone,
					},
				});
				setStatus([...orderStatus.body, ...paymentStatus.body]);
				setZoneList(deliveryZoneReq.body);
				deliveryZoneReq.body.length &&
					setSelectedZone(
						deliveryZoneReq.body?.find(
							({ id }) => id === order.body?.deliveryZoneId
						) || deliveryZoneReq.body?.[0]
					);
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setLoading(false));
		return () => setMenu(false);
	}, []);

	useEffect(() => {
		getTimeline();
	}, [orderDetails]);

	useEffect(() => {
		if (orderDetails?.deliveredBy === "COURIER_TYPE_ECOURIER") {
			// COURIER_TYPE_ECOURIER
			getECourierOrderPlaceInfo(order_id);
		} else if (orderDetails?.deliveredBy === "COURIER_TYPE_REDX") {
			getRedXOrderPlaceInfo(order_id);
		}
	}, [order_id, orderDetails?.deliveredBy]);

	useEffect(() => {
		if (trackCode) {
			if (orderDetails?.deliveredBy === "COURIER_TYPE_ECOURIER") {
				getECourierOrderTrack(trackCode);
			} else if (orderDetails?.deliveredBy === "COURIER_TYPE_REDX") {
				getRedXOrderTrack(trackCode);
			}
		}
	}, [trackCode]);

	useEffect(() => {
		CourierService.getConfigured()
			.then((res) => setConfiguredCourierList(res.body))
			.catch((err) => ToastService.error(err.message));
	}, []);

	const getTimeline = () =>
		OrderService.getTimeline(order_id).then(({ body }) => setTimeline(body));

	const getECourierOrderPlaceInfo = (id: string) => {
		ECourierService.eCourierGetOrderPlaceInfo(id)
			.then((res) => res?.body[0]?.ecr && setTrackCode(res.body[0].ecr))
			.catch((err) => ToastService.error(err.message));
	};

	const getRedXOrderPlaceInfo = (id: string) => {
		RedXService.redXPlaceOrderInfo(id)
			.then(
				(res) =>
					res?.body[0]?.trackingId && setTrackCode(res.body[0].trackingId)
			)
			.catch((err) => ToastService.error(err));
	};

	const getECourierOrderTrack = (code: string) => {
		ECourierService.eCourierOrderTrack(code)
			.then((res) => {
				res?.body?.query_data?.status &&
					setOrderTrackStatus(res?.body?.query_data?.status);
			})
			.catch((err) => ToastService.error(err.message));
	};

	const getRedXOrderTrack = (id: string) => {
		RedXService.tackOrder(id)
			.then((res) => {
				const modifiedRes = res?.body?.tracking?.map((item) => {
					item.status = item.message_en;
					delete item.message_en;
					return item;
				});
				setOrderTrackStatus(modifiedRes);
			})
			.catch((err) => ToastService.error(err));
	};

	const handleAddressEdit = (type: string) => {
		editAddressType.current = type;
		setAddressDrawerOpen(true);
	};

	const handleCustomerDrawerClose = () => {
		editAddressType.current = null;
		setAddressDrawerOpen(false);
	};
	const handleDiscountClose = () => setIsDiscountOpen(false);

	const onOrderNoteUpdate = (note) => {
		setOrdersData({ ...orderDetails, orderNote: note });
	};

	const onAddressChange = (newAddress: IAddressesPayload) => {
		setIsUpdating(true);
		OrderService.updateOrderAddress(orderDetails?.id, {
			flag: editAddressType.current,
			address: newAddress,
		})
			.then((res) => {
				ToastService.success(res.message);
				setSelectedAddress({
					...selectedAddress,
					[editAddressType.current]: newAddress,
				});
				handleCustomerDrawerClose();
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsUpdating(false));
	};

	const onDiscount = (discount: number) => {
		setIsUpdating(true);
		OrderService.updateOrderDiscount(orderDetails?.id, {
			directDiscountAmount: discount,
		})
			.then((resp) => {
				setOrdersData({
					...orderDetails,
					directDiscountAmount: resp.body?.directDiscountAmount,
					totalPayableAmount:
						orderDetails?.orderSubTotal -
						resp.body?.directDiscountAmount +
						(orderDetails?.deliveryChargeAmount || 0),
				});
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsUpdating(false));
	};

	const onShipping = (shipping: IDeliveryZoneItem) => {
		setIsUpdating(true);
		OrderService.updateDeliveryCharge(orderDetails?.id, {
			deliveryChargeId: shipping?.id,
			deliveryChargeAmount: shipping?.deliveryChargeAmount,
			deliveryZoneName: shipping?.name,
		})
			.then((resp) => {
				setOrdersData({
					...orderDetails,
					deliveryChargeAmount: resp.body?.deliveryChargeAmount,
					deliveryZoneName: shipping?.name,
					totalPayableAmount:
						orderDetails?.orderSubTotal -
						(orderDetails?.directDiscountAmount || 0) +
						(resp.body?.deliveryChargeAmount || 0),
				});
				setSelectedZone(shipping);
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsUpdating(false));
	};

	const handlePaymentStatus = useCallback(
		(invoice) => {
			const statusObj = status.find(
				(status) => status.metaKey === invoice?.paymentStatusKey
			);
			setOrdersData((prev) => ({
				...prev,
				invoice,
				paymentStatus: statusObj?.title,
			}));
		},
		[status]
	);

	const handlePaymentClose = () => {
		setPaymentFormOpen(false);
		paymentApproveData.current = null;
	};

	const handleOrderStatus = (typeKey: string) => {
		setIsUpdating(true);
		const statusObj = status.find((status) => status.metaKey === typeKey);
		const requestObj = {
			orderDeliveryStatusName: statusObj?.title,
			orderDeliveryStatusKey: typeKey,
			deliveredBy: "self",
		};
		OrderService.updateOrderStatus(orderDetails?.id, requestObj)
			.then((res) => {
				ToastService.success(res.message);
				setOrdersData((prev) => ({
					...prev,
					orderStatus: res.body?.orderDeliveryStatusName,
				}));
				setDeliveryStatusDrop(false);
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsUpdating(false));
	};

	const onApprovePayment = (data: IOrderTimeline) => {
		paymentApproveData.current = data;
		setPaymentFormOpen(true);
	};

	const onRejectPayment = useCallback(() => {
		getTimeline();
	}, []);

	const invoicePrint = async (orderID) => {
		// setLoader(true);
		// generatePDF(
		// 	store_id,
		// 	orderID,
		// 	async (data) => {
		// 		setInvoiceData(data?.invoiceData);
		// 		const dd = {
		// 			invoiceData: data?.invoiceData,
		// 			invoiceItemData: data?.invoiceItemData,
		// 		};
		// 		try {
		// 			const blob = await pdf(<GenerateReactPDF data={dd} />).toBlob();
		// 			saveAs(blob, `${dd.invoiceData?.invoice?.customerName}.pdf`);
		// 		} catch {
		// 			ToastService.error("Failed to generate Invoice PDF!");
		// 		} finally {
		// 			setLoader(false);
		// 		}
		// 	},
		// 	// handling error if API request failed
		// 	() => setLoader(false)
		// );
	};

	const orderStatusFind = (statusValue: string, metaKey: string) => {
		if (statusValue === status?.find((val) => val.metaKey === metaKey)?.title) {
			return true;
		}
		return false;
	};

	if (loading) return <Preloader absolutePosition />;

	if (!orderDetails)
		return (
			<WxNotFound
				title="Something went wrong!"
				description="Please try again later."
				btn_text="Go Back"
				btn_link={ORDER}
			/>
		);

	return (
		<WxMainLg>
			<WxFormHeader
				title={`${orderDetails?.orderNo}`}
				backNavigationLink={ORDER}
				rightContent={
					orderDetails?.orderStatus !== STATUS_CONSTANT.cancel ? (
						<ul className="wx__order_details_header">
							{orderDetails?.orderStatus === STATUS_CONSTANT.delivered &&
							orderDetails?.paymentStatus === STATUS_CONSTANT.paid ? (
								<li>
									<WxButton
										color="secondary"
										onClick={() => navigate(ORDER_REFUND({ order_id }))}
									>
										Refund
									</WxButton>
								</li>
							) : null}
							{orderDetails?.orderStatus === STATUS_CONSTANT.delivered &&
							orderDetails?.paymentStatus !== STATUS_CONSTANT.paid ? (
								<li>
									<WxButton
										color="secondary"
										onClick={() => navigate(ORDER_RETURN({ order_id }))}
									>
										Return
									</WxButton>
								</li>
							) : null}
							<li>
								<WxButton
									color="secondary"
									onClick={() =>
										orderDetails?.orderStatus === STATUS_CONSTANT.delivered ||
										orderDetails?.paymentStatus === STATUS_CONSTANT.paid
											? setIsUnableToEdit(true)
											: navigate(ORDER_EDIT({ order_id }))
									}
								>
									Edit
								</WxButton>
							</li>
							<li>
								<WxButton color="secondary" onClick={() => setIsMoreOpen(true)}>
									More <WxIcon icon="arrow_drop_down" />
								</WxButton>
								<WxDropdown isOpen={isMoreOpen} setIsOpen={setIsMoreOpen}>
									<ul>
										<li
											className="wx__text_subtitle"
											onClick={() => invoicePrint(order_id)}
										>
											<a className="wx__text_body">
												<WxIcon icon="print" /> Print invoice
											</a>
										</li>
										{orderStatusFind(
											orderDetails?.orderStatus,
											MASTER_META_KEY.ORDER_STATUS_TYPE_PENDING
										) &&
										orderDetails?.paymentStatus !== STATUS_CONSTANT.paid ? (
											<li
												className="wx__text_subtitle"
												onClick={() =>
													handleOrderStatus(
														MASTER_META_KEY.ORDER_STATUS_TYPE_CANCEL
													)
												}
											>
												<a className="wx__text_body wx__text-danger">
													<WxIcon icon="close" /> Cancel Order
												</a>
											</li>
										) : null}
									</ul>
								</WxDropdown>
							</li>
						</ul>
					) : null
				}
			/>

			{loader && <Preloader />}

			<div className="wx__row">
				<div className="wx__col-md-8">
					<div className="wx__card">
						<div className="wx__d-flex wx__align-items-center wx__p-3">
							<h6 className="wx__text_h6 wx__text_semibold wx__m-0">Product</h6>
							<div className="wx__ms-3">
								<WxTag
									label={orderDetails?.orderStatus}
									color={statusColorMapping(orderDetails?.orderStatus)}
								/>
							</div>
							{orderStatusFind(
								orderDetails?.orderStatus,
								MASTER_META_KEY.ORDER_STATUS_TYPE_DELIVERED
							) ? (
								<div className="wx__ms-auto">
									<WxIcon
										variants="round"
										role="button"
										icon="more_vert"
										onClick={() => setDeliveryStatusDrop(!deliveryStatusDrop)}
									/>
									<WxDropdown
										isOpen={deliveryStatusDrop}
										setIsOpen={setDeliveryStatusDrop}
									>
										<ul>
											<li
												onClick={() => invoicePrint(order_id)}
												className="wx__text_subtitle"
											>
												<a className="wx__text_body">
													<WxIcon icon="print" /> Print invoice
												</a>
											</li>
											{orderDetails?.orderStatus ===
											status?.find(
												(val) =>
													val.metaKey ===
													MASTER_META_KEY.ORDER_STATUS_TYPE_DELIVERED
											)?.title ? (
												<li
													className="wx__text_subtitle"
													onClick={() => {
														handleOrderStatus(
															MASTER_META_KEY.ORDER_STATUS_TYPE_PENDING
														);
														setTrackCode("");
														setOrderTrackStatus([]);
													}}
												>
													<a className="wx__text_body wx__text-danger">
														<WxIcon icon="close" /> Cancel Delivered
													</a>
												</li>
											) : null}
										</ul>
									</WxDropdown>
								</div>
							) : null}
						</div>
						<ProductCart
							selectedProduct={orderDetails?.orderLineList}
							isEditable={false}
						/>
						{/* TODO:: thid decission from Nayeem biswas specially return policy */}
						{orderStatusFind(
							orderDetails?.orderStatus,
							MASTER_META_KEY.ORDER_STATUS_TYPE_DELIVERED
						) ||
						orderDetails?.orderStatus === STATUS_CONSTANT.cancel ||
						orderDetails.orderStatus === STATUS_CONSTANT.return ? null : (
							<div className="wx__p-3 wx__ms-auto">
								<WxButton
									onClick={() => setMenu(!menu)}
									color="primary"
									variant="fill"
								>
									Mark as Delivered
									<WxIcon icon="expand_more" className="ms_2" />
								</WxButton>
								<WxDropdown
									id="triggerPlace"
									isOpen={menu}
									setIsOpen={setMenu}
									drop={true}
									backdrop={true}
								>
									<div className="wx__d-flex wx__delivery-dropdown">
										<div className="dropdown_wrapper">
											<ul className="wx__w-100">
												<li
													onClick={() =>
														handleOrderStatus(
															MASTER_META_KEY.ORDER_STATUS_TYPE_DELIVERED
														)
													}
													className="wx__d-flex"
												>
													<WxThumbnail
														className="wx__bg-white"
														src={selfDeliveryImg}
													/>
													<span className="wx__text_body">Self Delivery</span>
												</li>
												{configuredCourierList.map((item) => {
													if (item?.isActive)
														return (
															<li
																onClick={() =>
																	order_id && item?.courierProvider
																		? navigate(
																				ORDER_DELIVER({
																					order_id: order_id,
																					courier_service:
																						item?.courierProvider,
																				})
																		  )
																		: null
																}
																className="wx__d-flex wx__my-1"
																key={item?.id}
															>
																<WxThumbnail
																	className="wx__bg-white"
																	src={imageURLGenerate(item?.banner)}
																/>
																<span className="wx__text_body">
																	{item?.title || "No name"}
																</span>
															</li>
														);
												})}
											</ul>
										</div>
									</div>
								</WxDropdown>
							</div>
						)}
					</div>
					<div className="wx__card wx__order_payment wx__mt-3 wx__p-3">
						{isUpdating ? <Preloader absolutePosition /> : null}
						<PaymentDetailsInfo
							orderDetails={orderDetails}
							setIsDiscountOpen={setIsDiscountOpen}
							setIsShippingOpen={setIsShippingOpen}
						/>
						<div className="wx__d-flex wx__ms-auto wx__gap-3">
							{orderDetails?.orderStatus !== STATUS_CONSTANT.cancel ? (
								<WxButton color="secondary">Send Invoice</WxButton>
							) : null}
							{orderDetails?.paymentStatus === STATUS_CONSTANT.paid ||
							orderDetails?.orderStatus === STATUS_CONSTANT.cancel ||
							orderTimeline?.some((v) => v.canAppove) ? null : (
								<WxButton
									variant="fill"
									onClick={() => setPaymentFormOpen(true)}
								>
									Mark As Paid
								</WxButton>
							)}
						</div>
					</div>
					<OrderTimeline
						orderTimeline={orderTimeline}
						onApprove={onApprovePayment}
						onReject={onRejectPayment}
					/>
					{orderStatusFind(
						orderDetails?.orderStatus,
						MASTER_META_KEY.ORDER_STATUS_TYPE_DELIVERED
					) &&
					orderTrackStatus.length &&
					trackCode ? (
						<OrderTrack orderTrack={orderTrackStatus} />
					) : null}
				</div>
				<div className="wx__col-md-4">
					<OrderPlacedInfo orderDetails={orderDetails} />
					<div className="wx__card wx__mt-3 wx__p-3">
						<WxLabel
							labelRight={
								<EditNotes
									orderId={orderDetails?.id}
									defaultNote={orderDetails?.orderNote}
									onOrderNoteUpdate={onOrderNoteUpdate}
								/>
							}
						>
							Notes
						</WxLabel>
						<span className="wx__text_body wx__text_regular">
							{orderDetails?.orderNote || "No notes from customer"}
						</span>
					</div>
					<CustomerInfo
						selectedCustomer={selectedCustomer}
						handleAddressEdit={handleAddressEdit}
						selectedAddress={selectedAddress}
					/>
				</div>
			</div>
			<Discount
				isDiscountOpen={isDiscountOpen}
				subTotal={orderDetails?.orderSubTotal}
				handleDiscountClose={handleDiscountClose}
				onDiscount={onDiscount}
			/>
			<ShippingModal
				isShippingOpen={isShippingOpen}
				handleShippingClose={() => setIsShippingOpen(false)}
				onShipping={onShipping}
				zoneList={zoneList}
				selectedZone={selectedZone}
			/>
			<OrderAddress
				drawerOpen={addressDrawerOpen}
				handleClose={handleCustomerDrawerClose}
				customerId={selectedCustomer?.customer?.id}
				selectedAddress={selectedAddress?.[editAddressType.current]}
				onAddressChange={onAddressChange}
				isUpdating={isUpdating}
			/>
			<ConfirmationModal
				isOpen={isUnableToEdit}
				onClose={() => setIsUnableToEdit(false)}
				title="Unable to edit the order"
				body="Orders can’t be edited."
			/>
			<Invoice invoiceData={invoiceData} />
			<MarkAsPaid
				invoiceId={orderDetails?.invoice?.id}
				onPayment={handlePaymentStatus}
				isModalOpen={isPaymentFormOpen}
				handleClose={handlePaymentClose}
				approveData={paymentApproveData.current}
			/>
		</WxMainLg>
	);
};

export default OrderDetails;
