import { Button } from '@components/Button';
import Drawer from '@components/Drawer';
import DrawerBody from '@components/Drawer/DrawerBody';
import DrawerFooter from '@components/Drawer/DrawerFooter';
import DrawerHeader from '@components/Drawer/DrawerHeader';
import MediaInput from '@components/MediaInput/MediaInput';
import Select from '@components/Select/Select';
import TextInput from '@components/TextInput';
import WxEditor from '@components/WxEditor/WxEditor';
import Label from '@components/WxLabel';
import WxSwitch from '@components/WxSwitch';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CategoryService, ICategoryPayload } from 'services/api/products/Category.services';
import { parentTreeToLinear } from 'utils/categoryTreeOperation';
import useDebounce from 'utils/debouncer';
import makeSlug from 'utils/make-slug';

const generateDefaultValues = (defaultValues?: ICategoryPayload) => ({
	name: defaultValues?.name || '',
	slug: defaultValues?.slug || '',
	parent: defaultValues?.parent || null,
	description: defaultValues?.description || '',
	image: defaultValues?.image || '',
	isActive: defaultValues?.isActive || '',
});

type AddCategoryProps = {
	isOpen: boolean;
	handleClose?: Function;
	onSubmit: any;
	editData?: ICategoryPayload;
	handleDelete?: Function;
	isSaving?: boolean;
	categories?: ICategoryPayload[];
};

const AddCategory = ({
	handleClose,
	isOpen,
	onSubmit,
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
	const slug = useDebounce(watch_name, 500);

	const isEditForm = !!editData;

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
		if (isOpen && !!editData) {
			getLinearCategories(editData?._id);
			reset(generateDefaultValues(editData));
			return;
		} else {
			reset(generateDefaultValues());
		}
		isOpen && getLinearCategories();
	}, [isOpen, editData]);

	const getLinearCategories = (id = null) => {
		let categoryCopy = [...categories];
		if (id) {
			const removeChild = (data) => {
				data.forEach((item, index) => {
					if (item._id === id) data.splice(index, 1);
					else if (item.subcategories) removeChild(item.subcategories);
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
						{/* <TextInput
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
						/> */}
						<Select
							label='Parent category'
							valuesKey='id'
							placeholder='Select...'
							textKey='name'
							options={linearCategories}
							registerProperty={{ ...register('parent') }}
						/>
						<div className='form_group'>
							<Label>Category details</Label>
							<Controller
								control={control}
								name='description'
								render={({ field: { onChange, value } }) => (
									<WxEditor onEditorChange={onChange} defaultValue={value} />
								)}
							/>
						</div>
						<div className='form_group'>
							<Label>Category Image</Label>
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
						<div className='d-flex'>
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
