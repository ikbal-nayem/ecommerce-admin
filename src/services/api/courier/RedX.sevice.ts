import { ORDER_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";

interface IPlaceOrder {
  id: string;
  storeId: string;
  orderId: string;
  trackingId: string;
  customerName: string;
  customerPhone: string;
  deliveryArea: string;
  deliveryAreaId: number;
  address: string;
  merchantInvoiceId: string;
  cashCollectionAmount: string;
  parcelWeight: number;
  instruction: string;
  value: number;
  parcelDetail: [
    {
      name: string;
      category: string;
      value: string;
    }
  ];
}

export const RedXService = {
  getRedXAreaList: async (): Promise<any> => {
    return await apiIns.get(ORDER_SERVICE + "redx-order/areas");
  },
  redXPlaceOrder: async (payload: IPlaceOrder): Promise<any> => {
    return await apiIns.post(ORDER_SERVICE + "redx-order/place-order", payload);
  },
  redXPlaceOrderInfo: async (orderId: string): Promise<any> => {
    return await apiIns.get(
      ORDER_SERVICE + "redx-order/get-by-order-id/" + orderId
    );
  },
  tackOrder: async (trackId: string): Promise<any> => {
    return await apiIns.get(ORDER_SERVICE + "redx-order/track/" + trackId);
  },
};
