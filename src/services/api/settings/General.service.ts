import { SETTING_SERVICE } from 'config/api-constant';
import { apiIns } from 'config/api.config';

interface IOperatorList {
	meta: {};
	body: {};
}

export const GeneralSettingService = {
	getStoreInfo: async (): Promise<any> => await apiIns.get(SETTING_SERVICE + 'store/get-by-id/'),

	getStoreType: async (payload): Promise<any> =>
		await apiIns.post(SETTING_SERVICE + 'store-types/get-list', payload),

	getStoreAddress: async (): Promise<any> =>
		await apiIns.get(SETTING_SERVICE + 'store-warehouse/get-by-store-id/'),

	update: async (payload: any): Promise<any> =>
		apiIns.put(SETTING_SERVICE + 'store/update', {
			...payload,
		}),

	storeAddressUpdate: async (payload: any): Promise<any> =>
		apiIns.put(SETTING_SERVICE + 'store-warehouse/update', {
			...payload,
		}),
};
