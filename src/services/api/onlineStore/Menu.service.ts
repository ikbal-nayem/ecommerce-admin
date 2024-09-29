import { SETTING_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";
import { IMenusetMenu } from "@interfaces/OnlineStore.interface";
import {
	mergeBodyWithStoreId,
	mergePayloadWithStoreId,
} from "services/utils/localStorageData.service";

export const MenuStoreService = {
	getSetMenu: async (): Promise<any> =>
		await apiIns.post(SETTING_SERVICE + "menu/get-set-menu"),

	getMenuList: async (): Promise<any> =>
		await apiIns.post(SETTING_SERVICE + "menu/get-menu"),

	create: async (payload: IMenusetMenu): Promise<any> =>
		await apiIns.post(SETTING_SERVICE + "menu/create"),
};
export const MenuSetService = {
	create: async (payload: IMenusetMenu): Promise<any> =>
		await apiIns.post(
			SETTING_SERVICE + "store-menu-set/create",
			mergePayloadWithStoreId(payload)
		),
	update: async (payload: IMenusetMenu): Promise<any> =>
		await apiIns.put(SETTING_SERVICE + "store-menu-set/update", payload),
	getList: async (payload): Promise<any> =>
		await apiIns.post(
			SETTING_SERVICE + "store-menu-set/get-list",
			mergeBodyWithStoreId(payload)
		),
	getById: async (id): Promise<any> =>
		await apiIns.get(SETTING_SERVICE + "store-menu-set/get-by-id/" + id),
	deleteAll: async (payload): Promise<any> =>
		await apiIns.post(SETTING_SERVICE + "store-menu-set/delete-all", payload),
};