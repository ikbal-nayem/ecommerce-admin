import { FormFooter, FormHeader } from '@components/FormLayout';
import MainLg from '@components/MainContentLayout/MainLg';
import { yupResolver } from '@hookform/resolvers/yup';
import schema from '@pages/products/add-product/validation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { PRODUCT } from 'routes/path-name.route';
import { ProductService } from 'services/api/products/Product.services';
import Preloader from 'services/utils/preloader.service';
import { ToastService } from 'services/utils/toastr.service';
import { getFirstErrorObj } from 'utils/errors';
import '../add-product/AddProduct.scss';
import ProductDimension from '../add-product/products-form/ProductDimension/ProductDimension';
import ProductInfo from '../add-product/products-form/ProductInfo/ProductInfo';
import ProductMedia from '../add-product/products-form/ProductMedia/ProductMedia';
import ProductOption from '../add-product/products-form/ProductOption/ProductOption';
import ProductPricing from '../add-product/products-form/ProductPricing/ProductPricing';
import ProductStock from '../add-product/products-form/ProductStock/ProductStock';
import ProductVariants from '../add-product/products-form/ProductVariants/ProductVariants';
import SaveProducts from '../add-product/save-product/SaveProduct';

const UpdateProducts = () => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const navigate = useNavigate();
	const methods = useForm({
		resolver: yupResolver(schema),
		mode: 'onChange',
	});

	const { product_id } = useParams();

	useEffect(() => {
		if (!product_id) return;
		setIsLoading(true);
		ProductService.getById(product_id)
			.then((res) => methods.reset(res.data))
			.catch((err) => {
				ToastService.error(err.message);
				navigate(PRODUCT);
			})
			.finally(() => setIsLoading(false));
	}, [product_id]);

	const onSubmit = (data: any) => {
		const errorParams = Object.keys(methods.formState.errors);
		if (errorParams?.length) {
			const errObj = getFirstErrorObj(methods.formState.errors);
			methods.setFocus(errObj?.ref?.name);
			ToastService.error(errObj?.message);
		} else {
			setIsSaving(true);
			data?.images?.forEach((_, idx) => {
				data.images[idx].serial = idx + 1;
			});

			ProductService.updateProduct(product_id, data)
				.then((resp) => {
					ToastService.success(resp.message);
					navigate(PRODUCT);
				})
				.catch((err) => ToastService.error(err.message))
				.finally(() => setIsSaving(false));
		}
	};

	if (isLoading) return <Preloader absolutePosition loaderText='Getting product data...' />;

	return (
		<MainLg>
			<FormHeader noMargin title='Update Product' backNavigationLink={PRODUCT} />
			<FormProvider {...methods}>
				<form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
					<div className='row mb-4'>
						<div className='col-lg-8 col-md-7'>
							<ProductInfo />
							<ProductMedia isEditForm />
							<ProductPricing />
							<ProductDimension />
							<ProductStock />
							<ProductOption />
							<ProductVariants isEditForm />
						</div>
						<div className='col-lg-4 col-md-5'>
							<SaveProducts isSaving={isSaving} />
						</div>
					</div>
					<FormFooter title='Unsaved Changes' saveButtonText='Save product' isSaving={isSaving} />
				</form>
			</FormProvider>
			{/* <ManageVendor drawerOpen={drawerOpen} handleClose={handleClose} /> */}
		</MainLg>
	);
};

export default UpdateProducts;
