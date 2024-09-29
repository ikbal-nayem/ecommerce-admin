import { PRODUCT_COLLECTION } from "config/api-constant";
import { apiIns } from "config/api.config";
import { IRequestMeta } from "@interfaces/common.interface";
import {
  mergeBodyWithStoreId,
  mergePayloadWithStoreId,
} from "services/utils/localStorageData.service";

export interface ICollectionPayload {
  id?: string;
  storeId?: string;
  name?: string;
  slug?: string;
  description?: string;
  parentId?: string;
  parent?: string | object;
  banner?: {
    id?: string;
    bucketName: string;
    fileName: string;
    fileType?: string;
    previewUrl?: string;
  } | null;
  isActive?: boolean;
  active?: boolean;
}

export interface ICollectionReadPayload {
  meta: IRequestMeta;
  body?: ICollectionPayload;
}

export interface ICollectionResponse {
  timestamp: string;
  status: number;
  message: string;
  body: ICollectionPayload[];
  meta: IRequestMeta;
}

const defaultRequest = {
  meta: {},
  body: {},
};

export const CollectionService = {
  create: async (payload: any): Promise<any> =>
    await apiIns.post(PRODUCT_COLLECTION + "create", payload),

  isSlugAvailable: async (payload: any): Promise<any> =>
    await apiIns.post(
      PRODUCT_COLLECTION + "is-slug-available",
      mergePayloadWithStoreId(payload)
    ),

  uploadBanner: async (payload: any): Promise<any> =>
    await apiIns.put(PRODUCT_COLLECTION + "upload-banner", payload),

  deleteBanner: async (payload: any): Promise<any> =>
    await apiIns.put(
      PRODUCT_COLLECTION + "delete-banner",
      mergePayloadWithStoreId(payload)
    ),

  get: async (payload: ICollectionReadPayload = defaultRequest): Promise<any> =>
    await apiIns.post(
      PRODUCT_COLLECTION + "get-list",
      mergeBodyWithStoreId(payload)
    ),

  update: async (payload: any): Promise<any> =>
    await apiIns.put(PRODUCT_COLLECTION + "update", payload),

  delete: async (deletePayload: any): Promise<any> =>
    await apiIns.post(
      PRODUCT_COLLECTION + "delete",
      mergePayloadWithStoreId(deletePayload)
    ),

  collectionGetById: async (id: string): Promise<any> =>
    await apiIns.get(PRODUCT_COLLECTION + "get-by-id/" + id),

  // collectionGetByStoreId: async (id: string): Promise<any> =>
  //   await apiIns.get(PRODUCT_COLLECTION + "get-by-store-id/" + id),
};
