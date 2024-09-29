import { PRODUCT_CATEGORY } from "config/api-constant";
import { apiIns } from "config/api.config";
import { IRequestMeta } from "@interfaces/common.interface";
import {
  mergeBodyWithStoreId,
  mergePayloadWithStoreId,
} from "services/utils/localStorageData.service";

export interface ICategoryPayload {
  id?: string;
  storeId?: string;
  name?: string;
  slug?: string;
  description?: string;
  parentId?: string;
  parent?: string | object;
  productCount?: number;
  children?: ICategoryPayload[];
  banner?: {
    id?: string;
    bucketName?: string;
    fileName?: string;
    fileType?: string;
  } | null;
  isActive?: boolean;
  active?: boolean;
}

export interface ICategoryLinearPayload {
  body: {
    storeId?: string;
    id?: string;
    name?: string;
  };
  meta?: IRequestMeta;
}
export interface ICategoryGetByIdSet {
  storeId?: string;
  ids?: any[];
  meta?: IRequestMeta;
}

export interface ICategoryReadPayload {
  meta: IRequestMeta;
  body: ICategoryPayload;
}

export interface ICategoryResponse {
  timestamp: string;
  status: number;
  message: string;
  body: ICategoryPayload[];
  meta: IRequestMeta;
}

export interface ICategoryToggleUpdate {
  id: string;
  isActive: boolean;
}

const defaultRequest = {
  meta: {},
  body: {},
};

export const CategoryService = {
  create: async (payload: ICategoryPayload | any): Promise<any> =>
    await apiIns.post(PRODUCT_CATEGORY + "create", payload),

  isSlugAvailable: async (payload: any): Promise<any> =>
    await apiIns.post(
      PRODUCT_CATEGORY + "is-slug-available",
      mergePayloadWithStoreId(payload)
    ),

  get: async (payload: ICategoryLinearPayload = defaultRequest): Promise<any> =>
    await apiIns.post(
      PRODUCT_CATEGORY + "get-list",
      mergeBodyWithStoreId(payload)
    ),

  getByIdSet: async (payload: ICategoryGetByIdSet): Promise<any> =>
    await apiIns.post(
      PRODUCT_CATEGORY + "get-by-id-set",
      mergePayloadWithStoreId(payload)
    ),

  update: async (payload: any): Promise<any> =>
    await apiIns.put(PRODUCT_CATEGORY + "update", payload),

  uploadBanner: async (payload: any): Promise<any> =>
    await apiIns.put(PRODUCT_CATEGORY + "upload-banner", payload),

  deleteBanner: async (payload: any): Promise<any> =>
    await apiIns.put(
      PRODUCT_CATEGORY + "delete-banner",
      mergePayloadWithStoreId(payload)
    ),

  delete: async (deletePayload: any): Promise<any> =>
    await apiIns.put(
      PRODUCT_CATEGORY + "delete",
      mergePayloadWithStoreId(deletePayload)
    ),

  toggleActivity: async (payload: ICategoryToggleUpdate): Promise<any> =>
    await apiIns.put(PRODUCT_CATEGORY + "toggle-activity/", payload),

  categoryGetById: async (id: string): Promise<any> =>
    await apiIns.get(PRODUCT_CATEGORY + "get-by-id/" + id),

  categoryGetByStoreId: async (id: string): Promise<any> =>
    await apiIns.get(PRODUCT_CATEGORY + "get-by-store-id/" + id),
};
