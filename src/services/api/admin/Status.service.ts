import { SETTING_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";
import { IRequestMeta, IStatus } from "@interfaces/common.interface";
import { mergeBodyWithStoreId } from "services/utils/localStorageData.service";


export interface IStatusRequestPayload {
  meta?: IRequestMeta;
  body?: IStatus;
}

const defaultPayload = {
  "meta": {
    "offset": 0,
    "limit": 1000,
    "sort": [
      {
        "order": "asc",
        "field": "sl"
      }
    ]
  },
  body: {}
};


export const StatusService = {
	getPaymentStatus: async (statuspayload = defaultPayload): Promise<any> =>
		await apiIns.get(
			SETTING_SERVICE + "order-settings/payment-status-list",
			mergeBodyWithStoreId(statuspayload)
		),

	createPaymentStatus: async (statusPayload: IStatus): Promise<any> =>
		await apiIns.post(
			SETTING_SERVICE + "store-payment-status-types/create",
			statusPayload
		),

	getOrderStatus: async (statuspayload = defaultPayload): Promise<any> =>
		await apiIns.get(
			SETTING_SERVICE + "order-settings/order-status-list",
			mergeBodyWithStoreId(statuspayload)
		),

	createOrderStatus: async (
		statusPayload: IStatusRequestPayload
	): Promise<any> =>
		await apiIns.post(
			SETTING_SERVICE + "store-order-status-types/create",
			statusPayload
		),
};
