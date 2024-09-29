import { GROUP_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";
import {
  mergeBodyWithStoreId,
  mergePayloadWithStoreId,
} from "services/utils/localStorageData.service";
export interface IGroup {
  id: string;
  storeId?: string;
  title?: string;
}

export const GroupService = {
  get: async (payload): Promise<any> =>
    apiIns.post(GROUP_SERVICE + "get-list", mergeBodyWithStoreId(payload)),
  getByIdSet: async (payload): Promise<any> =>
    apiIns.post(GROUP_SERVICE + "get-by-id-set", payload),
  create: async (payload: any): Promise<any> =>
    apiIns.post(GROUP_SERVICE + "create", mergePayloadWithStoreId(payload)),
  update: async (payload: any): Promise<any> =>
    apiIns.put(GROUP_SERVICE + "update", payload),

  delete: async (ids: string[]): Promise<any> =>
    await apiIns.put(GROUP_SERVICE + "delete-all", ids),
};
