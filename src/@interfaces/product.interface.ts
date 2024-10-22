import { ICategoryPayload } from 'services/api/products/Category.services';
import { IFilePayload } from './common.interface';

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
	price: number;
	discountPrice: number;
	sku: string;
	status: string;
	title: string;
	variantId: string;
	subTotal: number;
}

export interface IProductTable {
	_id: string;
	name: string;
	images: string;
	thumbnail: string;
	price: number;
	discountPrice: number;
	isActive: boolean;
	category: ICategoryPayload;
}
