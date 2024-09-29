import { SETTING_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";

export const DashboardService = {
  getStaticContent: async (): Promise<any> => {
    return await apiIns.get(SETTING_SERVICE + "dashboard/static-contents");
  },
  orderSummery: async (payload: { from: string; to: string }): Promise<any> => {
    return await apiIns.get(
      SETTING_SERVICE + `dashboard/order-summary/${payload.from}/${payload.to}`
    );
  },
};
