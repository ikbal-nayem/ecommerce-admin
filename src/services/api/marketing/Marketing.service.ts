import { MARKETING_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";
import { IMeta } from "@interfaces/common.interface";
import {
  mergeBodyWithStoreId,
  mergePayloadWithStoreId,
} from "services/utils/localStorageData.service";

interface ISMSCampaign {
  name: string;
  deliveryTime: string;
  status: string;
  smsBody: string;
  expectedAudience: number;
  storeId: string;
  audienceIds: [string];
}

interface ICampaignFilteredData extends IMeta {
  body: {
    id?: string;
    name?: string;
    deliveryTime?: string;
    status?: string;
    smsBody?: string;
    expectedAudience?: number;
    storeId?: string;
    title?: string;
    type?: string;
    audienceIds?: [string];
  };
}

interface IAudienceFilteredData extends IMeta {
  body: {
    id?: string;
    title?: string;
    description?: string;
    type?: string;
    totalContact?: number;
    storeId?: string;
  };
}

interface ICreateSMSAudience {
  audience: {
    description: string;
    title: string;
  };
  audienceContact: any[];
}

interface IAudienceUpdate {
  id: string;
  title: string;
  description: string;
}

export const MarketingService = {
  // campaigns

  createSMSCampaign: async (smsCampaign: ISMSCampaign): Promise<any> =>
    await apiIns.post(
      MARKETING_SERVICE + "sms-campaign/create",
      mergePayloadWithStoreId(smsCampaign)
    ),
  getSMSCampaignList: async (filterData: ICampaignFilteredData): Promise<any> =>
    await apiIns.post(
      MARKETING_SERVICE + "sms-campaign/get-list",
      mergeBodyWithStoreId(filterData)
    ),
  updateSMSCampaign: async (updateData: ISMSCampaign): Promise<any> =>
    await apiIns.put(MARKETING_SERVICE + "sms-campaign/update", updateData),
  // audience

  createSMSAudience: async (
    audienceSMSCreate: ICreateSMSAudience
  ): Promise<any> =>
    await apiIns.post(
      MARKETING_SERVICE + "sms-audience/create",
      audienceSMSCreate
    ),
  getAudienceList: async (filterData?: IAudienceFilteredData): Promise<any> =>
    await apiIns.post(
      MARKETING_SERVICE + "audience/get-list",
      mergeBodyWithStoreId(filterData)
    ),
  audienceUpdate: async (updatedData: IAudienceUpdate): Promise<any> =>
    await apiIns.put(MARKETING_SERVICE + "audience/update", updatedData),
};
