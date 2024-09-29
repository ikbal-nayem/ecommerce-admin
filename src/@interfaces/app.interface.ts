import { IDeveloper, IFilePayload } from "./common.interface";
import { ITheme } from "./themeCustomization.interface";

export interface IInstalledApp {
	id: string;
	storeId: string;
	appId: string;
	firstPaymentAmount: number;
	recurringAmount: number;
	billingCycleValidityDays: number;
	isActive: boolean;
	appRegisterDTO: IAppDetails;
}

export interface IAppDetails {
	id: string;
	appTitle: string;
	appTypesDTO: {
		id: string;
		sl: number;
	};
	billingCycleName: string;
	shortDesc: string;
	longDesc: string;
	webLink: string;
	srcPath: string;
	appProperties: {
		hello1: string;
	};
	videoLink: string;
	setupForm: string;
	screenshots: IFilePayload[];
	tags: string;
	freeTrails: number;
	appIconPath: string;
	fileName: string;
	avgRating: number;
	totalReview: number;
	packageLevel: number;
	recurringAmount: number;
	firstPayAmount: number;
}

export interface IAppInfo {
	totalUsers: number;
	totalInstalledUser: number;
	fileUploadDate: number;
	lastUploadDate: number;
	lastVersion: number;
	tags: string;
	developer: IDeveloper;
}

export interface IAppPricing {
	appId: string;
	billingCycleId: string;
	billingCycleName: string;
	billingCycleValidity: string;
	currencyCode: string;
	currencyId: string;
	currencyName: string;
	currencySymbol: string;
	firstPayAmount: number;
	id: string;
	packageDesc: string;
	recurringAmount: number;
	remarks: string;
	subTitle: string;
	title: string;
}

export interface IAppRatingCount {
	ratingOne: number;
	ratingTwo: number;
	ratingThree: number;
	ratingFour: number;
	ratingFive: number;
}

export interface IRatingPreview {
	star: number;
	rating: number;
	progressWidth: number;
}

export interface IReview {
	id: string;
	themeRegisterDTO: ITheme;
	isPublish: boolean;
	themeId: string;
	rating: number;
	ratingMax: number;
	reviewMsg: string;
	reviewVideo: string;
	userIcon: string;
	firstName: string;
	lastName: string;
	email: string;
	genderTypes: string;
	reactionCountDTO: {
		helpFull: number;
		notHelpFull: number;
	}[];
}