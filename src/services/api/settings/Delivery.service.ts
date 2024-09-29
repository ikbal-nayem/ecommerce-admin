import { SETTING_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";
import { IDeliveryZoneItem } from "@interfaces/Settings.interface";
import {
	mergeBodyWithStoreId,
	mergePayloadWithStoreId,
} from "services/utils/localStorageData.service";

const defaultPayload = {
	meta: {
		offset: 0,
		limit: 20,
		sort: [
			{
				order: "decs",
				field: "name",
			},
		],
	},
	body: {},
};

export const DeliverySettingService = {
	getList: async (payload = defaultPayload): Promise<any> =>
		await apiIns.post(
			SETTING_SERVICE + "delivery-zones/get-list",
			mergeBodyWithStoreId(payload)
		),

	create: async (payload: IDeliveryZoneItem): Promise<any> =>
		await apiIns.post(
			SETTING_SERVICE + "delivery-zones/create",
			mergePayloadWithStoreId(payload)
		),

	update: async (payload: IDeliveryZoneItem): Promise<any> =>
		await apiIns.put(SETTING_SERVICE + "delivery-zones/update", payload),

	deleteAll: async (payload: { ids: string[] }): Promise<any> =>
		await apiIns.put(
			SETTING_SERVICE + "delivery-zones/delete-all",
			mergePayloadWithStoreId(payload)
		),

	changeStatus: async (payload): Promise<any> =>
		await apiIns.put(
			SETTING_SERVICE + "delivery-zones/change-status",
			mergePayloadWithStoreId(payload)
		),
};
