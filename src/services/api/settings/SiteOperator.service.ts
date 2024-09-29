import { AUTH } from "config/api-constant";
import { apiIns } from "config/api.config";
import { mergePayloadWithStoreId } from "services/utils/localStorageData.service";

interface IOperatorList {
  meta: {};
  body: {};
}

export const SiteOperatorService = {
	getList: async (): Promise<any> => await apiIns.get(AUTH + "staff-list"),

	getById: async (id): Promise<any> =>
		await apiIns.get(AUTH + "/staff-get-by-id/" + id),

	update: async (payload: any): Promise<any> =>
		apiIns.put(AUTH + "staff-update", payload),

	deleteOperator: async (id: string): Promise<any> =>
		await apiIns.put(AUTH + "staff-delete-by-id/" + id),

	create: async (payload: {}): Promise<any> =>
		await apiIns.post(AUTH + "staff-create", mergePayloadWithStoreId(payload)),
};
