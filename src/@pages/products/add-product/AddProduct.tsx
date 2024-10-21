import { FormHeader, WxFormFooter } from '@components/FormLayout';
import MainLg from '@components/MainContentLayout/MainLg';
import { yupResolver } from '@hookform/resolvers/yup';
import { IObject } from '@interfaces/common.interface';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { PRODUCT } from 'routes/path-name.route';
import { ICategoryPayload } from 'services/api/products/Category.services';
import { ICollectionPayload } from 'services/api/products/Collection.services';
import './AddProduct.scss';
import ProductDimension from './products-form/ProductDimension/ProductDimension';
import ProductInfo from './products-form/ProductInfo/ProductInfo';
import ProductMedia from './products-form/ProductMedia/ProductMedia';
import ProductOption from './products-form/ProductOption/ProductOption';
import ProductPricing from './products-form/ProductPricing/ProductPricing';
import ProductStock from './products-form/ProductStock/ProductStock';
import ProductVariants from './products-form/ProductVariants/ProductVariants';
import SaveProducts from './save-product/SaveProduct';
import schema, { defaultValues } from './validation';

const AddProducts = () => {
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [selectedCategory, setSelectedCategory] = useState<ICategoryPayload>({});
	const [selectedCollections, setSelectedCollections] = useState<ICollectionPayload[]>([]);
	const navigate = useNavigate();
	const methods = useForm({
		mode: 'onChange',
		resolver: yupResolver(schema),
		defaultValues,
	});

	useEffect(() => {
		methods.setValue('collections', [...selectedCollections]);
	}, [selectedCollections]);

	const categorySetter = (category: ICategoryPayload) => {
		setSelectedCategory(category);
		methods.setValue('categoryId', category?._id);
	};

	const onCollectionSelect = (collection: ICollectionPayload) => {
		const newCollections = [...selectedCollections];
		const idx = newCollections.findIndex((val) => val._id === collection._id);
		idx >= 0 ? newCollections.splice(idx, 1) : newCollections.push(collection);
		setSelectedCollections(newCollections);
	};

	const onRemoveCollection = (idx: number) => {
		const newCollections = [...selectedCollections];
		newCollections.splice(idx, 1);
		setSelectedCollections(newCollections);
	};

	const onSubmit = (data: IObject) => {
		console.log(data);

		// const errorParams = Object.keys(methods.formState.errors);
		// if (errorParams?.length) {
		// 	const errObj = getFirstErrorObj(methods.formState.errors);
		// 	methods.setFocus(errObj?.ref?.name);
		// 	ToastService.error(errObj?.message);
		// 	return;
		// }
		// setIsSaving(true);
		// const images: any = data?.images;
		// delete data?.images;
		// const formData = new FormData();
		// formData.append('body', JSON.stringify(data));
		// Object.keys(images).forEach((img) => formData.append('files', images[img]));
		// ProductService.createProduct(formData)
		// 	.then((resp) => {
		// 		ToastService.success(resp.message);
		// 		navigate(PRODUCT);
		// 	})
		// 	.catch((err) => ToastService.error(err.message))
		// 	.finally(() => setIsSaving(false));
	};

	return (
		<MainLg>
			<FormHeader noMargin title='Add Product' backNavigationLink={PRODUCT} />
			<FormProvider {...methods}>
				<form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
					<div className='row mb-4'>
						<div className='col-lg-8 col-md-7 col-sm-12'>
							<ProductInfo />
							<ProductMedia />
							<ProductPricing />
							<ProductDimension />
							<ProductStock />
							<ProductOption />
							<ProductVariants />
							{/* <SearchEngine /> */}
						</div>
						<div className='col-lg-4 col-md-5 col-sm-12'>
							<SaveProducts
								selectedCategory={selectedCategory}
								selectedCollections={selectedCollections}
								categorySetter={categorySetter}
								onCollectionSelect={onCollectionSelect}
								onRemoveCollection={onRemoveCollection}
								isSaving={isSaving}
							/>
						</div>
					</div>
					<WxFormFooter title='Unsaved Changes' saveButtonText='Save product' isSaving={isSaving} />
				</form>
			</FormProvider>
			{/* <ManageVendor drawerOpen={drawerOpen} handleClose={handleClose} /> */}
			{/* </WxFormContainer> */}
		</MainLg>
	);
};

export default AddProducts;
