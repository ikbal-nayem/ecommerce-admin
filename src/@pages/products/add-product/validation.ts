import { IObject } from '@interfaces/common.interface';
import { isNull } from 'utils/check-validity';
import * as yup from 'yup';

export const getProductdefaultValues = (val?: IObject) => ({
	name: val?.name || '',
	description: val?.description || '',
	summary: val?.summary || '',
	hasVariants: !isNull(val?.hasVariants) ? val?.hasVariants : false,
	price: val?.price || 0,
	discountPrice: val?.discountPrice || 0,
	costPrice: val?.costPrice || 0,
	height: val?.height || 0,
	heightUnit: val?.heightUnit || 'cm',
	width: val?.width || 0,
	widthUnit: val?.widthUnit || 'cm',
	weight: val?.weight || 0,
	weightUnit: val?.weightUnit || 'gm',
	options: val?.options || [],
	variants: val?.variants || [],
	sku: val?.sku || '',
	trackStock: !isNull(val?.trackStock) ? val?.trackStock : true,
	stock: val?.stock || 0,
	category: val?.category || {},
	collections: val?.collections || [],
	tags: val?.tags || [''],
	images: val?.images || [],
	isActive: val?.isActive || false,
});

const schema = yup
	.object({
		name: yup
			.string()
			.required('Please provide a product title')
			.max(160, 'Title must be less than 160 characters'),
		price: yup
			.number()
			.positive()
			.required('Please provide product price')
			.typeError('Must specify a number')
			.min(0, 'Min value 0'),
		discountPrice: yup
			.number()
			.positive()
			.typeError('Must specify a number')
			.min(0, 'Provide a positive number'),
		// comparePrices: yup.bool().when(["discountPrice", "price"], {
		// 	is: (sPrice: number, rPrice: number) =>
		// 		+rPrice && Number(sPrice) >= Number(rPrice),
		// 	then: yup
		// 		.bool()
		// 		.required("'Selling price' should be less than 'Compare at price'"),
		// }),
		costPrice: yup
			.number()
			.positive()
			.min(0, 'Min value 0')
			.nullable()
			.transform((_, val) => (val === Number(val) ? val : null)),
		height: yup
			.number()
			.positive()
			.min(0, '')
			.nullable()
			.transform((_, val) => (val === Number(val) ? val : null)),
		weight: yup
			.number()
			.positive()
			.min(0, '')
			.nullable()
			.transform((_, val) => (val === Number(val) ? val : null)),
		width: yup
			.number()
			.positive()
			.min(0, '')
			.nullable()
			.transform((_, val) => (val === Number(val) ? val : null)),
		quantity: yup
			.number()
			.positive()
			.min(0, 'Set a quantity')
			.nullable()
			.transform((_, val) => (val === Number(val) ? val : null)),
		sku: yup.string().required(),
	})
	.required();

export default schema;
