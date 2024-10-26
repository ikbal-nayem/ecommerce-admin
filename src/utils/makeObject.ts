import { IObject, IRequestPayload } from '@interfaces/common.interface';
import { isNull } from './check-validity';

export const searchParamsToObject = (searchParams: any) => {
	// It will take useSearchParams (resct-router-dom) and return an object of query params
	let params: IObject = {};
	searchParams.forEach((item: string, key: string) => !isNull(item) && (params[key] = item));
	return params;
};

export const searchParamsToReqbody = (searchParams): IRequestPayload => {
	let reqBody: IRequestPayload = { meta: { page: 1, limit: 10 }, filter: {} };
	searchParams.forEach((item: string, key: string) => {
		if (isNull(item)) return;
		if (key === 'page' || key === 'limit') reqBody.meta[key] = +item;
		else reqBody.filter[key] = item;
	});
	return reqBody;
};
