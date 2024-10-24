import { IObject } from '@interfaces/common.interface';
import { PRODUCT_SERVICE } from 'config/api-constant';
import { apiIns } from 'config/api.config';
import { mergeBodyWithStoreId, mergePayloadWithStoreId } from 'services/utils/localStorageData.service';

interface IProductsPayload {
	body?: {
		// storeId: string;
	};
	meta?: {};
}

interface IProductsVariantPayload {}

export const ProductService = {
	addProduct: async (payload: any): Promise<any> => {
		return await apiIns.post('product/add', payload);
	},

	get: async (payload: IProductsPayload): Promise<any> => {
		return await apiIns.get('product/get');
	},

	search: async (payload: IObject): Promise<any> => {
		return await apiIns.post('product/search', payload);
	},

	getById: async (product_id: string): Promise<any> => {
		return await apiIns.get('product/get/' + product_id);
	},

	deleteById: async (product_id: string): Promise<any> => {
		return await apiIns.delete('product/' + product_id);
	},

	getByIds: async (product_ids: any[]): Promise<any> => {
		return await apiIns.post(PRODUCT_SERVICE + 'products/get-by-id-set', product_ids);
	},
	updateProduct: async (id: string, payload: IObject): Promise<any> => {
		return await apiIns.put('product/' + id, payload);
	},

	getProductVariant: async (payload: IProductsVariantPayload): Promise<any> => {
		return await apiIns.post(PRODUCT_SERVICE + 'inventory/get-list', mergeBodyWithStoreId(payload));
	},

	updateProductQuantity: async (payload: IProductsVariantPayload): Promise<any> => {
		return await apiIns.post(PRODUCT_SERVICE + 'inventory/update-quantity', mergePayloadWithStoreId(payload));
	},
};
