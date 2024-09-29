import {
	APPS_BILLING,
	APPS_REGISTER,
	APPS_RELEASE,
	APPS_REVIEW,
	APPS_REVIEW_REACTION,
	APPS_TYPES,
	APP_SERVICE,
	SETTING_SERVICE,
} from "config/api-constant";
import { apiIns } from "config/api.config";
import { IRequestMeta } from "@interfaces/common.interface";


export interface IAppPayload {
	id?: string;
	isPublished?: boolean;
	appTitle?: string;
	categoryId?: string;
	appId?: string;
	storeId?: string;
	name?: string;
	slug?: string;
	description?: string;
	parentId?: string;
	parent?: string | object;
	collectionBanner?: {
		id?: string;
		bucketName: string;
		fileName: string;
		fileType?: string;
	} | null;
	isActive?: boolean;
	active?: boolean;
}

export interface IAppsPayload {
	meta?: IRequestMeta;
	body?: IAppPayload;
}

const defaultRequest = {
	// meta: {},
	body: {},
};

export const AppsService = {
	get: async (payload): Promise<any> =>
		await apiIns.post(APPS_REGISTER + "public/get-list", payload),

	install: async (payload = defaultRequest): Promise<any> =>
		await apiIns.post(SETTING_SERVICE + "installed-app/add-new", payload),

	uninstall: async (payload = defaultRequest): Promise<any> =>
		await apiIns.post(SETTING_SERVICE + "installed-app/uninstall-app", payload),

	checkIsInstalled: async (appId: string): Promise<any> =>
		await apiIns.get(
			SETTING_SERVICE + "installed-app/check-by-app-id/" + appId
		),

	update: async (payload: any): Promise<any> =>
		await apiIns.put(APPS_REGISTER + "update", payload),

	delete: async (ids: string[]): Promise<any> =>
		await apiIns.post(APPS_REGISTER + "delete-all", ids),

	getAppById: async (id: string): Promise<any> =>
		await apiIns.get(APPS_REGISTER + "public/get-by-id/" + id),

	getInstalledApp: async (payload = defaultRequest): Promise<any> =>
		await apiIns.post(SETTING_SERVICE + "installed-app/get-list", payload),

	getAppFAQ: async (payload): Promise<any> =>
		await apiIns.post(APP_SERVICE + "app-faq/public/get-list", payload),
};

export const AppsReleaseService = {
	get: async (payload = defaultRequest): Promise<any> =>
		await apiIns.post(APPS_RELEASE + "get-list", payload),

	update: async (payload: any): Promise<any> =>
		await apiIns.put(APPS_RELEASE + "update", payload),

	delete: async (ids: string[]): Promise<any> =>
		await apiIns.post(APPS_RELEASE + "delete-all", ids),

	getById: async (id: string): Promise<any> =>
		await apiIns.get(APPS_RELEASE + "public/get-by-appId/" + id),
};

export const AppsReviewService = {
	getReviewList: async (payload = defaultRequest): Promise<any> =>
		await apiIns.post(APPS_REVIEW + "public/get-list", payload),

	update: async (payload: any): Promise<any> =>
		await apiIns.put(APPS_REVIEW + "update", payload),

	delete: async (ids: string[]): Promise<any> =>
		await apiIns.post(APPS_REVIEW + "delete-all", ids),

	getAppById: async (id: string): Promise<any> =>
		await apiIns.get(APPS_REVIEW + "get-by-id/" + id),

	getRatingById: async (id: string): Promise<any> =>
		await apiIns.get(APPS_REVIEW + "public/ratings-by-appId/" + id),

	reviewReaction: async (payload: any): Promise<any> =>
		await apiIns.post(APPS_REVIEW_REACTION + "create", payload),
};

export const AppsTypesService = {
  get: async (payload: IAppsPayload = defaultRequest): Promise<any> =>
    await apiIns.post(APPS_TYPES + "get-list", payload),

  update: async (payload: any): Promise<any> =>
    await apiIns.put(APPS_TYPES + "update", payload),

  delete: async (ids: string[]): Promise<any> =>
    await apiIns.post(APPS_TYPES + "delete-all", ids),
};

export const AppsBillingService = {
  get: async (payload: IAppsPayload = defaultRequest): Promise<any> =>
    await apiIns.post(APPS_BILLING + "get-list", payload),
};
