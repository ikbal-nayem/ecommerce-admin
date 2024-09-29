import { EMAIL_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";
import { ISenderEmail } from "@interfaces/common.interface";
import { mergePayloadWithStoreId } from "services/utils/localStorageData.service";

export const EmailService = {
	getMySenderEmail: async (): Promise<any> =>
		await apiIns.get(EMAIL_SERVICE + "/smtp-info/get-my-sender-email"),

	saveSenderEmail: async (payload: ISenderEmail): Promise<any> =>
		await apiIns.post(
			EMAIL_SERVICE + "/smtp-info/save-sender-email",
			mergePayloadWithStoreId(payload)
		),
};
