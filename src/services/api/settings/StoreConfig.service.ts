import { SETTING_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";
import { IThemeFooter } from "@interfaces/themeCustomization.interface";

export const StoreConfigService = {
	save: async (payload: any): Promise<any> =>
		await apiIns.post(SETTING_SERVICE + "store-config/save", payload),

	getConfig: async (): Promise<any> =>
		await apiIns.get(SETTING_SERVICE + "store-config/get-config"),

	getThemeSettings: async (): Promise<any> =>
		await apiIns.get(SETTING_SERVICE + "store-config/get-theme-settings"),

	// for theme customization
	saveHome: async (payload: any): Promise<any> =>
		await apiIns.put(SETTING_SERVICE + "store-config/save-home", payload),

	deleteHeaderSlider: async (): Promise<any> =>
		await apiIns.delete(SETTING_SERVICE + "store-config/delete-home"),

	saveFooter: async (payload: IThemeFooter): Promise<any> =>
		await apiIns.put(SETTING_SERVICE + "store-config/save-footer", payload),
};
