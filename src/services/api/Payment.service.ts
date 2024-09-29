import { PAYMENT_SERVICE, SETTING_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";
import { IPaymentConfigured } from "@interfaces/common.interface";
import { mergePayloadWithStoreId } from "services/utils/localStorageData.service";

export const PaymentService = {
	getSupported: async (): Promise<any> =>
		await apiIns.get(PAYMENT_SERVICE + "payment-gateways/get-supported"),

	getConfigured: async (): Promise<any> =>
		await apiIns.get(PAYMENT_SERVICE + "payment-gateways/get-configured"),

	create: async (payload: IPaymentConfigured): Promise<any> =>
		await apiIns.post(
			PAYMENT_SERVICE + "payment-gateways/create",
			mergePayloadWithStoreId(payload)
		),

	update: async (payload: IPaymentConfigured): Promise<any> =>
		await apiIns.put(PAYMENT_SERVICE + "payment-gateways/update", payload),

	offlineCreate: async (payload: IPaymentConfigured): Promise<any> =>
		await apiIns.post(
			PAYMENT_SERVICE + "offline-controller/create",
			mergePayloadWithStoreId(payload)
		),

	offlineUpdate: async (payload: IPaymentConfigured): Promise<any> =>
		await apiIns.put(PAYMENT_SERVICE + "offline-controller/update", payload),

	getWebXGateways: async (): Promise<any> =>
		await apiIns.get(
			PAYMENT_SERVICE + "payment-gateways/public/get-webx-gateways"
		),

	paymentGetwayIcons: async (): Promise<any> =>
		await apiIns.get(PAYMENT_SERVICE + "payment-gateways/get-icons"),

	merchantPurchasePlan: async (payload): Promise<any> =>
		await apiIns.post(
			SETTING_SERVICE + "merchant-purchases/buy-plan",
			mergePayloadWithStoreId(payload)
		),

	merchantPurchaseStartTrial: async (): Promise<any> =>
		await apiIns.post(SETTING_SERVICE + "merchant-purchases/start-trial"),

	payFree: async (id: string): Promise<any> =>
		await apiIns.put(PAYMENT_SERVICE + "public/payNow/pay-free/" + id),
};
