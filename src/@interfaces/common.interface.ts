export interface IObject {
	[key: string]: any;
}

export type IColors = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

export interface IFilePayload {
	id?: string;
	bucketName?: string;
	fileName?: string;
	fileType?: string;
	previewUrl?: string;
	productId?: string | null;
	productVariantId?: string | null;
}

export interface IDivision {
	division_id: string;
	division_name_eng: string;
	division_name_bng: string;
}

export interface IDistrict {
	division_id: string;
	zilla_id: string;
	zilla_name_eng: string;
	zilla_name_bng: string;
}

export interface IRequestMeta {
	offset?: number;
	prevOffset?: number;
	nextOffset?: number;
	limit?: number;
	totalRecords?: number;
	resultCount?: number;
	totalPageCount?: number;
	sort?: {
		order?: string;
		field?: string;
	}[];
}

export interface IStatus {
	description: string;
	id: string;
	isChecked: boolean;
	isDefault: boolean;
	isEditable: boolean;
	metaKey: string;
	metaType: string;
	serial: number;
	title: string;
}

export interface IPaymentMetaType {
	id: string;
	title: string;
	metaType: string;
	metaKey: string;
	isDefault: boolean;
	serial: number;
}

export interface IPaymentConfigured {
	id: string;
	gatewayProvider: string;
	isActive: boolean;
	isSandbox: boolean;
	isOffline: boolean;
	secretKey?: string;
	secretPwd?: string;
	storeId: string;
	banner?: string;
}

export interface IPaymentSupported {
	id: string;
	isDefault: boolean;
	gatewayProvider?: string;
	metaKey: string;
	metaType: string;
	title: string;
	banner?: string;
}

export interface ISenderEmail {
	id?: string;
	storeId?: string;
	email: string;
}

export interface IDeveloper {
	firstName: string;
	lastName: string;
	companyName: string;
	supportEmail: string;
	supportPhone: string;
	privacyPolicy: string;
}

// for extends with other interface
export interface IMeta {
	meta: {
		offset?: number;
		prevOffset?: number;
		nextOffset?: number;
		limit?: number;
		totalRecords?: number;
		resultCount?: number;
		totalPageCount?: number;
		sort: [
			{
				order: string;
				field: string;
			}
		];
	};
}
