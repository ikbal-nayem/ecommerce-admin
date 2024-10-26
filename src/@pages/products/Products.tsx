import { Button } from '@components/Button';
import { ConfirmationModal } from '@components/ConfirmationModal/ConfirmationModal';
import Icon from '@components/Icon';
import MainFull from '@components/MainContentLayout/MainFull';
import NotFound from '@components/NotFound/NotFound';
import Pagination from '@components/Pagination';
import Select from '@components/Select/Select';
import TextInput from '@components/TextInput';
import ProductTableSkelton from '@components/WxSkelton/ProductTableSkelton';
import Tabs from '@components/WxTabs/WxTabs';
import { IProductTable } from '@interfaces/product.interface';
import { PRODUCT_STATUS } from 'config/constants';
import useLoader from 'hooks/useLoader';
import { memo, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PRODUCT_CREATE } from 'routes/path-name.route';
import { CategoryService, ICategoryPayload } from 'services/api/products/Category.services';
import { ProductService } from 'services/api/products/Product.services';
import { ToastService } from 'services/utils/toastr.service';
import { parentTreeToLinear } from 'utils/categoryTreeOperation';
import { searchParamsToObject, searchParamsToReqbody } from 'utils/makeObject';
import { debounce } from '../../utils/debouncer';
import './Products.scss';
import ProductTable from './ProductTable';

const Products = () => {
	const [productList, setProductList] = useState<IProductTable[]>([]);
	const [productMeta, setProductMeta] = useState<any>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [isSaving, setIsSaving] = useLoader(false);
	const [isLoader, setIsLoader] = useState<boolean>(true);
	const [categories, setCategories] = useState<ICategoryPayload[]>([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const deleteItem = useRef(null);

	const navigate = useNavigate();

	useEffect(() => {
		CategoryService.getTree()
			.then((res) => {
				setCategories(parentTreeToLinear(res?.data));
			})
			.catch((err) => console.error(err.message));
	}, []);

	useEffect(() => {
		getProducts();
	}, [searchParams]);

	const getProducts = () => {
		setIsLoader(true);
		ProductService.search(searchParamsToReqbody(searchParams))
			.then((res: any) => {
				setProductList(res.data);
				setProductMeta(res.meta);
			})
			.catch((err) => ToastService.error(err))
			.finally(() => {
				setTimeout(() => {
					setIsLoading(false);
				}, 600);
				setIsLoader(false);
			});
	};

	const onConfirmClose = () => {
		deleteItem.current = null;
		setIsConfirmOpen(false);
	};

	const handleDelete = (item: ICategoryPayload) => {
		deleteItem.current = item;
		setIsConfirmOpen(true);
	};

	// This function will be called when user click on comfirm delete button
	const onConfirmDelete = () => {
		const { _id } = deleteItem.current;
		if (!_id) {
			setIsConfirmOpen(false);
			return;
		}
		setIsSaving(true);
		ProductService.deleteById(_id)
			.then((res) => {
				ToastService.success(res.message);
				getProducts();
				onConfirmClose();
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsSaving(false));
	};

	const onChangeCategory = (e: any) => {
		const val = e.target.value;
		const params: any = searchParamsToObject(searchParams);
		val ? (params.category = val) : delete params.category;
		setSearchParams({ ...params, page: 1 });
	};

	const onStatusChangeFromTab = (activeTab) => {
		const tabItem: any = PRODUCT_STATUS.find((itm) => itm.id === activeTab);
		const params: any = searchParamsToObject(searchParams);
		tabItem?.id ? (params.isActive = tabItem?.value) : delete params.isActive;
		setSearchParams({ ...params, page: 1 });
	};

	return (
		<>
			<MainFull>
				<div className='d-flex justify-content-between align-items-center'>
					<h4 className='text_h4 text_medium mb-0'>Products List</h4>
					<Button disabled={isLoader} variant='fill' onClick={() => navigate(PRODUCT_CREATE)}>
						Add Product
					</Button>
				</div>

				{isLoading ? (
					<div className='rounded w-100 bg-white mt-3'>
						<ProductTableSkelton viewBox='0 0 600 230' />
					</div>
				) : (
					<div className='card mt-3'>
						<div className='mt-3 hide-mobile-view'>
							<Tabs
								option={[{ id: 0, title: 'All' }, ...PRODUCT_STATUS]}
								renderTab={(item) => item?.title}
								currentIndex={
									PRODUCT_STATUS.find((pro) => pro.title === searchParams.get('isActive'))?.id || 0
								}
								setCurrentIndex={onStatusChangeFromTab}
							/>
						</div>
						<div className='row p-4 pb-0'>
							<div className='col-lg-9 col-md-8 col-sm-8'>
								<TextInput
									type='search'
									placeholder='Search products'
									startIcon={<Icon icon='search' />}
									defaultValue={searchParams.get('searchKey') || ''}
									onChange={debounce(
										(e: any) =>
											setSearchParams({
												...searchParamsToObject(searchParams),
												searchKey: e.target.value,
												page: '1',
											}),
										500
									)}
								/>
							</div>
							<div className='col-lg-3 col-md-4 col-sm-4'>
								<Select
									placeholder='Select Category'
									valuesKey='id'
									textKey='name'
									options={categories}
									value={searchParams.get('category') || ''}
									onChange={onChangeCategory}
								/>
							</div>
						</div>

						{productList.length && productMeta ? (
							<>
								<ProductTable productsData={productList} handleDelete={handleDelete} />
								<div className='p-2'>
									<Pagination meta={productMeta} setSearchParams />
								</div>
							</>
						) : (
							<div className='mt-3'>
								<NotFound title='No Products Found' btn_link={PRODUCT_CREATE} btn_text='Add Product' />
							</div>
						)}
					</div>
				)}
				<ConfirmationModal
					isSubmitting={isSaving}
					isOpen={isConfirmOpen}
					onClose={onConfirmClose}
					onConfirm={onConfirmDelete}
					body={`Are your sure you want to delete '${deleteItem.current?.name}'? This action wont be reverseable!`}
				/>
			</MainFull>
		</>
	);
};

export default memo(Products);
