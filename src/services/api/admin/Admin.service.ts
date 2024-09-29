import { ADMIN_SERVICE, SETTING_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";
import {
  mergeBodyWithStoreId,
  mergePayloadWithStoreId,
} from "services/utils/localStorageData.service";

export const AdminService = {
	getVariantAdjustReason: async (): Promise<any> =>
		await apiIns.get(
			ADMIN_SERVICE + "master-meta/get-by-meta-type/QUANTITY_ADJUSTMENT_TYPE"
		),

	getByMetaType: async (metaType: string): Promise<any> =>
		await apiIns.get(
			ADMIN_SERVICE + "master-meta/get-by-meta-type/" + metaType
		),

	getByMetaKey: async (metaKey: string): Promise<any> =>
		await apiIns.get(ADMIN_SERVICE + "master-meta/get-by-meta-key/" + metaKey),

	getAllMetaData: async (): Promise<any> =>
		await apiIns.get(ADMIN_SERVICE + "master-meta/get-all"),

	getPricingPlane: async (): Promise<any> =>
		await apiIns.get(ADMIN_SERVICE + "pricing-plan-billing/get-active-plans"),

	getMerchantRoleList: async (payload): Promise<any> =>
		await apiIns.post(ADMIN_SERVICE + "roles/merchant/get-list", payload),

	getRoleById: async (payload): Promise<any> =>
		await apiIns.post(
			ADMIN_SERVICE + "roles/get-by-id",
			mergePayloadWithStoreId(payload)
		),

	createRoleByMerchant: async (payload): Promise<any> =>
		await apiIns.post(ADMIN_SERVICE + "roles/merchant/create", payload),

	updateRoleByMerchant: async (payload): Promise<any> =>
		await apiIns.put(ADMIN_SERVICE + "roles/merchant/update", payload),

	deleteRoleByMerchant: async (payload: any): Promise<any> =>
		await apiIns.put(
			ADMIN_SERVICE + "roles/merchant/delete",
			mergePayloadWithStoreId(payload)
		),

	getRates: async (): Promise<any> =>
		await apiIns.get(ADMIN_SERVICE + "system-config/get-rates"),

	getBilling: async (payload?: any): Promise<any> =>
		await apiIns.post(
			SETTING_SERVICE + "merchant-purchases/get-list-by-storeId",
			mergeBodyWithStoreId(payload)
		),

	getPaymentMedia: async (type: string): Promise<any> =>
		await apiIns.get(ADMIN_SERVICE + "payment-media/get-by-type/" + type),
};
