import { SETTING_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";

interface ISalesHistory {
  startDate: string | Date;
  endDate: string | Date;
}

export const AnalyticsService = {
  topProducts: async ({ startDate, endDate }: ISalesHistory): Promise<any> =>
    await apiIns.get(
      SETTING_SERVICE +
        `analytics/top-products-by-unit-sold/${5}/${startDate}/${endDate}`
    ),
  salesHistory: async ({ startDate, endDate }: ISalesHistory): Promise<any> =>
    await apiIns.get(
      SETTING_SERVICE + `analytics/sales-history/${startDate}/${endDate}`
    ),
  totalOrder: async ({ startDate, endDate }: ISalesHistory): Promise<any> =>
    await apiIns.get(
      SETTING_SERVICE + `analytics/total-order/${startDate}/${endDate}`
    ),
  topLandingPages: async ({
    startDate,
    endDate,
  }: ISalesHistory): Promise<any> =>
    await apiIns.get(
      SETTING_SERVICE + `analytics/top-landing-pages/5/${startDate}/${endDate}`
    ),
  conversionRate: async ({ startDate, endDate }: ISalesHistory): Promise<any> =>
    await apiIns.get(
      SETTING_SERVICE + `analytics/conversion-rate/${startDate}/${endDate}`
    ),

  avgSalesHistory: async ({
    startDate,
    endDate,
  }: ISalesHistory): Promise<any> =>
    await apiIns.get(
      SETTING_SERVICE + `analytics/avg-sales-history/${startDate}/${endDate}`
    ),
};
