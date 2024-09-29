import { apiIns } from "config/api.config";

export const LocationService = {
	getCountry: async (): Promise<any> =>
		apiIns.get("auth-service/location/public/get-countries"),

	getDivision: async (countryId: string): Promise<any> =>
		apiIns.get("auth-service/location/public/get-divisions/" + countryId),

	getDistrict: async (countryId: string, divisionId: string): Promise<any> =>
		apiIns.get(
			`auth-service/location/public/get-districts/${countryId}/${divisionId}`
		),

	getThana: async (countryId: string, districtId: string): Promise<any> =>
		apiIns.get(
			`auth-service/location/public/get-upazilas/${countryId}/${districtId}`
		),
};
