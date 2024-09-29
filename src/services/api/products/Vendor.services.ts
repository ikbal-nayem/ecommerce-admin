import { PRODUCT_VENDOR } from "config/api-constant";
import { apiIns } from "config/api.config";
import { IRequestMeta } from "@interfaces/common.interface";

export interface IVendorPayload {
  id?: string;
  storeId?: string;
  name?: string;
  isWebxUser?: boolean;
  userId?: string;
}

export interface IVendorReadPayload {
  meta: IRequestMeta;
  body: IVendorPayload;
}

export interface IVendorResponse {
  timestamp: string;
  status: number;
  message: string;
  body: IVendorPayload[];
  meta: IRequestMeta;
}

const defaultRequest = {
  meta: {},
  body: {
    storeId: "",
    name: "",
  },
};

export const VendorService = {
  create: async (payload: IVendorPayload): Promise<any> =>
    await apiIns.post(PRODUCT_VENDOR + "create", payload),

  get: async (payload: IVendorReadPayload = defaultRequest): Promise<any> =>
    await apiIns.post(PRODUCT_VENDOR + "get-list", payload),

  update: async (payload: any): Promise<any> =>
    await apiIns.put(PRODUCT_VENDOR + "update", payload),

  delete: async (ids: string[]): Promise<any> =>
    await apiIns.put(PRODUCT_VENDOR + "delete-all", ids),

  vendorGetById: async (id: string): Promise<any> =>
    await apiIns.get(PRODUCT_VENDOR + "get-by-id/" + id),
};
