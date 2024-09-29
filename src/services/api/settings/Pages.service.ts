import { SETTING_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";
import { IPagesSettings } from "@interfaces/Settings.interface";
import {
	mergeBodyWithStoreId,
	mergePayloadWithStoreId,
} from "services/utils/localStorageData.service";

export const PagesSettingService = {
	getList: async (payload): Promise<any> =>
		await apiIns.post(
			SETTING_SERVICE + "pages/get-list",
			mergeBodyWithStoreId(payload)
		),

	getById: async (id: string): Promise<any> =>
		await apiIns.get(SETTING_SERVICE + "pages/public/get-by-id/" + id),

	create: async (payload: IPagesSettings): Promise<any> =>
		await apiIns.post(
			SETTING_SERVICE + "pages/create",
			mergePayloadWithStoreId(payload)
		),

	update: async (payload: IPagesSettings): Promise<any> =>
		await apiIns.put(SETTING_SERVICE + "pages/update", payload),

	deleteAll: async (payload: { ids: string[] }): Promise<any> =>
		await apiIns.post(
			SETTING_SERVICE + `pages/delete-all`,
			mergePayloadWithStoreId(payload)
		),

	isSlugAvailable: async (slug: string): Promise<any> =>
		await apiIns.get(SETTING_SERVICE + "pages/is-slug-available/" + slug),
};
