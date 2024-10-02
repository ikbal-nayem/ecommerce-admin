import { LOCAL_STORAGE_KEY } from '@constants/common.constant';

export const isBrowser = typeof window !== 'undefined';
export const isServer = typeof window == 'undefined';

export const LocalStorageService = {
	set: (key: string, value: any): void => localStorage.setItem(key, JSON.stringify(value)),
	get: (key: string): string | null => JSON.parse(localStorage.getItem(key)),
	delete: (key: string): void => localStorage.removeItem(key),
	clear: (): void => {
		Object.keys(LOCAL_STORAGE_KEY).forEach((key: string) => localStorage.removeItem(LOCAL_STORAGE_KEY[key]));
	},
};
