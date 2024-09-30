export const ENV = {
	TYPE: import.meta.env.MODE,
	ApiEndpoint: import.meta.env.VITE_BASE_URL,
	LocalBaseURL: import.meta.env.VITE_LOCAL_BASE_URL,
	AppURL: import.meta.env.VITE_BASE_URL_APP,
	LandingPageURL: import.meta.env.VITE_LANDING_PAGE,
	IMAGE_BASE_URL: import.meta.env.VITE_IMAGE_BASE_URL,
	FONT_BASE_URL: import.meta.env.VITE_FONT_BASE_URL,
	MENU_LIST_LEVEL: import.meta.env.VITE_MENU_LEVEL,
	STORE_DOMAIN: import.meta.env.VITE_STORE_DOMAIN,
};
