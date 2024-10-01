import { ConfirmationModal } from "@components/ConfirmationModal/ConfirmationModal";
import WxMainFull from "@components/MainContentLayout/WxMainFull";
import WxNotFound from "@components/NotFound/WxNotFound";
import WxSelect from "@components/Select/WxSelect";
import TableLoader from "@components/TableLoader/TableLoader";
import WxButton from "@components/WxButton";
import WxIcon from "@components/WxIcon/WxIcon";
import WxInput from "@components/WxInput";
import WxPagination from "@components/WxPagination/WxPagination";
import ProductTableSkelton from "@components/WxSkelton/ProductTableSkelton";
import Tabs from "@components/WxTabs/WxTabs";
import { PRODUCT_STATUS } from "config/constants";
import { IProductTable } from "@interfaces/product.interface";
import { PRODUCT_CREATE } from "routes/path-name.route";
import {
  CategoryService,
  ICategoryPayload,
} from "services/api/products/Category.services";
import { ProductService } from "services/api/products/Product.services";
import { ToastService } from "services/utils/toastr.service";
import { memo, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchParamsToObject } from "utils/makeObject";
import useDebounce from "../../utils/debouncer";
import "./Products.scss";
import TableComponent from "./ProductTable";

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
	const [currentPage, setCurrentPage] = useState<number>(
		Number(searchParams.get("page"))
			? Number(searchParams.get("page")) - 1
			: null || 0
	);
	const deleteItem = useRef(null);
    
  const navigate = useNavigate();

  let search: string = useDebounce(searchQuery, 500);

  useEffect(() => {
    CategoryService.get()
      .then((res) => {
        const result = res.body?.map((item: any) => ({
          id: item.id,
          text: item.name,
        }));
        setCategories(result);
      })
      .catch((err) => console.error(err.message));
  }, []);

  useEffect(() => {
    getProducts();
  }, [search, currentPage, paginationLimit, searchParams]);

  const getProducts = () => {
    setIsLoader(true);
    ProductService.search({
			body: {
				status: searchParams.get("status") || null,
				categoryId: searchParams.get("category") || null,
				searchKey: search || null,
			},
			meta: {
				offset: currentPage,
				limit: paginationLimit,
				sort: [{ order: "desc", field: "createdOn" }],
			},
		})
			.then((res: any) => {
				setProductList(res.body);
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
			<WxMainFull>
				<div className="d-flex wx__justify-content-between wx__align-items-center">
					<h4 className="wx__text_h4 wx__text_medium mb-0">Products List</h4>
					<WxButton
						disabled={isLoader}
						variant="fill"
						onClick={() => navigate(PRODUCT_CREATE)}
					>
						Add Product
					</WxButton>
				</div>

				{isLoading ? (
					<div className="rounded w-100 wx__bg-white wx__mt-3">
						<ProductTableSkelton viewBox="0 0 600 230" />
					</div>
				) : (
					<div className="card wx__mt-3">
						<div className="wx__mt-3 hide-mobile-view">
							<Tabs
								option={[{ id: 0, title: "All" }, ...PRODUCT_STATUS]}
								renderTab={(item) => item?.title}
								currentIndex={
									PRODUCT_STATUS.find(
										(pro) => pro.title === searchParams.get("status")
									)?.id || 0
								}
								setCurrentIndex={onStatusChangeFromTab}
							/>
						</div>
						<div className="row wx__p-4 wx__pb-0">
							<div className="col-xl-8 col-lg-6 col-md-6 col-sm-12">
								<WxInput
									type="search"
									placeholder="Search products"
									startIcon={<WxIcon icon="search" />}
									onChange={(e: any) => setSearchQuery(e.target.value)}
								/>
							</div>
							<div className="col-xl-2 col-lg-3 col-md-3 col-sm-12">
								<WxSelect
									placeholder="Select Category"
									valuesKey="id"
									textKey="text"
									options={categories}
									value={searchParams.get("category") || ""}
									onChange={onChangeCategory}
								/>
							</div>
							<div className="col-xl-2 col-lg-3 col-md-3 col-sm-12">
								<WxSelect
									placeholder="Select Status"
									valuesKey="text"
									textKey="title"
									value={searchParams.get("status") || ""}
									options={PRODUCT_STATUS}
									onChange={onChangeStatus}
								/>
							</div>
							<TableLoader isLoading={isLoader} />
						</div>

						{productList.length && productMeta ? (
							<>
								<TableComponent
									productsData={productList}
									handleDelete={handleDelete}
								/>
								<div className="pagination_div">
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
							<div className="wx__mt-3">
								<WxNotFound
									title="No Products Found"
									btn_link={PRODUCT_CREATE}
									btn_text="Add Product"
								/>
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
			</WxMainFull>
		</>
	);
};

export default memo(Products);
