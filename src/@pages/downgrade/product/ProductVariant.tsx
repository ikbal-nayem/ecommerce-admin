import WxAlert from "@components/Alert/WxAlert";
import { ConfirmationModal } from "@components/ConfirmationModal/ConfirmationModal";
import WxMainXl from "@components/MainContentLayout/WxMainXl";
import WxNotFound from "@components/NotFound/NotFound";
import {Button} from "@components/Button";
import Checkbox from "@components/Checkbox";
import { FormHeader } from "@components/FormLayout";
import Pagination from "@components/Pagination";
import ProductTableSkelton from "@components/WxSkelton/ProductTableSkelton";
import WxTag from "@components/WxTag";
import WxThumbnail from "@components/Thumbnail";
import { IRequestMeta } from "@interfaces/common.interface";
import { IProductTable } from "@interfaces/product.interface";
import { PRODUCT_DETAILS } from "routes/path-name.route";
import { downgrade$ } from "@rxjs/downgrade.rx";
import { IDowngradeStatus } from "@rxjs/interfaces.rx";
import { DowngradeService } from "services/api/settings/Downgrade.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { statusColorMapping } from "utils/colorMap";
import { searchParamsToObject } from "utils/makeObject";
import { imageURLGenerate } from "utils/utils";

const ProductVariant = () => {
	const [downgradeStatus, setDowngradeStatus] = useState<IDowngradeStatus>(
		downgrade$.initState
	);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [productList, setProductList] = useState<IProductTable[]>();
	const [productMeta, setProductMeta] = useState<IRequestMeta>();
	const [currentPage, setCurrentPage] = useState<number>(0);
	const [paginationLimit, setPaginationLimit] = useState<number>(10);
	const [selectedProduct, setSelectedProduct] = useState<IProductTable[]>([]);
	const [confirmModal, setConfirmModal] = useState<boolean>();
	const [isSubmitting, setIsSubmitting] = useState<boolean>();

	const [searchParams] = useSearchParams();
	const sParams: any = searchParamsToObject(searchParams);

	useEffect(() => {
		const subscription = downgrade$.subscribe(setDowngradeStatus);
		downgrade$.init();
		return () => subscription.unsubscribe();
	}, []);

	useEffect(() => {
		getProductList();
	}, [currentPage, paginationLimit]);

	const getProductList = (page = currentPage) => {
		DowngradeService.getListHavingVariants({
			body: { id: sParams?.plan_id },
			meta: {
				limit: paginationLimit,
				offset: page,
				sort: [{ order: "desc", field: "createdOn" }],
			},
		})
			.then(({ body, meta }) => {
				setProductList(body);
				setProductMeta(meta);
			})
			.finally(() => setIsLoading(false));
	};

	const onSelectProduct = (product: IProductTable) => {
		const idx = selectedProduct.findIndex((pro) => pro._id === product._id);
		if (idx === -1) {
			setSelectedProduct((pre) => [...pre, product]);
		} else {
			setSelectedProduct((pre) => pre.filter((p) => p._id !== product?._id));
		}
	};

	const onToggleAll = (e) => {
		e.target.checked
			? setSelectedProduct([...productList])
			: setSelectedProduct([]);
	};

	const onConfirmDelete = () => {
		if (!selectedProduct?.length) return;
		setIsSubmitting(true);
		const reqData = { ids: selectedProduct.map((pro) => pro?._id) };
		DowngradeService.removeProductVariants(reqData)
			.then((resp) => {
				ToastService.success(resp.message);
				downgrade$.setInfo(sParams?.plan_id);
				getProductList(0);
				setSelectedProduct([]);
				setConfirmModal(false);
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsSubmitting(false));
	};

	return (
		<WxMainXl className="downgrade-list-page">
			<FormHeader
				title="Products with variant"
				noBack
				rightContent={
					<Button
						variant="fill"
						color="danger"
						onClick={() => setConfirmModal(true)}
						disabled={!selectedProduct?.length}
					>
						Remove variants
					</Button>
				}
			/>
			{!!productList?.length && !downgradeStatus?.plan?.hasProductVariant && (
				<WxAlert>Products variant should remove</WxAlert>
			)}
			{isLoading ? (
				<div className="rounded w-100 bg-white">
					<ProductTableSkelton viewBox="0 0 600 230" />
				</div>
			) : !productList?.length ? (
				<WxNotFound title="No products with variant found!" />
			) : (
				<div className="card">
					<div className="wx__responsive_table">
						<table className="wx__table">
							<thead className="wx__thead">
								<tr className="wx__tr">
									<th className="wx__th" style={{ width: 20 }}>
										<Checkbox
											className="m-0"
											checked={productList?.length === selectedProduct?.length}
											onChange={onToggleAll}
										/>
									</th>
									<th className="wx__th">
										<div className="text_subtitle text_semibold">
											Name
										</div>
									</th>
									<th className="wx__th">
										<div className="text_subtitle text_semibold">
											Status
										</div>
									</th>
								</tr>
							</thead>
							<tbody className="wx__tbody">
								{productList?.map((pd: IProductTable) => (
									<tr className="wx__tr" key={pd?._id}>
										<td className="wx__td" style={{ width: 20 }}>
											<Checkbox
												className="m-0"
												checked={selectedProduct?.some(
													(val) => val._id === pd._id
												)}
												onChange={() => onSelectProduct(pd)}
											/>
										</td>
										<td className="wx__td">
											<div className="wx__table_cell_avatar wx__product_name">
												<WxThumbnail
													name={pd?.name}
													src={imageURLGenerate(pd?.thumbnail || pd?.images)}
												/>
												<div className="wx__table_cell_focus_text">
													<Link to={PRODUCT_DETAILS({ product_id: pd?._id })}>
														{pd?.name}
													</Link>
												</div>
											</div>
										</td>
										<td className="wx__td">
											<WxTag
												label={pd?.isActive?'Published': 'Inactive'}
												// color={statusColorMapping(pd?.status)}
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className="pagination_div p-4">
						<Pagination
							meta={productMeta}
						/>
					</div>
				</div>
			)}
			<ConfirmationModal
				onConfirm={onConfirmDelete}
				isOpen={confirmModal}
				onClose={() => setConfirmModal(false)}
				isSubmitting={isSubmitting}
				onConfirmLabel="Yes, remove"
				title="Remove confirmation!"
				body="Do you really want to remove variants from the selected products?"
			/>
		</WxMainXl>
	);
};

export default ProductVariant;
