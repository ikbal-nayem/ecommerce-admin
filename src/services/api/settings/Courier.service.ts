import { ORDER_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";

export interface IMakeConfigured {
  storeId: string;
  courierProvider: string;
  isWebxSubMerchant: boolean;
  apiKey: string;
  apiSecret: string;
  userId: string;
  isSandbox: boolean;
  isActive: boolean;
}

interface IUpdateCourier {
  id: string;
  // title: string;
  storeId: string;
  courierProvider: string;
  isWebxSubMerchant?: boolean;
  isSandbox?: boolean;
  apiKey?: string;
  apiSecret?: string;
  userId?: string;
  isActive: boolean;
  // banner: string;
}

export const CourierService = {
  makeConfigure: async (payload: IMakeConfigured): Promise<any> => {
    return await apiIns.post(ORDER_SERVICE + "courier/create", payload);
  },
  getConfigured: async (): Promise<any> => {
    return await apiIns.get(ORDER_SERVICE + "courier/get-configured");
  },

  getConfiguredData: async (payload: string): Promise<any> => {
    return await apiIns.get(ORDER_SERVICE + "courier/get/" + payload);
  },
  update: async (payload: IUpdateCourier): Promise<any> => {
    return await apiIns.put(ORDER_SERVICE + "courier/update", payload);
  },

  getSupported: async (): Promise<any> => {
    return await apiIns.get(ORDER_SERVICE + "courier/get-supported");
  },
  delete: async (courierProvider: string): Promise<any> => {
    return await apiIns.delete(
      ORDER_SERVICE + "courier/remove/" + courierProvider
    );
  },
};
