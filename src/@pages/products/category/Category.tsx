import { Button } from '@components/Button';
import { ConfirmationModal } from '@components/ConfirmationModal/ConfirmationModal';
import WxMainLg from '@components/MainContentLayout/MainLg';
import NotFound from '@components/NotFound/NotFound';
import CategoryTBSkelton from '@components/WxSkelton/CategoryTBSkelton';
import { IObject } from '@interfaces/common.interface';
import { useEffect, useRef, useState } from 'react';
import {
	CategoryService,
	ICategoryPayload,
	ICategoryToggleUpdate,
} from 'services/api/products/Category.services';
import { ToastService } from 'services/utils/toastr.service';
import { setGlobCategoryList } from 'store/reducers/utileReducer';
import { dispatch } from 'store/store';
import { productCountFromTree } from 'utils/categoryTreeOperation';
import { makeFormData } from 'utils/preprocessor';
import skeltonLoader from 'utils/skeltonLoader';
import AddCategory from './category-form';
import CategoryTable from './category-table/CategoryTable';

const Category = () => {
	const [open, setOpen] = useState(false);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [isLoader, setIsLoader] = useState<boolean>(true);
	const [categories, setCategories] = useState<ICategoryPayload[]>([]);
	const tempItem = useRef<IObject>();
	const deleteItem = useRef(null);

	const handleClose = () => {
		setIsConfirmOpen(false);
		setOpen(false);
		tempItem.current = null;
		deleteItem.current = null;
	};

	useEffect(() => {
		getCategory();
	}, []);

	const getCategory = () => {
		CategoryService.getTree()
			.then((res) => {
				setCategories(productCountFromTree(res.data));
				dispatch(setGlobCategoryList(res.data));
			})
			.catch((err) => ToastService.error(err))
			.finally(() => skeltonLoader(setIsLoader));
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
		// setEditData({ parentId: data.id });
		setOpen(true);
	};

	const handleEdit = (data: ICategoryPayload) => {
		tempItem.current = data;
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

	const onSubmit = async (data: ICategoryPayload) => {
		console.log(tempItem.current);
		
		setIsSaving(true);
		const fd = await makeFormData(data);
		if (!!tempItem.current) {
			CategoryService.update(tempItem.current._id, fd)
				.then((response) => {
					ToastService.success(response.message);
					handleClose();
					getCategory();
				})
				.catch((error) => ToastService.error(error.message))
				.finally(() => setIsSaving(false));
			return;
		}
		CategoryService.create(fd)
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
			<div className='d-flex justify-content-between align-items-center mb-3'>
				<h4 className='text_h4 text_semibold mb-0'>Category</h4>
				<Button disabled={isLoader} variant='fill' onClick={() => setOpen(true)}>
					Add Category
				</Button>
				<AddCategory
					isOpen={open}
					handleClose={handleClose}
					onSubmit={onSubmit}
					editData={tempItem.current}
					isSaving={isSaving}
					categories={categories}
					handleDelete={handleDelete}
				/>
			</div>

			{!isLoader && !categories?.length ? (
				<NotFound title='No Category found!' btn_text='Create Category' onButtonClick={() => setOpen(true)} />
			) : null}

			{isLoader ? (
				<div className='bg-white rounded'>
					<CategoryTBSkelton viewBox='0 0 600 165' />
				</div>
			) : (
				<div className='wx__category_table_content card mt-2'>
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
