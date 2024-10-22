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

export const makeRequestFormData = (reqData: IObject, multiFileKeys?: Array<string>): Promise<FormData> =>
	new Promise((resolve) => {
		let data = { ...reqData };
		const fd = new FormData();
		Promise.all(
			Object.keys(data).map(async (key) => {
				if (multiFileKeys?.includes(key)) {
					for (const [i, f] of data[key].entries()) {
						if (!(f instanceof File)) return;
						const file = await compressImage(f);
						fd.append(key, file);
						data[key].splice(i, 1);
					}
				} else if (data[key] instanceof File) {
					const file = await compressImage(data[key]);
					fd.append(key, file);
					delete data[key];
				} else if (data[key] instanceof FileList) {
					for (const f of Object.values(data[key])) {
						const file = await compressImage(f);
						fd.append(key, file);
					}
					delete data[key];
				}
			})
		).then(() => {
			fd.append('data', JSON.stringify(data));
			resolve(fd);
		});
	});
