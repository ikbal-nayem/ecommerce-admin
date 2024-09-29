import { IAddressesPayload } from '@interfaces/Customer.interface';
import { CUSTOMER_SERVICE } from 'config/api-constant';
import { apiIns } from 'config/api.config';
import { mergeBodyWithStoreId, mergePayloadWithStoreId } from 'services/utils/localStorageData.service';

export interface ICustomerRequestPayload {
	id?: string;
	storeId?: string;
	firstName?: string;
	lastName?: string;
	name?: string;
	email?: string;
	phoneNumber?: string;
	status?: string;
}

export const CustomerService = {
	get: async (payload): Promise<any> =>
		apiIns.post(CUSTOMER_SERVICE + 'customer/get-list-by-store', mergeBodyWithStoreId(payload)),
	getByIdSet: async (payload): Promise<any> =>
		apiIns.post(CUSTOMER_SERVICE + 'customer/get-by-id-set', payload),

	create: async (payload: ICustomerRequestPayload): Promise<any> =>
		apiIns.post(CUSTOMER_SERVICE + 'customer/add', mergePayloadWithStoreId(payload)),

	createAddress: async (payload: IAddressesPayload): Promise<any> =>
		apiIns.post(CUSTOMER_SERVICE + 'address/create', payload),

	updateAddress: async (payload: IAddressesPayload): Promise<any> =>
		apiIns.put(CUSTOMER_SERVICE + 'address/update', payload),

	addressDelete: async (payload): Promise<any> =>
		apiIns.put(CUSTOMER_SERVICE + 'address/delete-all', payload),

	getOne: async (customerId: string): Promise<any> =>
		apiIns.get(CUSTOMER_SERVICE + 'customer/get-by-id/' + customerId),

	getAddress: async (payload): Promise<any> => apiIns.post(CUSTOMER_SERVICE + 'address/get-list', payload),

	profile: async (customerId: string): Promise<any> =>
		apiIns.get(CUSTOMER_SERVICE + 'customer/profile/' + customerId + '/'),

	update: async (payload: ICustomerRequestPayload): Promise<any> =>
		apiIns.put(CUSTOMER_SERVICE + 'customer/update', mergePayloadWithStoreId(payload)),

	groupUpdate: async (payload: ICustomerRequestPayload): Promise<any> =>
		apiIns.put(CUSTOMER_SERVICE + 'customer-group/update', payload),

	addressUpdate: async (payload: IAddressesPayload): Promise<any> =>
		apiIns.put(CUSTOMER_SERVICE + 'address/update', payload),

	delete: async (ids: string[]): Promise<any> =>
		await apiIns.put(CUSTOMER_SERVICE + 'customer/delete-all', ids),
};
