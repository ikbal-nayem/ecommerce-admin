import * as yup from 'yup';

export const defaultValues = {
	name: '',
	price: 0,
	discountPrice: 0,
	costPrice: 0,
	stock: 0,
	// hasSummary: false,
	hasDimension: false,
	heightUnit: 'cm',
	widthUnit: 'cm',
	weightUnit: 'gm',
	hasVariant: false,
	trackStock: true,
	isOverselling: false,
	isActive: false,
	categoryId: '',
	collections: [],
	tags: '',
	images: [],
};

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
			.min(0, 'Min value 0')
			.nullable(true),
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
			.nullable(true)
			.transform((_, val) => (val === Number(val) ? val : null)),
		height: yup
			.number()
			.positive()
			.min(0, '')
			.nullable(true)
			.transform((_, val) => (val === Number(val) ? val : null)),
		weight: yup
			.number()
			.positive()
			.min(0, '')
			.nullable(true)
			.transform((_, val) => (val === Number(val) ? val : null)),
		width: yup
			.number()
			.positive()
			.min(0, '')
			.nullable(true)
			.transform((_, val) => (val === Number(val) ? val : null)),
		quantity: yup
			.number()
			.positive()
			.min(0, 'Set a quantity')
			.nullable(true)
			.transform((_, val) => (val === Number(val) ? val : null)),
	})
	.required();

export default schema;
