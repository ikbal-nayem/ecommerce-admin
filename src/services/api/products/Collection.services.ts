import { IObject, IRequestMeta, IRequestPayload } from '@interfaces/common.interface';
import { PRODUCT_COLLECTION } from 'config/api-constant';
import { apiIns } from 'config/api.config';
import { mergePayloadWithStoreId } from 'services/utils/localStorageData.service';

export interface ICollectionPayload {
	_id?: string;
	name?: string;
	slug?: string;
	description?: string;
	image?: string | null;
	isActive?: boolean;
}


export const CollectionService = {
	create: async (payload: FormData): Promise<any> => await apiIns.post('product-config/collection', payload),

	update: async (id: string, payload: IObject): Promise<any> =>
		await apiIns.put('product-config/collection/' + id, payload),

	delete: async (id: string): Promise<any> => await apiIns.delete('product-config/collection/' + id),

	isSlugAvailable: async (payload: any): Promise<any> =>
		await apiIns.post(PRODUCT_COLLECTION + 'is-slug-available', mergePayloadWithStoreId(payload)),

	get: async (): Promise<any> => await apiIns.get('product-config/collections'),

	search: async (payload: IRequestPayload): Promise<any> =>
		await apiIns.post('product-config/collection/search', payload),

	collectionGetById: async (id: string): Promise<any> =>
		await apiIns.get(PRODUCT_COLLECTION + 'get-by-id/' + id),
};
