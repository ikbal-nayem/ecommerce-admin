import { SETTING_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";
import {
	IMerchantPurchase,
	INotificationSettings,
} from "@interfaces/Settings.interface";
import { mergePayloadWithStoreId } from "services/utils/localStorageData.service";

export const NotificationSettingService = {
	syncAndGet: async (): Promise<any> =>
		await apiIns.post(SETTING_SERVICE + "notification-settings/sync-and-get"),

	update: async (payload: INotificationSettings): Promise<any> =>
		await apiIns.put(SETTING_SERVICE + "notification-settings/update", payload),

	getBalanceByStoreId: async (storeId: string): Promise<any> =>
		await apiIns.get(SETTING_SERVICE + "balance/get-by-store-id/" + storeId),

	merchantPurchaseCreate: async (payload: IMerchantPurchase): Promise<any> =>
		await apiIns.post(
			SETTING_SERVICE + "merchant-purchases/create",
			mergePayloadWithStoreId(payload)
		),
};
