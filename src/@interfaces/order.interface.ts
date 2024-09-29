import { IProductOption } from "./product.interface";

export interface IOrderList {
  couponAmount: number;
  customerName: string;
  directDiscountAmount: number;
  orderDate: string;
  orderId: string;
  orderNo: string;
  orderStatus: string;
  paymentStatus: string;
  saleChannel: string;
  totalPayableAmount: number;
}

export interface IOrderItems {
  productVariantCombinationId: string;
  sellingPrice: number;
  quantity: number;
  productId: string;
  productLotId: string;
  variant: IProductOption[];
  id: string;
  subTotal: number;
  profit: number;
  productName: string;
  status: string;
}

export interface IOrderDetails {
	id: string;
	invoice: { [key: string]: string };
	storeId: string;
	deliveryChargeId: string;
	orderDate: string;
	orderStatus: string;
	paymentGatewayDTO: {
		id: string;
		isSandbox: boolean;
		title: string;
	};
	paymentStatus: string;
	orderNote: string;
	orderNo: number | string;
	couponId: number | string;
	couponAmount: number;
	deliveryChargeAmount: number;
	deliveryZoneId: string;
	deliveryZoneName: string;
	deliveredBy: string;
	directDiscountAmount: number;
	directDiscountType: number | string;
	directDiscountReason: string;
	totalPayableAmount: number;
	totalBill: number | string;
	taxAmount: number | string;
	customerName: number | string;
	customerFirstName: number | string;
	customerLastName: number | string;
	customerId: string;
	customerEmail: string;
	saleChannel: string;
	orderSubTotal: number;
	shippingAddressId: number | string;
	shippingFirstName: number | string;
	shippingLastName: number | string;
	shippingCityName: number | string;
	shippingPhone: string;
	shipingPostCode: string;
	shippingState: number | string;
	shippingAddressLine1: string;
	shippingAddressLine2: string;
	shippingFullAddress: number | string;
	shippingCountry: string;
	phoneNumber: string;
	billingAddressId: number | string;
	billingFirstName: number | string;
	billingLastName: number | string;
	billingCityName: number | string;
	billingPhone: string;
	billingPostCode: string;
	billingState: number | string;
	billingAddressLine1: string;
	billingAddressLine2: string;
	billingFullAddress: number | string;
	billingCountry: string;
	items?: number | string;
	orderLineList: IOrderItems[];
}

export interface IOrderSettingsItem {
  dayCount?: number;
  description: string;
  id: string;
  isChecked: boolean;
  isDefault: boolean;
  isEditable: boolean;
  metaKey: string;
  metaType: string;
  serial: number;
  title: string;
}

export interface IOrderSettingsResponse {
  id: string;
  storeId: string;
  isAcceptOrder: boolean;
  orderStatusList: IOrderSettingsItem[];
  paymentStatusList: IOrderSettingsItem[];
}

export interface IOrderTimeline {
	id: string;
	description: string;
	time: number;
	bankTranId: string;
	canAppove: boolean;
	cardIssuer: string;
	currency: string;
	customerId: string;
	file: string;
	gatewayAmount: string;
	gatewayCurrency: string;
	invoiceId: string;
	isOnlinePayment: string;
	orderId: string;
	paidAccountNumber: string;
	payAmount: string;
	payGateway: string;
	pgTxnid: string;
	status: string;
	storeId: string;
	tranDate: string;
	tranId: string;
}
