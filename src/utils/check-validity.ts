import { IObject } from '@interfaces/common.interface';

const isValidUrl = (url: string) => {
	url = url.trim();
	var pattern = new RegExp(
		'^(https?:\\/\\/)?' +
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
			'((\\d{1,3}\\.){3}\\d{1,3}))' +
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
			'(\\?[;&a-z\\d%_.~+=-]*)?' +
			'(\\#[-a-z\\d_]*)?$',
		'i'
	);
	return !!pattern.test(url);
};

export const isObjectNull = (object: IObject | null | undefined) => !Object.keys(object || {})?.length;

export const isListNull = (li: Array<IObject | string | number | null | undefined> | null | undefined) =>
	!li || li?.length <= 0;

export default isValidUrl;
