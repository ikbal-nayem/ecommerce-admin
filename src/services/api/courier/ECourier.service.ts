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

interface IECourierStoreInfoCreate {
  id: string;
  storeId: string;
  ep_name: string;
  pick_contact_person: string;
  pick_division: string;
  pick_district: string;
  pick_thana: string;
  pick_union: string;
  pick_address: string;
  pick_mobile: string;
  ep_id: number;
  pick_hub: number;
  accountNo: string;
  bankName: string;
  bankBranch: string;
  accountHolderName: string;
  accountRouteNo: string;
  bkash: string;
  bkashType: string;
  rocket: string;
  rocketType: string;
}

interface IEcourierPlaceOrder {
  id: string;
  recipient_name: string;
  recipient_mobile: string;
  recipient_division: string;
  recipient_city: string;
  recipient_area: string;
  recipient_thana: string;
  recipient_union: string;
  recipient_address: string;
  package_code: string;
  payment_method: number;
  product_id: string;
  comments: string;
  pgwid: string;
  pgwtxn_id: string;
}

interface IPostCodeList {
  city: string;
  thana: string;
}

export const ECourierService = {
  eCourierPlaceOrder: async (payload: IEcourierPlaceOrder): Promise<any> => {
    return await apiIns.post(ORDER_SERVICE + "ecourier-order/create", payload);
  },
  eCourierOrderTrack: async (ecr: string): Promise<any> => {
    return await apiIns.get(ORDER_SERVICE + "ecourier-order/track/" + ecr);
  },
  eCourierGetOrderPlaceInfo: async (id: string): Promise<any> => {
    return await apiIns.get(
      ORDER_SERVICE + "ecourier-order/getByOrderId/" + id
    );
  },
  eCourierStoreInfo: async (): Promise<any> => {
    return await apiIns.get(ORDER_SERVICE + "ecourier-store-info/get");
  },
  eCourierStoreInfoCreate: async (
    payload: IECourierStoreInfoCreate
  ): Promise<any> => {
    return await apiIns.post(
      ORDER_SERVICE + "ecourier-store-info/create",
      payload
    );
  },
  eCourierPackageList: async (): Promise<any> => {
    return await apiIns.get(ORDER_SERVICE + "ecourier/packages-list");
  },
  eCourierBranchList: async (): Promise<any> => {
    return await apiIns.get(ORDER_SERVICE + "ecourier/branch-list");
  },
  eCourierCity: async (): Promise<any> => {
    return await apiIns.get(ORDER_SERVICE + "ecourier/city-list");
  },
  eCourierThana: async (city: string): Promise<any> => {
    return await apiIns.get(ORDER_SERVICE + "ecourier/thana-list/" + city);
  },
  eCourierPostcode: async ({ city, thana }: IPostCodeList): Promise<any> => {
    return await apiIns.get(
      ORDER_SERVICE + "ecourier/postcode-list/" + city + "/" + thana
    );
  },
  eCourierAreaList: async (postcode: string): Promise<any> => {
    return await apiIns.get(ORDER_SERVICE + "ecourier/area-list/" + postcode);
  },
};
