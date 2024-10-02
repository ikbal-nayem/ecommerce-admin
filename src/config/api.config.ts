import { SESSION_STORAGE_KEY } from '@constants/common.constant';
import { ROUTES } from '@constants/route.constant';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LocalStorageService } from 'services/utils/local-storage.service';
import { SessionStorageService } from 'services/utils/session-storage.service';
import { ENV } from './ENV.config';

const axiosIns = axios.create({
	baseURL: ENV.ApiEndpoint,
	headers: {
		Accept: 'application/json',
	},
});

export const setAuthHeader = () => {
	const accessToken = LocalStorageService.get(SESSION_STORAGE_KEY.ACCESS_TOKEN) || null;
	if (accessToken) axiosIns.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
};

axiosIns.interceptors.request.use(
	(config) => config,
	(error) => {
		if (error.response) {
			return Promise.reject({
				...error.response,
				...{ status: error.response.status || error.status },
			});
		}

		return Promise.reject({
			body: false,
			status: 404,
			message: 'Server not responding',
		});
	}
);

axiosIns.interceptors.response.use(
	(res: any) => {
		return { ...res.data };
	},
	(error) => {
		if (error?.response) {
			if (error.response?.status === 401) logout();
			if (error.response?.status === 413) {
				toast.error(error.response?.message);
				return;
			}
			if (error.response?.data) {
				return Promise.reject({
					status: error.response?.status,
					message: error.response?.data?.message || error.response?.data?.error,
					body: {},
				});
			}

			return Promise.reject({
				message: error.message,
				status: error?.response?.status || error.status || 500,
			});
		} else
			return Promise.reject({
				status: 500,
				message: 'Server not responding',
				body: {},
			});
	}
);

const logout = () => {
	SessionStorageService.clear();
	LocalStorageService.clear();
	window.location.replace(ROUTES.HOME);
};

const refreshToken = () => {
	return axiosIns.post('/auth/refresh-token');
};
const setToken = (accessToken: string) => {
	LocalStorageService.set('accessToken', accessToken);
};
const setRefreshToken = (refreshToken: string) => {
	LocalStorageService.set('refreshToken', refreshToken);
};

export const apiIns = axiosIns;
