import WxAlert from "@components/Alert/WxAlert";
import { ConfirmationModal } from "@components/ConfirmationModal/ConfirmationModal";
import WxMainXl from "@components/MainContentLayout/WxMainXl";
import WxNotFound from "@components/NotFound/NotFound";
import WxButton from "@components/Button";
import { WxFormHeader } from "@components/WxFormLayout";
import WxIcon from "@components/Icon";
import WxPagination from "@components/WxPagination/WxPagination";
import ProductTableSkelton from "@components/WxSkelton/ProductTableSkelton";
import WxThumbnail from "@components/WxThumbnail/WxThumbnail";
import { IFilePayload, IRequestMeta } from "@interfaces/common.interface";
import { IProductTable } from "@interfaces/product.interface";
import { downgrade$ } from "@rxjs/downgrade.rx";
import { IDowngradeStatus } from "@rxjs/interfaces.rx";
import { DowngradeService } from "services/api/settings/Downgrade.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchParamsToObject } from "utils/makeObject";
import { imageURLGenerate } from "utils/utils";
import "./Product.scss";

type ISelectedImages = {
	id: string;
	files: IFilePayload[];
};

const Themes = () => {
	const [productList, setProductList] = useState<IProductTable[]>([]);
	const [productMeta, setProductMeta] = useState<IRequestMeta>();
	const [downgradeStatus, setDowngradeStatus] = useState<IDowngradeStatus>(
		downgrade$.initState
	);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [isLoader, setIsLoader] = useState<boolean>(true);
	const [selectedImages, setSelectedImages] = useState<ISelectedImages[]>([]);
	const [paginationLimit, setPaginationLimit] = useState(10);
	const [currentPage, setCurrentPage] = useState<number>(0);

	const [searchParams] = useSearchParams();
	const sParams: any = searchParamsToObject(searchParams);

	useEffect(() => {
		const subscription = downgrade$.subscribe(setDowngradeStatus);
		downgrade$.init();
		return () => subscription.unsubscribe();
	}, []);

	useEffect(() => {
		getProducts();
	}, [currentPage, paginationLimit]);

	const getProducts = (page = currentPage) => {
		setIsLoader(true);
		DowngradeService.getProductListWithExtraImage({
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
			.finally(() => {
				setTimeout(() => {
					setIsLoading(false);
				}, 600);
				setIsLoader(false);
			});
	};

	const onImageSelect = (pId: string, pImg: IFilePayload) => {
		const idx = selectedImages?.findIndex((p) => p.id === pId);
		if (idx === -1) {
			selectedImages.push({ id: pId, files: [pImg] });
		} else {
			const imgIdx = selectedImages[idx]?.files?.findIndex(
				(i) => i?.fileName === pImg?.fileName
			);
			if (imgIdx === -1) {
				selectedImages[idx].files.push(pImg);
			} else {
				selectedImages[idx].files = selectedImages[idx].files.filter(
					(si) => si?.fileName !== pImg?.fileName
				);
			}
		}
		setSelectedImages([...selectedImages]);
	};

	// This function will be called when user click on comfirm delete button
	const onConfirmDelete = () => {
		if (!selectedImages?.length) return;
		setIsSaving(true);
		DowngradeService.removeProductImages(selectedImages)
			.then((res) => {
				ToastService.success(res.message);
				setIsConfirmOpen(false);
				downgrade$.setInfo(sParams?.plan_id);
				getProducts(0);
				setSelectedImages([]);
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsSaving(false));
	};

	return (
		<WxMainXl className="downgrade-list-page">
			<WxFormHeader title="Installed themes" noBack />
			{/* {!!productList?.length && (
				<WxAlert>
					Each product can only have maximum{" "}
					{downgradeStatus?.plan?.productImageCount} images.
				</WxAlert>
			)} */}
			{/* {isLoading ? (
				<div className="rounded w-100 bg-white">
					<ProductTableSkelton viewBox="0 0 600 230" />
				</div>
			) : productList?.length ? (
				<div className="card">
					<div className="wx__responsive_table">
						<table className="wx__table">
							<thead className="wx__thead">
								<tr className="wx__tr">
									<th className="wx__th">
										<div className="text_subtitle text_semibold">
											Name
										</div>
									</th>
									<th className="wx__th">
										<div className="text_subtitle text_semibold">
											Images
										</div>
									</th>
								</tr>
							</thead>
							<tbody className="wx__tbody">
								{productList?.map((pd: IProductTable) => (
									<tr className="wx__tr" key={pd?.id}>
										<td className="wx__td wx__td-title">{pd?.title}</td>
										<td className="wx__td">
											<Images
												product={pd}
												selectedImages={selectedImages}
												onImageSelect={onImageSelect}
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className="pagination_div p-4">
						<WxPagination
							meta={productMeta}
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
							paginationLimit={paginationLimit}
							setPaginationLimit={setPaginationLimit}
						/>
					</div>
				</div>
			) : (
				<WxNotFound title="No product with extra image found." />
			)} */}
			<WxNotFound title="No extra theme found" />
			<ConfirmationModal
				onConfirm={onConfirmDelete}
				isOpen={isConfirmOpen}
				onClose={() => setIsConfirmOpen(false)}
				isSubmitting={isSaving}
				onConfirmLabel="Yes, remove"
				title="Remove confirmation!"
				body="Do you really want to remove selected images?"
			/>
		</WxMainXl>
	);
};


export default Themes;
