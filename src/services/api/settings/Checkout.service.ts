import { SETTING_SERVICE } from 'config/api-constant';
import { apiIns } from 'config/api.config';
import { mergePayloadWithStoreId } from 'services/utils/localStorageData.service';

export const CheckoutSettingService = {
	getInfo: async (): Promise<any> => await apiIns.get(SETTING_SERVICE + 'checkout/get-by-store/'),

	update: async (payload: any): Promise<any> =>
		await apiIns.put(SETTING_SERVICE + 'checkout/update', mergePayloadWithStoreId(payload)),
};
