import { ConfirmationModal } from "@components/ConfirmationModal/ConfirmationModal";
import WxMainLg from "@components/MainContentLayout/WxMainLg";
import WxNotFound from "@components/NotFound/WxNotFound";
import WxButton from "@components/WxButton";
import CategoryTBSkelton from "@components/WxSkelton/CategoryTBSkelton";
import { useEffect, useRef, useState } from "react";
import {
	CategoryService,
	ICategoryPayload,
	ICategoryToggleUpdate
} from "services/api/products/Category.services";
import { ToastService } from "services/utils/toastr.service";
import { setGlobCategoriesList } from "store/reducers/utileReducer";
import { dispatch } from "store/store";
import { productCountFromTree } from "utils/categoryTreeOperation";
import skeltonLoader from "utils/skeltonLoader";
import AddCategory from "./add-category/AddCategory";
import CategoryTable from "./category-table/CategoryTable";

const Category = () => {
	const [open, setOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [editData, setEditData] = useState<ICategoryPayload>();
	const [isLoader, setIsLoader] = useState<boolean>(true);
	const [categories, setCategories] = useState<ICategoryPayload[]>([]);
	const deleteItem = useRef(null);

	const handleClose = () => {
		setIsConfirmOpen(false);
		setOpen(false);
		setIsEdit(false);
		setEditData(null);
		deleteItem.current = null;
	};

	useEffect(() => {
		getCategory();
	}, []);

	const getCategory = () => {
		CategoryService.categoryGetByStoreId('userData.store_id')
			.then((res) => {
				if (res.body.length) {
					setCategories(productCountFromTree(res.body));
					dispatch(setGlobCategoriesList(res.body));
				}
			})
			.catch((err) => {
				ToastService.error(err);
			})
			.finally(() => {
				skeltonLoader(setIsLoader);
			});
	};

	const getCategoryById = (id: string) => {
		CategoryService.categoryGetById(id)
			.then((res) => {
				setEditData(res.body);
			})
			.catch((err) => ToastService.error(err.message));
	};

	const handleVisibility = (data: ICategoryToggleUpdate) => {
		// data.isActive = data.isActive;
		const dd = {
			id: data.id,
			isActive: !data.isActive,
		};
		CategoryService.toggleActivity(dd)
			.then((res) => {
				getCategory();
			})
			.catch((err) => ToastService.error(err));
	};

	const handleCreateSubcategory = (data: ICategoryPayload) => {
		setEditData({ parentId: data.id });
		setOpen(true);
	};

	const handleEdit = (data: ICategoryPayload) => {
		getCategoryById(data.id);
		setIsEdit(true);
		setOpen(true);
	};

	// This function will be called when user click on comfirm delete button
	const onDeleteConfirm = () => {
		const { id } = deleteItem.current;
		if (!id) {
			handleClose();
			return;
		}
		setIsSaving(true);
		CategoryService.delete({ id })
			.then((res) => {
				deleteItem.current = null;
				handleClose();
				getCategory();
			})
			.catch((err) => ToastService.error(err))
			.finally(() => setIsSaving(false));
	};

	const handleDelete = (item: ICategoryPayload) => {
		deleteItem.current = item;
		setIsConfirmOpen(true);
	};

	const onConfirmClose = () => {
		deleteItem.current = null;
		setIsConfirmOpen(false);
	};

	const onSubmit = (data: ICategoryPayload) => {
		setIsSaving(true);
		if (isEdit) {
			CategoryService.update(data)
				.then((response) => {
					ToastService.success(response.message);
					handleClose();
					getCategory();
				})
				.catch((error) => ToastService.error(error.message))
				.finally(() => setIsSaving(false));
			return;
		}

		const img: any = data?.banner;
		delete data?.banner;
		const newData = new FormData();
		newData.append('body', JSON.stringify(data));
		newData.append('file', img);

		CategoryService.create(newData)
			.then((response) => {
				ToastService.success(response.message);
				handleClose();
				getCategory();
			})
			.catch((error) => ToastService.error(error.message))
			.finally(() => setIsSaving(false));
	};

	return (
		<WxMainLg>
			<div className='wx__d-flex wx__justify-content-between wx__align-items-center wx__mb-3'>
				<h4 className='wx__text_h4 wx__text_semibold wx__mb-0'>Category</h4>
				<WxButton disabled={isLoader} variant='fill' onClick={() => setOpen(true)}>
					Add Category
				</WxButton>
				<AddCategory
					isOpen={open}
					handleClose={handleClose}
					onSubmit={onSubmit}
					isEditForm={isEdit}
					editData={editData}
					isSaving={isSaving}
					categories={categories}
					handleDelete={handleDelete}
				/>
			</div>
			{/* {isLoading ? (
        <Preloader absolutePosition />
      ) : !categories?.length ? (
        <WxNotFound title="Category not found!" btn_text="Create Category" />
      ) : null} */}

			{!isLoader && !categories?.length ? (
				<WxNotFound title='Category not found!' btn_text='Create Category' />
			) : null}

			{isLoader ? (
				<div className='wx__bg-white wx__rounded'>
					<CategoryTBSkelton viewBox='0 0 600 165' />
				</div>
			) : (
				<div className='wx__category_table_content wx__mt-2'>
					{categories.length ? (
						<CategoryTable
							data={categories}
							handleEdit={handleEdit}
							handleVisibility={handleVisibility}
							handleCreateSubcategory={handleCreateSubcategory}
							handleDelete={handleDelete}
						/>
					) : null}
				</div>
			)}

			<ConfirmationModal
				isSubmitting={isSaving}
				isOpen={isConfirmOpen}
				onClose={onConfirmClose}
				onConfirm={onDeleteConfirm}
				body={`Are your sure you want to delete '${deleteItem.current?.name}'? This action wont be reverseable!`}
			/>
		</WxMainLg>
	);
};

export default Category;
