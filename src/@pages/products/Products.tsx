import { Button } from '@components/Button';
import { ConfirmationModal } from '@components/ConfirmationModal/ConfirmationModal';
import Icon from '@components/Icon';
import MainFull from '@components/MainContentLayout/MainFull';
import NotFound from '@components/NotFound/NotFound';
import Select from '@components/Select/Select';
import TableLoader from '@components/TableLoader/TableLoader';
import TextInput from '@components/TextInput';
import WxPagination from '@components/WxPagination/WxPagination';
import ProductTableSkelton from '@components/WxSkelton/ProductTableSkelton';
import Tabs from '@components/WxTabs/WxTabs';
import { IProductTable } from '@interfaces/product.interface';
import { PRODUCT_STATUS } from 'config/constants';
import { memo, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PRODUCT_CREATE } from 'routes/path-name.route';
import { CategoryService, ICategoryPayload } from 'services/api/products/Category.services';
import { ProductService } from 'services/api/products/Product.services';
import { ToastService } from 'services/utils/toastr.service';
import { parentTreeToLinear } from 'utils/categoryTreeOperation';
import { searchParamsToObject } from 'utils/makeObject';
import useDebounce from '../../utils/debouncer';
import './Products.scss';
import ProductTable from './ProductTable';

const Products = () => {
	const [productList, setProductList] = useState<IProductTable[]>([]);
	const [productMeta, setProductMeta] = useState<any>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [isLoader, setIsLoader] = useState<boolean>(true);
	const [searchQuery, setSearchQuery] = useState<string>(null);
	const [paginationLimit, setPaginationLimit] = useState(10);
	const [categories, setCategories] = useState<ICategoryPayload[]>([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const [currentPage, setCurrentPage] = useState<number>(+searchParams.get('page') || 0);
	const deleteItem = useRef(null);

	const navigate = useNavigate();

	let search: string = useDebounce(searchQuery, 500);

	useEffect(() => {
		CategoryService.getTree()
			.then((res) => {
				setCategories(parentTreeToLinear(res?.data));
			})
			.catch((err) => console.error(err.message));
	}, []);

	useEffect(() => {
		getProducts();
	}, [search, currentPage, paginationLimit, searchParams]);

	const getProducts = () => {
		setIsLoader(true);
		ProductService.get({
			body: {
				status: searchParams.get('status') || null,
				categoryId: searchParams.get('category') || null,
				searchKey: search || null,
			},
			meta: {
				offset: currentPage,
				limit: paginationLimit,
				sort: [{ order: 'desc', field: 'createdOn' }],
			},
		})
			.then((res: any) => {
				setProductList(res.data);
				setProductMeta(res.meta || {});
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
		const { id } = deleteItem.current;
		if (!id) {
			setIsConfirmOpen(false);
			return;
		}
		setIsSaving(true);
		ProductService.deleteAll({ ids: [id] })
			.then((res) => {
				deleteItem.current = null;
				getProducts();
				setIsConfirmOpen(false);
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsSaving(false));
	};

	const onChangeCategory = (e: any) => {
		const val = e.target.value;
		const params: any = searchParamsToObject(searchParams);
		val ? (params.category = val) : delete params.category;
		setSearchParams({ ...params });
	};

	const onChangeStatus = (e: any) => {
		const val = e.target.value;
		const params: any = searchParamsToObject(searchParams);
		val ? (params.status = val) : delete params.status;
		setSearchParams({ ...params });
	};

	const onStatusChangeFromTab = (activeTab) => {
		const tabItem: any = PRODUCT_STATUS.find((itm) => itm.id === activeTab);
		const params: any = searchParamsToObject(searchParams);
		tabItem?.id ? (params.status = tabItem?.title) : delete params.status;
		setSearchParams({ ...params });
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
								currentIndex={PRODUCT_STATUS.find((pro) => pro.title === searchParams.get('status'))?.id || 0}
								setCurrentIndex={onStatusChangeFromTab}
							/>
						</div>
						<div className='row p-4 pb-0'>
							<div className='col-xl-10 col-lg-9 col-md-8 col-sm-8'>
								<TextInput
									type='search'
									placeholder='Search products'
									startIcon={<Icon icon='search' />}
									onChange={(e: any) => setSearchQuery(e.target.value)}
								/>
							</div>
							<div className='col-xl-2 col-lg-3 col-md-4 col-sm-4'>
								<Select
									placeholder='Select Category'
									valuesKey='id'
									textKey='name'
									options={categories}
									value={searchParams.get('category') || ''}
									onChange={onChangeCategory}
								/>
							</div>
							{/* <div className='col-xl-2 col-lg-3 col-md-3 col-sm-12'>
								<Select
									placeholder='Select Status'
									valuesKey='text'
									textKey='title'
									value={searchParams.get('status') || ''}
									options={PRODUCT_STATUS}
									onChange={onChangeStatus}
								/>
							</div> */}
							<TableLoader isLoading={isLoader} />
						</div>

						{productList.length && productMeta ? (
							<>
								<ProductTable productsData={productList} handleDelete={handleDelete} />
								<div className='p-2'>
									<WxPagination
										meta={productMeta}
										currentPage={currentPage}
										setCurrentPage={setCurrentPage}
										paginationLimit={paginationLimit}
										setPaginationLimit={setPaginationLimit}
									/>
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
					body={`Are your sure you want to delete '${deleteItem.current?.title}'? This action wont be reverseable!`}
				/>
			</MainFull>
		</>
	);
};

export default memo(Products);
