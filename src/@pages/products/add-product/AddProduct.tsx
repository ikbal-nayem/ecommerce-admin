import { FormHeader, FormFooter } from '@components/FormLayout';
import MainLg from '@components/MainContentLayout/MainLg';
import { yupResolver } from '@hookform/resolvers/yup';
import { IObject } from '@interfaces/common.interface';
import useLoader from 'hooks/useLoader';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { PRODUCT } from 'routes/path-name.route';
import { ProductService } from 'services/api/products/Product.services';
import { ToastService } from 'services/utils/toastr.service';
import { isNull } from 'utils/check-validity';
import { makeRequestFormData } from 'utils/preprocessor';
import './AddProduct.scss';
import ProductDimension from './products-form/ProductDimension/ProductDimension';
import ProductInfo from './products-form/ProductInfo/ProductInfo';
import ProductMedia from './products-form/ProductMedia/ProductMedia';
import ProductOption from './products-form/ProductOption/ProductOption';
import ProductPricing from './products-form/ProductPricing/ProductPricing';
import ProductStock from './products-form/ProductStock/ProductStock';
import ProductVariants from './products-form/ProductVariants/ProductVariants';
import SaveProducts from './save-product/SaveProduct';
import schema, { getProductdefaultValues } from './validation';

const AddProducts = () => {
	const [isSaving, setIsSaving] = useLoader(false);
	const navigate = useNavigate();
	const methods = useForm({
		mode: 'onChange',
		resolver: yupResolver(schema),
		defaultValues: getProductdefaultValues(),
	});

	const onSubmit = async (data: IObject) => {
		if (isNull(data.category)) {
			ToastService.warning('Please select a category');
			return;
		}
		const dataCopy = { ...data };
		dataCopy.category = data.category?._id;
		dataCopy.collections = data.collections?.map((item) => item?._id);
		setIsSaving(true);
		const fd = await makeRequestFormData(dataCopy);
		ProductService.addProduct(fd)
			.then((resp) => {
				ToastService.success(resp.message);
				navigate(PRODUCT);
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsSaving(false));
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
							<SaveProducts isSaving={isSaving} />
						</div>
					</div>
					<FormFooter title='Unsaved Changes' saveButtonText='Save product' isSaving={isSaving} />
				</form>
			</FormProvider>
			{/* <ManageVendor drawerOpen={drawerOpen} handleClose={handleClose} /> */}
			{/* </WxFormContainer> */}
		</MainLg>
	);
};

export default AddProducts;
