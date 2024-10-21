import { ADMIN_SERVICE, PRODUCT_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";
import {
  mergeBodyWithStoreId,
  mergePayloadWithStoreId,
} from "services/utils/localStorageData.service";

interface IProductsPayload {
  body?: {
    // storeId: string;
  };
  meta?: {};
}

interface IProductsVariantPayload {}

export const ProductService = {
	addProduct: async (payload: any): Promise<any> => {
		return await apiIns.post("product/add", payload);
	},

	getAll: async (payload: IProductsPayload): Promise<any> => {
		return await apiIns.post(
			PRODUCT_SERVICE + "products/get-list",
			mergeBodyWithStoreId(payload)
		);
	},
	search: async (payload: IProductsPayload): Promise<any> => {
		return await apiIns.post(
			PRODUCT_SERVICE + "products/search",
			mergeBodyWithStoreId(payload)
		);
	},
	getById: async (product_id: string): Promise<any> => {
		return await apiIns.get(
			PRODUCT_SERVICE + "products/get-by-id/" + product_id
		);
	},
	getByIds: async (product_ids: any[]): Promise<any> => {
		return await apiIns.post(
			PRODUCT_SERVICE + "products/get-by-id-set",
			product_ids
		);
	},
	updateProduct: async (payload: IProductsPayload): Promise<any> => {
		return await apiIns.put(PRODUCT_SERVICE + "products/update", payload);
	},
	getSalesChannel: async (): Promise<any> => {
		return await apiIns.get(
			ADMIN_SERVICE + "master-meta/get-by-meta-type/SALES_CHANNEL"
		);
	},
	uploadImages: async (payload: any): Promise<any> =>
		await apiIns.put(PRODUCT_SERVICE + "products/upload-images", payload),

	deleteImages: async (payload: any): Promise<any> =>
		await apiIns.put(
			PRODUCT_SERVICE + "products/delete-image",
			mergePayloadWithStoreId(payload)
		),

	deleteAll: async (payload: { ids: string[] }): Promise<any> => {
		return await apiIns.put(
			PRODUCT_SERVICE + "products/delete-all",
			mergePayloadWithStoreId(payload)
		);
	},

	getProductVariant: async (payload: IProductsVariantPayload): Promise<any> => {
		return await apiIns.post(
			PRODUCT_SERVICE + "inventory/get-list",
			mergeBodyWithStoreId(payload)
		);
	},

	updateProductQuantity: async (
		payload: IProductsVariantPayload
	): Promise<any> => {
		return await apiIns.post(
			PRODUCT_SERVICE + "inventory/update-quantity",
			mergePayloadWithStoreId(payload)
		);
	},
};
