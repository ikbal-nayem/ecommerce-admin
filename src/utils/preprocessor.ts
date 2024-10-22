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
				} else if (data[key] instanceof Array || data[key] instanceof Object) {
					fd.append(key, JSON.stringify(data[key]));
					return;
				}
				fd.append(key, data[key]);
			})
		).then(() => resolve(fd));
	});

export const makeRequestFormData = (reqData: IObject) => {
	let data = { ...reqData };
	const fd = new FormData();
	Object.keys(data).forEach((key) => {
		if (data[key] instanceof File) {
			fd.append(key, data[key]);
			delete data[key];
		} else if (data[key] instanceof FileList) {
			for (const f of Object.values(data[key])) fd.append(key, f);
			delete data[key];
		}
	});
	fd.append('data', JSON.stringify(data));
	return fd;
};
