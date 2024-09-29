import { ORDER_SERVICE, SETTING_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";
import { ENV } from "config/ENV.config";

interface IGetInvoiceDtls {
	body: {
		id: string;
		storeId: string;
	};
}

export const InvoiceService = {
	getOrderInvoice: async (payload: IGetInvoiceDtls): Promise<any> =>
		await apiIns.post(ORDER_SERVICE + "order/get-invoice-details", payload),

	getStoreDetails: async (): Promise<any> =>
		await apiIns.get(SETTING_SERVICE + "store/get-my-store-details"),

	getInvoiceInfo: async (invoiceId: string): Promise<any> =>
		await apiIns.get(
			SETTING_SERVICE + "merchant-purchase-invoice/get-by-id/" + invoiceId
		),

	merchantPurchaseInvoice: async (payload: {
		invoiceId: string;
		address: any;
	}): Promise<any> =>
		await apiIns.put(
			SETTING_SERVICE + "merchant-purchase-invoice/update-billing-address",
			payload
		),

	downloadInvoice: (invoiceId: string) =>
		window.open(
			ENV.ApiEndpoint +
				SETTING_SERVICE +
				"billing/public/download-invoice/" +
				invoiceId,
			"_self"
		),
};
