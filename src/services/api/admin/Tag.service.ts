import { ADMIN_SERVICE } from "config/api-constant";
import { apiIns } from "config/api.config";
import { IRequestMeta } from "@interfaces/common.interface";

export interface ITagBody {
	id?: string | number;
	name?: string;
	label?: string;
}

export interface ITagRequestPayload {
	meta?: IRequestMeta;
	body?: ITagBody;
}

const defaultPayload = {
	meta: {
		offset: 0,
		limit: 10,
		sort: [
			{
				field: "name",
				order: "asc",
			},
		],
	},
	body: {},
};

export const TagService = {
	tagList: async (
		tagPayload: ITagRequestPayload = defaultPayload
	): Promise<any> =>
		await apiIns.post(ADMIN_SERVICE + "tag/get-list", tagPayload),

	tagCreate: async (tagPayload: ITagBody): Promise<any> =>
		await apiIns.post(ADMIN_SERVICE + "tag/create", tagPayload),

	tagDelete: async (tagDeletePayload: string[]): Promise<any> =>
		await apiIns.post(ADMIN_SERVICE + "tag/delete-all", tagDeletePayload),
};
