import { AUTH } from 'config/api-constant';
import { apiIns } from 'config/api.config';

interface LoginPayload {
	user_name: string;
	password: string;
}

export const AuthService = {
	login: async (loginPayload: LoginPayload): Promise<any> => await apiIns.post('/user/login', loginPayload),
	// login: async (loginPayload: LoginPayload): Promise<any> =>
	//   await apiIns.post(
	//     "auth-service/merchant/get-user-store-list",
	//     loginPayload
	//   ),
	loginStepTwo: async (loginPayload: LoginPayload): Promise<any> =>
		await apiIns.post(AUTH + 'sign-in', loginPayload),

	checkToken: async (): Promise<any> => await apiIns.get(AUTH + 'token-validation'),

	logout: async (payload: any): Promise<any> => await apiIns.post(AUTH + 'sign-out', payload),
};
