import { ORDER_SERVICE, SETTING_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";
import { IOrderSettingsResponse } from "@interfaces/order.interface";

export const OrderSettingService = {
  getSettingsList: async (): Promise<any> =>
    await apiIns.post(SETTING_SERVICE + "order-settings/sync-and-get"),

  update: async (payload: IOrderSettingsResponse): Promise<any> =>
    await apiIns.put(SETTING_SERVICE + "order-settings/update", payload),

  getInvoiceDtls: async (payload: {
    id: string;
    storeId: string;
  }): Promise<any> =>
    await apiIns.post(ORDER_SERVICE + "order/get-invoice-details", payload),

  // getStoreAddress: async (): Promise<any> =>
  // 	await apiIns.get(
  // 		SETTING_SERVICE + "store-warehouse/get-by-store-id/" + storeId
  // 	),

  // update: async (payload: any): Promise<any> =>
  // 	apiIns.put(SETTING_SERVICE + "store/update", {
  // 		...payload,
  // 		id: storeId,
  // 	}),

  // storeAddressUpdate: async (payload: any): Promise<any> =>
  // 	apiIns.put(SETTING_SERVICE + "store-warehouse/update", {
  // 		...payload,
  // 		storeId: storeId,
  // 	}),
};
