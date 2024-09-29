import {
	SETTING_SERVICE,
	THEME_REGISTER,
	THEME_RELEASE,
	THEME_SERVICE,
} from "config/api-constant";
import { apiIns } from "config/api.config";
import { mergeBodyWithStoreId } from "services/utils/localStorageData.service";

export const ThemeService = {
	getList: async (payload): Promise<any> =>
		apiIns.post(THEME_REGISTER + "get-list", mergeBodyWithStoreId(payload)),

	getInstalledTheme: async (payload): Promise<any> =>
		apiIns.post(
			SETTING_SERVICE + "installed-theme/get-list",
			mergeBodyWithStoreId(payload)
		),

	getById: async (id: string): Promise<any> =>
		apiIns.get(THEME_REGISTER + "public/get-by-id/" + id),

	getReleaseData: async (theme_id: string): Promise<any> =>
		apiIns.get(THEME_RELEASE + "public/get-last-release/" + theme_id),

	themeInstall: async (payload): Promise<any> =>
		apiIns.post(SETTING_SERVICE + "installed-theme/add-new", payload),

	themeUninstall: async (payload): Promise<any> =>
		apiIns.post(SETTING_SERVICE + "installed-theme/uninstall", payload),

	checkIsInstalled: async (id): Promise<any> =>
		apiIns.get(SETTING_SERVICE + "installed-theme/check-by-theme-id/" + id),

	getFAQ: async (payload): Promise<any> =>
		apiIns.post(THEME_SERVICE + "theme-faq/public/get-list", payload),

	getThemeReview: async (payload): Promise<any> =>
		apiIns.post(THEME_SERVICE + "theme-review/public/get-list", payload),

	themePublish: async (payload): Promise<any> =>
		apiIns.put(
			SETTING_SERVICE + "installed-theme/publish/" + payload.themeId,
			payload
		),
};
