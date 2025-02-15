import { IObject, IRequestMeta } from '@interfaces/common.interface';
import { PRODUCT_CATEGORY } from 'config/api-constant';
import { apiIns } from 'config/api.config';
import { mergeBodyWithStoreId, mergePayloadWithStoreId } from 'services/utils/localStorageData.service';

export interface ICategoryPayload {
	_id?: string;
	name?: string;
	slug?: string;
	description?: string;
	parent?: string | IObject;
	productCount?: number;
	subcategories?: ICategoryPayload[];
	image?: string;
	isActive?: boolean;
}

export interface ICategoryLinearPayload {
	body: {
		storeId?: string;
		id?: string;
		name?: string;
	};
	meta?: IRequestMeta;
}
export interface ICategoryGetByIdSet {
	storeId?: string;
	ids?: any[];
	meta?: IRequestMeta;
}

export interface ICategoryReadPayload {
	meta: IRequestMeta;
	body: ICategoryPayload;
}

export interface ICategoryResponse {
	timestamp: string;
	status: number;
	message: string;
	body: ICategoryPayload[];
	meta: IRequestMeta;
}

export interface ICategoryToggleUpdate {
	id: string;
	isActive: boolean;
}

const defaultRequest = {
	meta: {},
	body: {},
};

export const CategoryService = {
	getTree: async (): Promise<any> => await apiIns.get('product-config/category-tree'),

	create: async (payload: FormData): Promise<any> => await apiIns.post('product-config/category', payload),

	update: async (id: string, payload: FormData | IObject): Promise<any> =>
		await apiIns.put('product-config/category/' + id, payload),

	delete: async (id: string): Promise<any> => await apiIns.delete('product-config/category/' + id),

	isSlugUnique: async (slug: string): Promise<any> =>
		await apiIns.get('product-config/category/is-slug-unique?slug=' + slug),

	get: async (payload: ICategoryLinearPayload = defaultRequest): Promise<any> =>
		await apiIns.post(PRODUCT_CATEGORY + 'get-list', mergeBodyWithStoreId(payload)),

	getByIdSet: async (payload: ICategoryGetByIdSet): Promise<any> =>
		await apiIns.post(PRODUCT_CATEGORY + 'get-by-id-set', mergePayloadWithStoreId(payload)),

	uploadBanner: async (payload: any): Promise<any> =>
		await apiIns.put(PRODUCT_CATEGORY + 'upload-banner', payload),

	categoryGetById: async (id: string): Promise<any> => await apiIns.get(PRODUCT_CATEGORY + 'get-by-id/' + id),
};
