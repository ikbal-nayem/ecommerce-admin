import { SETTING_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";
import themeData from "services/helper/theme.config.json";

export const ThemeCustomizationService = {
	getThemeSettings: async (): Promise<any> =>
		await apiIns.get(SETTING_SERVICE + "store-config/get-theme-settings"),

	saveHome: async (payload: any): Promise<any> =>
		await apiIns.put(SETTING_SERVICE + "store-config/save-home", payload),

	saveSocialLink: async (payload: any): Promise<any> =>
		await apiIns.put(SETTING_SERVICE + "store-config/save-social", payload),

	saveTypography: async (payload: any): Promise<any> =>
		await apiIns.put(SETTING_SERVICE + "store-config/save-typography", payload),

	saveColor: async (payload: any): Promise<any> =>
		await apiIns.put(SETTING_SERVICE + "store-config/save-color", payload),

	themeSectionNavList: async (): Promise<any> => ({
		message: "",
		body: JSON.parse(JSON.stringify(themeData)),
		status: 200,
	}),
};
