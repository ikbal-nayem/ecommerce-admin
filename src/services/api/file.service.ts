import { FILE } from "config/api-constant";
import { apiIns } from "config/api.config";
import { IFilePayload } from "@interfaces/common.interface";



export const FileService = {
	upload: async (file: IFilePayload): Promise<any> =>
		await apiIns.post(FILE + "public/upload", file),

	uploadAll: async (files: IFilePayload[]): Promise<any> =>
		await apiIns.post(FILE + "public/upload-all", files),

	delete: async (files: IFilePayload[]): Promise<any> =>
		await apiIns.post(FILE + "delete-all", files),
};
