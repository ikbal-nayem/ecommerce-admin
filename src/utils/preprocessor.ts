import { IObject } from '@interfaces/common.interface';
import { compressImage } from './utils';

export const makeFormData = (data: IObject): Promise<FormData> =>
	new Promise((resolve) => {
		const fd = new FormData();
		Promise.all(
			Object.keys(data).map(async (key) => {
				if (data[key] instanceof File) {
					const file = await compressImage(data[key]);
					fd.append(key, file);
					return;
				}
				fd.append(key, data[key]);
			})
		).then(() => resolve(fd));
	});
