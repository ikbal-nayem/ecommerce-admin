export interface IDowngradeStatus {
	plan?: {
		id: string;
		title: string;
		productImageCount: number;
		hasProductVariant: boolean;
		hasCustomDomain: boolean;
		freeThemes: string;
		isPremiumThemesPayable: boolean;
		freePlugins: string;
		isPremiumPluginPayable: boolean;
		isStoreManagementAppPayable: boolean;
		storeOperatorCount: number;
		monthlyTrafficCount: number;
		isPosPayable: boolean;
		hasManualOrder: boolean;
		hasFacebookPixel: boolean;
		hasGoogleAnalytics: boolean;
		isWholesaleEnabled: boolean;
	};
	checks?: {
		isStoreOperatorCheckPassed: boolean;
		isProductImageCheckPassed: boolean;
		isProductVariationCheckPassed: boolean;
		isThemeCheckPassed: boolean;
		isAppCheckPassed: boolean;
	};
	isOverallPassed?: boolean;
	isLoading?: boolean;
}
