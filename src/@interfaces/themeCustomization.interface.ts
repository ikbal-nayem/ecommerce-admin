import { IDeveloper, IFilePayload } from "./common.interface";

export interface ISlider {
	id?: string;
	isActive: boolean;
	storeId: string;
	title: string;
	thumbnail: string;
	lastUpdated: number;
}

export interface ISliderItem {
	id?: string;
	buttonTitle: string;
	buttonUrl: string;
	description: string;
	hasButton: boolean;
	isActive: boolean;
	sliderId: string;
	storeId: string;
	subTitle: string;
	title: string;
	image: IFilePayload;
	serial: number;
	isExternal?: boolean;
	type?: "image" | "video" | null;
	url?: string;
}

export interface ITheme {
	id: string;
	developerId: string;
	title: string;
	shortDesc: string;
	longDesc: string;
	srcPath: string;
	webLink: string;
	videoLink: string;
	themeIcon: string;
	tags: string;
	screenshots: IFilePayload[];
	freeTrails: number;
	themeProperties: {
		hello1: string;
	};
	packageLevel: number;
	avgRating: number;
	totalReview: number;
	billingCycleName: string;
	currencyCode: string;
	currencySymbol: string;
}

export interface IThemeRelease {
	totalUsers: number;
	totalInstalledUser: boolean;
	fileUploadDate: number;
	lastUploadDate: number;
	lastVersion: number;
	tags: string;
	developer: IDeveloper;
}

export interface IThemeInstalled {
	id: string;
	storeId: string;
	themeId: string;
	installedPath: string;
	firstPaymentAmount: number;
	recurringAmount: number;
	billingCycleValidityDays: number;
	isActive: boolean;
	themeRegisterDTO: ITheme;
}

export interface IThemeTypography {
	fontFamily: string;
	fontStyle: string;
	fontWeight: string;
}

export interface IThemeFooter {
	columnCount: number;
	contents: {
		menuSetId: string;
		hasSocialMediaIcons: boolean;
		serial: number;
	}[];
	paymentIcons: IFilePayload[];
	copyright: string;
}

export interface IThemeSettings {
	homePage: {
		sliderId: string;
	};
	socialPage: {
		facebook: string;
		instagram: string;
		twitter: string;
		youtube: string;
		linkedin: string;
		tiktok: string;
	};
	typography: {
		title: IThemeTypography;
		body: IThemeTypography;
	};
	footer: IThemeFooter;
}
