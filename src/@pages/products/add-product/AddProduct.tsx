import WxMainLg from "@components/MainContentLayout/WxMainLg";
import {
	WxFormContainer,
	WxFormFooter,
	WxFormHeader,
} from "@components/WxFormLayout";
import { STATUS_CONSTANT } from "config/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { PRODUCT } from "routes/path-name.route";
import { ITagBody } from "services/api/admin/Tag.service";
import { ICategoryPayload } from "services/api/products/Category.services";
import { ICollectionPayload } from "services/api/products/Collection.services";
import { ProductService } from "services/api/products/Product.services";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getFirstErrorObj } from "utils/errors";
import "./AddProduct.scss";
import ManageVendor from "./components/manage-vendor/ManageVendor";
import ProductDimension from "./products-form/ProductDimension/ProductDimension";
import ProductInfo from "./products-form/ProductInfo/ProductInfo";
import ProductMedia from "./products-form/ProductMedia/ProductMedia";
import ProductOption from "./products-form/ProductOption/ProductOption";
import ProductPricing from "./products-form/ProductPricing/ProductPricing";
import ProductStock from "./products-form/ProductStock/ProductStock";
import ProductVariants from "./products-form/ProductVariants/ProductVariants";
import SearchEngine from "./products-form/SearchEngine/SearchEngine";
import SaveProducts from "./save-product/SaveProduct";
import schema from "./validation";

const AddProducts = () => {
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [selectedCategory, setSelectedCategory] = useState<ICategoryPayload>(
		{}
	);
	const [selectedCollections, setSelectedCollections] = useState<
		ICollectionPayload[]
	>([]);
	const [selectedTags, setSelectedTags] = useState<ITagBody[]>([]);
	const userData = useSelector((data: any) => data?.user?.user_data);
	const navigate = useNavigate();
	const methods = useForm({
		mode: "onChange",
		resolver: yupResolver(schema),
		defaultValues: {
			regularPrice: 0,
			sellingPrice: 0,
			costPrice: 0,
			quantity: 0,
			hasSummary: false,
			hasDimension: false,
			heightUnit: "cm",
			widthUnit: "cm",
			weightUnit: "gm",
			hasVariant: false,
			isTrackQuantity: true,
			isOverselling: false,
			status: STATUS_CONSTANT.published,
			categoryId: "",
			collections: [],
			tags: "",
			images: [],
		},
	});

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
		const idx = newTags.findIndex((val) => val.id === tag.id);
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
			return;
		}
		setIsSaving(true);
		const images: any = data?.images;
		delete data?.images;
		const formData = new FormData();
		formData.append("body", JSON.stringify(data));
		Object.keys(images).forEach((img) => formData.append("files", images[img]));
		ProductService.createProduct(formData)
			.then((resp) => {
				ToastService.success(resp.message);
				navigate(PRODUCT);
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsSaving(false));
	};

	return (
		<WxMainLg>
			{/* <WxFormContainer> */}
			<WxFormHeader noMargin title="Add Product" backNavigationLink={PRODUCT} />
			<FormProvider {...methods}>
				<form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
					<div className="row wx__mb-4">
						<div className="col-lg-8 col-md-7 col-sm-12">
							<ProductInfo />
							<ProductMedia />
							<ProductPricing />
							<ProductDimension />
							<ProductStock />
							<ProductOption />
							<ProductVariants />
							<SearchEngine />
						</div>
						<div className="col-lg-4 col-md-5 col-sm-12">
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
};

export default AddProducts;
