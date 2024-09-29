import { PRODUCT_SERVICE, SETTING_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";
import {
	mergeBodyWithStoreId,
	mergePayloadWithStoreId,
} from "services/utils/localStorageData.service";

export const DowngradeService = {
	isDowngradable: async (planId): Promise<any> =>
		await apiIns.get(SETTING_SERVICE + "store/is-downgradable/" + planId),

	getListHavingVariants: async (payload): Promise<any> =>
		await apiIns.post(
			PRODUCT_SERVICE + "products/get-list-having-variants",
			mergeBodyWithStoreId(payload)
		),

	getProductListWithExtraImage: async (payload): Promise<any> =>
		await apiIns.post(
			PRODUCT_SERVICE + "products/get-list-with-extra-image",
			mergeBodyWithStoreId(payload)
		),

	removeProductVariants: async (payload): Promise<any> =>
		await apiIns.put(
			PRODUCT_SERVICE + "products/delete-by-product-id-set",
			mergePayloadWithStoreId(payload)
		),

	removeProductImages: async (payload): Promise<any> =>
		await apiIns.put(PRODUCT_SERVICE + "products/delete-images", payload),

	appGreaterThanLevel: async (id: string): Promise<any> =>
		await apiIns.get(
			SETTING_SERVICE + "installed-app/greater-than-level/" + id
		),
};
