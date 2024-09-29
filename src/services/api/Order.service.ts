import { ORDER_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";
import {
  mergeBodyWithStoreId,
  mergePayloadWithStoreId,
} from "services/utils/localStorageData.service";

export const OrderService = {
	get: async (payload): Promise<any> =>
		await apiIns.post(
			ORDER_SERVICE + "order/get-list",
			mergeBodyWithStoreId(payload)
		),

	getDetails: async (payload): Promise<any> =>
		await apiIns.post(
			ORDER_SERVICE + "order/get-order-details",
			mergeBodyWithStoreId(payload)
		),

	getTimeline: async (orderId: string): Promise<any> =>
		await apiIns.get(
			ORDER_SERVICE + "order-time-line/get-by-order-id-with-payments/" + orderId
		),

	create: async (payload: any): Promise<any> =>
		await apiIns.post(
			ORDER_SERVICE + "order/create",
			mergePayloadWithStoreId(payload)
		),

	update: async (payload: any): Promise<any> =>
		await apiIns.put(ORDER_SERVICE + "order/update", payload),

	updateOrderNote: async (orderId: string, payload: any): Promise<any> =>
		await apiIns.put(
			ORDER_SERVICE + "order/update-order-note-by-orderId/" + orderId,
			payload
		),

	updateOrderAddress: async (orderId: string, payload: any): Promise<any> =>
		await apiIns.put(
			ORDER_SERVICE + "order/update-order-address-by-orderId/" + orderId,
			payload
		),

	updateOrderStatus: async (orderId: string, payload: any): Promise<any> =>
		await apiIns.put(
			ORDER_SERVICE + "order/update-order-status-by-orderId/" + orderId,
			payload
		),

	updateOrderDiscount: async (orderId: string, payload: any): Promise<any> =>
		await apiIns.put(
			ORDER_SERVICE + "order/update-order-discount-by-orderId/" + orderId,
			payload
		),

	updateDeliveryCharge: async (orderId: string, payload: any): Promise<any> =>
		await apiIns.put(
			ORDER_SERVICE +
				"order/update-order-delivery-charge-by-orderId/" +
				orderId,
			payload
		),

	// updatePaymentStatus: async (orderId: string, payload: any): Promise<any> =>
	// 	apiIns.put(
	// 		ORDER_SERVICE + "order/update-order-payment-by-orderId/" + orderId,
	// 		payload
	// 	),

	delete: async (ids: string[]): Promise<any> =>
		await apiIns.put(ORDER_SERVICE + "order/delete-all", ids),

	getCustomerLastOrder: async (payload): Promise<any> =>
		await apiIns.post(
			ORDER_SERVICE + "order/get-latest-by-customer-order",
			mergeBodyWithStoreId(payload)
		),

	getCustomerStatistics: async (payload): Promise<any> =>
		await apiIns.post(
			ORDER_SERVICE + "order/get-order-statistic-by-customer",
			mergeBodyWithStoreId(payload)
		),

	refundStore: async (payload): Promise<any> =>
		await apiIns.put(
			ORDER_SERVICE + "order/refund",
			mergePayloadWithStoreId(payload)
		),

	returnStore: async (payload): Promise<any> =>
		await apiIns.put(
			ORDER_SERVICE + "order/return",
			mergePayloadWithStoreId(payload)
		),

	createInvoicePayment: async (payload): Promise<any> =>
		await apiIns.post(
			ORDER_SERVICE + "invoice-payments/create",
			mergePayloadWithStoreId(payload)
		),

	changePaymentStatus: async (payload): Promise<any> =>
		await apiIns.put(ORDER_SERVICE + "invoice-payments/change-status", payload),
};
