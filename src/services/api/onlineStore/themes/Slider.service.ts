import { SLIDER, SLIDER_ITEMS } from "config/api-constant";
import { apiIns } from "config/api.config";
import { ISlider } from "@interfaces/themeCustomization.interface";
import {
	mergeBodyWithStoreId,
	mergePayloadWithStoreId,
} from "services/utils/localStorageData.service";


export const SliderService = {
	get: async (payload): Promise<any> =>
		apiIns.post(SLIDER + "get-list", mergeBodyWithStoreId(payload)),

	create: async (payload: any): Promise<any> =>
		apiIns.post(SLIDER + "create", mergePayloadWithStoreId(payload)),

	update: async (payload: ISlider): Promise<any> =>
		apiIns.put(SLIDER + "update", payload),

	deleteAll: async (ids: string[]): Promise<any> =>
		await apiIns.put(
			SLIDER + "delete-all",
			mergePayloadWithStoreId({ ids: ids })
		),
};

export const SliderItemService = {
	getBySliderId: async (sliderId): Promise<any> =>
		apiIns.get(SLIDER_ITEMS + "get-by-slider-id/" + sliderId),

	create: async (payload: any): Promise<any> =>
		apiIns.post(SLIDER_ITEMS + "create", payload),

	update: async (payload: any): Promise<any> =>
		apiIns.put(SLIDER_ITEMS + "update", payload),

	reOrganize: async (payload: any): Promise<any> =>
		apiIns.put(SLIDER_ITEMS + "re-organize", payload),

	deleteAll: async (ids: string[]): Promise<any> =>
		await apiIns.post(
			SLIDER_ITEMS + "delete-all",
			mergePayloadWithStoreId({ ids: ids })
		),
};
