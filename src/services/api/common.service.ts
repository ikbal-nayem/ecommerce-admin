import { apiIns } from 'config/api.config';

export const CommonService = {
	ping: async (): Promise<any> => await apiIns.get('/ping'),
};
