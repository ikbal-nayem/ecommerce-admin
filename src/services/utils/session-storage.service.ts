import { SESSION_STORAGE_KEY } from '@constants/common.constant';

export const SessionStorageService = {
	set: (key: string, value: any): void => sessionStorage.setItem(key, JSON.stringify(value)),
	get: (key: string): string | null => JSON.parse(sessionStorage.getItem(key)),
	delete: (key: string): void => sessionStorage.removeItem(key),
	clear: (): void => {
		Object.keys(SESSION_STORAGE_KEY).forEach((key: string) => sessionStorage.removeItem(key));
	},
};
