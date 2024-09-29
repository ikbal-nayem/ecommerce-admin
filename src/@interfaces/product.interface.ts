import { IFilePayload } from "./common.interface";

export interface ISalesChannel {
	id?: string;
	title: string;
	metaType: string;
}

export interface IProductOption {
	value: string;
	key: string;
}

export interface IProductVariant {
	barCode: string;
	id: string;
	images: IFilePayload[];
	options: IProductOption[];
	thumbnail: string;
	quantity: number;
	regularPrice: number;
	sellingPrice: number;
	sku: string;
	status: string;
	title: string;
	variantId: string;
	subTotal: number;
}

export interface IProductTable {
	id: string;
	title: string;
	images: IFilePayload[];
	thumbnail: string;
	regularPrice: number;
	sellingPrice: number;
	status: string;
	categoryName: string;
	vendorName: string;
}