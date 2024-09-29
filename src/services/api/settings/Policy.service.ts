import { SETTING_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";
import { IPolicySettings } from "@interfaces/Settings.interface";
import { mergePayloadWithStoreId } from "services/utils/localStorageData.service";

export const PolicySettingService = {
	save: async (payload: IPolicySettings): Promise<any> =>
		await apiIns.post(
			SETTING_SERVICE + "policies/save",
			mergePayloadWithStoreId(payload)
		),

	getStorePolicies: async (): Promise<any> =>
		await apiIns.get(SETTING_SERVICE + "policies/get-my-store-policies"),

	isSlugAvailable: async (slug: string): Promise<any> =>
		await apiIns.get(SETTING_SERVICE + "policies/is-slug-available/" + slug),
};
