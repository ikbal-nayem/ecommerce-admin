import { PROFILE_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";
import { IPortalPaymentMedia } from "@interfaces/portal.interface";

interface IUserAddress {
	id?: string;
	userId: string;
	title: string;
	type: string;
	isDefault?: true;
	firstName: string;
	lastName: string;
	addressLine1: string;
	addressLine2: string;
	fullAddress: string;
	cityName: string;
	state: string;
	postCode: string;
	country: string;
	phone: string;
	email: string;
}

export const ProfileService = {
	getAllUserAddress: async (): Promise<any> =>
		await apiIns.get(PROFILE_SERVICE + "addresses/get-my-addresses"),

	getUserAddressById: async (id: string): Promise<any> =>
		await apiIns.get(PROFILE_SERVICE + "addresses/get-by-id/" + id),

	updateUserAddress: async (payload: IUserAddress): Promise<any> =>
		await apiIns.put(PROFILE_SERVICE + "addresses/update", payload),

	createUserAddress: async (payload: IUserAddress): Promise<any> =>
		await apiIns.post(PROFILE_SERVICE + "addresses/create", payload),

	deleteUserAddress: async (id: string): Promise<any> =>
		await apiIns.delete(PROFILE_SERVICE + "addresses/delete-by-id/" + id),

	enablePartner: async (): Promise<any> =>
		await apiIns.get(PROFILE_SERVICE + "users/enable-partner"),

	referredGetList: async (payload): Promise<any> =>
		await apiIns.post(PROFILE_SERVICE + "referred/get-list", payload),

	getReferralPaymentInfo: async (id: string): Promise<any> =>
		await apiIns.get(PROFILE_SERVICE + "referred/get-by-store-id/" + id),

	getOverview: async (): Promise<any> =>
		await apiIns.get(PROFILE_SERVICE + "overview/get"),

	setPaymentMethod: async (payload): Promise<any> =>
		await apiIns.post(PROFILE_SERVICE + "payment-methods/create", payload),

	getPaymentMethods: async (): Promise<any> =>
		await apiIns.get(PROFILE_SERVICE + "payment-methods/get-mine"),

	updatePaymentMethod: async (payload: IPortalPaymentMedia): Promise<any> =>
		await apiIns.put(PROFILE_SERVICE + "payment-methods/update", payload),

	deletePaymentMethod: async (id): Promise<any> =>
		await apiIns.put(PROFILE_SERVICE + "payment-methods/delete-by-id/" + id),
};
