import { SETTING_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";
import { INotificationSettings } from "@interfaces/Settings.interface";
import {
	mergeBodyWithStoreId,
	mergePayloadWithStoreId,
} from "services/utils/localStorageData.service";

export const DomainSettingService = {
	getByStoreId: async (payload): Promise<any> =>
		await apiIns.post(
			SETTING_SERVICE + "domains/get-by-store-id",
			mergeBodyWithStoreId(payload)
		),

	create: async (payload: INotificationSettings): Promise<any> =>
		await apiIns.post(
			SETTING_SERVICE + "domains/create",
			mergePayloadWithStoreId(payload)
		),

	delete: async (payload: { id: string }): Promise<any> =>
		await apiIns.delete(
			SETTING_SERVICE +
				`domains/delete/${mergePayloadWithStoreId(payload)?.storeId}/${
					payload?.id
				}`
		),

	makeDomainPrimary: async (payload: { id: string }): Promise<any> =>
		await apiIns.put(
			SETTING_SERVICE + "domains/make-domain-primary",
			mergePayloadWithStoreId(payload)
		),
};
