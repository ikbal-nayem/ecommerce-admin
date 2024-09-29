export const searchParamsToObject = (searchParams) => {
	let params = {};
	searchParams.forEach(
		(item: string, key: string) => item !== "null" && (params[key] = item)
	);
	return params;
};
