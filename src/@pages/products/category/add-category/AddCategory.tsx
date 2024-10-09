import { Button } from '@components/Button';
import Drawer from '@components/Drawer';
import DrawerBody from '@components/Drawer/DrawerBody';
import DrawerFooter from '@components/Drawer/DrawerFooter';
import DrawerHeader from '@components/Drawer/DrawerHeader';
import MediaInput from '@components/MediaInput/MediaInput';
import Select from '@components/Select/Select';
import TextInput from '@components/TextInput';
import WxEditor from '@components/WxEditor/WxEditor';
import WxLabel from '@components/WxLabel';
import WxSwitch from '@components/WxSwitch';
import { ENV } from 'config/ENV.config';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CategoryService, ICategoryPayload } from 'services/api/products/Category.services';
import { parentTreeToLinear } from 'utils/categoryTreeOperation';
import useDebounce from 'utils/debouncer';
import makeSlug from 'utils/make-slug';
import './AddCategory.scss';

type AddCategoryProps = {
	isOpen: boolean;
	handleClose?: Function;
	onSubmit: any;
	isEditForm?: boolean;
	editData?: ICategoryPayload;
	handleDelete?: Function;
	isSaving?: boolean;
	categories?: ICategoryPayload[];
};

const AddCategory = ({
	handleClose,
	isOpen,
	onSubmit,
	isEditForm,
	editData,
	handleDelete,
	isSaving,
	categories,
}: AddCategoryProps) => {
	const [linearCategories, setLinearCategories] = useState<ICategoryPayload[]>([]);
	const {
		register,
		handleSubmit,
		setValue,
		control,
		reset,
		watch,
		formState: { errors },
		setError,
		clearErrors,
	} = useForm();

	const watch_name = watch('name');
	const slug = useDebounce(watch('slug'), 500);

	useEffect(() => {
		!isEditForm && setValue('slug', makeSlug(watch_name));
	}, [watch_name]);

	useEffect(() => {
		if (!isEditForm) {
			setValue('slug', makeSlug(slug));
			slug &&
				CategoryService.isSlugAvailable({ slug }).then((res) => {
					if (res.body) {
						clearErrors('slug');
						return;
					}
					setError('slug', { message: res.message });
				});
		}
	}, [slug]);

	useEffect(() => {
		if (isEditForm) {
			editData?.id && getLinearCategories(editData?.id);
			reset(editData);
			return;
		}
		if (isOpen && editData) {
			reset({ ...editData });
		} else {
			reset({});
		}
		isOpen && getLinearCategories();
	}, [isOpen, editData, isEditForm]);

	const getLinearCategories = (id = null) => {
		let categoryCopy = [...categories];
		if (id) {
			const removeChild = (data) => {
				data.forEach((item, index) => {
					if (item.id === id) data.splice(index, 1);
					else if (item.children) removeChild(item.children);
				});
				return data;
			};
			categoryCopy = removeChild(JSON.parse(JSON.stringify(categoryCopy)));
		}
		const linearData = parentTreeToLinear(categoryCopy);
		setLinearCategories(linearData);
	};

	return (
		<Drawer show={isOpen} handleClose={handleClose}>
			<div className='category_form'>
				<DrawerHeader title={isEditForm ? 'Update Category' : 'Add Category'} onClickClose={handleClose} />
				<form onSubmit={handleSubmit(onSubmit)} noValidate>
					<DrawerBody>
						<TextInput
							label='Category name'
							placeholder='Name'
							isRequired
							isAutoFocus
							registerProperty={{
								...register('name', { required: true }),
							}}
							color={errors?.name ? 'danger' : 'secondary'}
							errorMessage={errors?.name && 'Name is required!'}
						/>
						<TextInput
							label='Slug'
							isRequired
							isDisabled={isEditForm}
							helpText={
								<div className='text_regular text_subtitle'>
									{ENV.STORE_DOMAIN}/products/category/&nbsp;
									<span className='text_strong'>{slug}</span>
								</div>
							}
							registerProperty={{
								...register('slug', { required: true }),
							}}
							color={errors?.slug ? 'danger' : 'secondary'}
							errorMessage={errors?.slug?.message as string}
						/>
						<Select
							label='Parent category'
							valuesKey='id'
							placeholder='Select parent category'
							textKey='name'
							options={linearCategories}
							registerProperty={{
								...register('parentId'),
							}}
						/>
						<div className='form_group'>
							<WxLabel>Category details</WxLabel>
							<Controller
								control={control}
								name='description'
								render={({ field: { onChange, value } }) => (
									<WxEditor onEditorChange={onChange} defaultValue={value} />
								)}
							/>
						</div>
						<div className='form_group'>
							<WxLabel>Category Image</WxLabel>
							<MediaInput name='image' control={control} multiple={false} />
						</div>
						<div className='mt-4' style={{ maxWidth: '50%' }}>
							<WxSwitch
								label='Category Status'
								checkedTitle='Visible'
								unCheckedTitle='Hidden'
								defaultChecked={isEditForm ? editData?.isActive : true}
								registerProperty={{
									...register('isActive'),
								}}
							/>
						</div>
					</DrawerBody>
					<DrawerFooter>
						<div className='category_form__footer'>
							{isEditForm ? (
								<div className='me-auto'>
									<Button
										color='danger'
										variant='fill'
										disabled={isSaving}
										onClick={() => handleDelete(editData)}
									>
										Delete
									</Button>
								</div>
							) : null}
							<div className='ms-auto d-flex'>
								<Button
									className='me-3'
									variant='outline'
									color='secondary'
									disabled={isSaving}
									onClick={() => handleClose()}
								>
									Cancel
								</Button>
								<Button variant='fill' type='submit' isLoading={isSaving}>
									{isEditForm ? 'Update' : 'Add'} Category
								</Button>
							</div>
						</div>
					</DrawerFooter>
				</form>
			</div>
		</Drawer>
	);
};

export default AddCategory;
