import WxMainLg from "@components/MainContentLayout/MainLg";
import {
	WxFormContainer,
	WxFormFooter,
	FormHeader,
} from "@components/FormLayout";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "@pages/products/add-product/validation";
import { PRODUCT } from "routes/path-name.route";
import { ITagBody } from "services/api/admin/Tag.service";
import { ICategoryPayload } from "services/api/products/Category.services";
import { ICollectionPayload } from "services/api/products/Collection.services";
import { ProductService } from "services/api/products/Product.services";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getFirstErrorObj } from "utils/errors";
import "../add-product/AddProduct.scss";
import ManageVendor from "../add-product/components/manage-vendor/ManageVendor";
import ProductDimension from "../add-product/products-form/ProductDimension/ProductDimension";
import ProductInfo from "../add-product/products-form/ProductInfo/ProductInfo";
import ProductMedia from "../add-product/products-form/ProductMedia/ProductMedia";
import ProductOption from "../add-product/products-form/ProductOption/ProductOption";
import ProductPricing from "../add-product/products-form/ProductPricing/ProductPricing";
import ProductStock from "../add-product/products-form/ProductStock/ProductStock";
import ProductVariants from "../add-product/products-form/ProductVariants/ProductVariants";
import SearchEngine from "../add-product/products-form/SearchEngine/SearchEngine";
import SaveProducts from "../add-product/save-product/SaveProduct";

const UpdateProducts = () => {
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [selectedCategory, setSelectedCategory] = useState<ICategoryPayload>(
		{}
	);
	const [selectedCollections, setSelectedCollections] = useState<
		ICollectionPayload[]
	>([]);
	const [selectedTags, setSelectedTags] = useState<ITagBody[]>([]);
	const navigate = useNavigate();
	const methods = useForm({
		resolver: yupResolver(schema),
		mode: "onChange",
	});

	const { product_id } = useParams();

	useEffect(() => {
		if (product_id) {
			setIsLoading(true);
			ProductService.getById(product_id)
				.then((res) => {
					methods.reset(res.body);
					setSelectedCategory({
						id: res.body?.categoryId,
						name: res.body?.categoryName,
					});
					setSelectedCollections(res.body?.collections || []);
					setSelectedTags(
						res.body?.tags
							? res.body?.tags
									?.split(",")
									?.map((val: string, idx: number) => ({ id: idx, name: val }))
							: []
					);
				})
				.catch((err) => {
					ToastService.error(err.message);
					navigate(PRODUCT);
				})
				.finally(() => setIsLoading(false));
		}
	}, [product_id]);

	useEffect(() => {
		methods.setValue("collections", [...selectedCollections]);
	}, [selectedCollections]);

	useEffect(() => {
		const tags = selectedTags?.map((tag) => tag.name)?.join(",");
		methods.setValue("tags", tags);
	}, [selectedTags]);

	const categorySetter = (category: ICategoryPayload) => {
		setSelectedCategory(category);
		methods.setValue("categoryId", category?.id);
	};

	const onCollectionSelect = (collection: ICollectionPayload) => {
		const newCollections = [...selectedCollections];
		const idx = newCollections.findIndex((val) => val.id === collection.id);
		idx >= 0 ? newCollections.splice(idx, 1) : newCollections.push(collection);
		setSelectedCollections(newCollections);
	};

	const onRemoveCollection = (idx: number) => {
		const newCollections = [...selectedCollections];
		newCollections.splice(idx, 1);
		setSelectedCollections(newCollections);
	};

	const onTagSelect = (tag: ITagBody) => {
		if (!tag) return;
		const newTags = [...selectedTags];
		const idx = newTags.findIndex((val) => val.name === tag.name);
		if (idx < 0) {
			newTags.push(tag);
			setSelectedTags(newTags);
		}
	};

	const onRemoveTag = (idx: number) => {
		const newTags = [...selectedTags];
		newTags.splice(idx, 1);
		setSelectedTags(newTags);
	};

	const setVendorDrawerOpen = () => setDrawerOpen(true);
	const handleClose = () => setDrawerOpen(false);

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

			ProductService.updateProduct(data)
				.then((resp) => {
					ToastService.success(resp.message);
					navigate(PRODUCT);
				})
				.catch((err) => ToastService.error(err.message))
				.finally(() => setIsSaving(false));
		}
	};

	if (isLoading) return <Preloader absolutePosition />;

	return (
		<WxMainLg>
			{/* <WxFormContainer> */}
			<FormHeader
				noMargin
				title="Update Product"
				backNavigationLink={PRODUCT}
			/>
			<FormProvider {...methods}>
				<form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
					<div className="row mb-4">
						<div className="col-lg-8 col-md-7">
							<ProductInfo />
							<ProductMedia isEditForm />
							<ProductPricing />
							<ProductDimension />
							<ProductStock />
							<ProductOption />
							<ProductVariants isEditForm />
							<SearchEngine />
						</div>
						<div className="col-lg-4 col-md-5">
							<SaveProducts
								selectedCategory={selectedCategory}
								selectedCollections={selectedCollections}
								setVendorDrawerOpen={setVendorDrawerOpen}
								categorySetter={categorySetter}
								onCollectionSelect={onCollectionSelect}
								onRemoveCollection={onRemoveCollection}
								onTagSelect={onTagSelect}
								selectedTags={selectedTags}
								onRemoveTag={onRemoveTag}
								isSaving={isSaving}
								isEditForm
							/>
						</div>
					</div>
					<WxFormFooter
						title="Unsaved Changes"
						saveButtonText="Save product"
						isSaving={isSaving}
					/>
				</form>
			</FormProvider>
			<ManageVendor drawerOpen={drawerOpen} handleClose={handleClose} />
			{/* </WxFormContainer> */}
		</WxMainLg>
	);
}

export default UpdateProducts;
