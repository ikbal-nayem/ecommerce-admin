import { DISCOUNT_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";
import {
  mergeBodyWithStoreId,
  mergePayloadWithStoreId,
} from "services/utils/localStorageData.service";

interface CouponList {
  meta: {};
  body: {};
}

export const DiscountService = {
  getList: async (payload: CouponList): Promise<any> =>
    await apiIns.post(
      DISCOUNT_SERVICE + "coupon/get-list",
      mergeBodyWithStoreId(payload)
    ),

  getById: async (payload: { id: any; storeId?: string }): Promise<any> =>
    await apiIns.post(
      DISCOUNT_SERVICE + "coupon/get-by-id",
      mergePayloadWithStoreId(payload)
    ),

  fullUpdate: async (payload: any): Promise<any> =>
    apiIns.put(DISCOUNT_SERVICE + "coupon/full-update", payload),

  update: async (payload: any): Promise<any> =>
    apiIns.put(DISCOUNT_SERVICE + "coupon/update", payload),

  deleteCoupon: async (payload: string[]): Promise<any> =>
    await apiIns.post(DISCOUNT_SERVICE + "coupon/delete-all", payload),

  addCoupon: async (payload: {}): Promise<any> =>
    await apiIns.post(
      DISCOUNT_SERVICE + "coupon/add",
      mergePayloadWithStoreId(payload)
    ),
  // editCoupon:async (payload:{}):Promise<any> =>
  // await apiIns.put(
  //   DISCOUNT_SERVICE+'coupon/full-update'
  // )
};
