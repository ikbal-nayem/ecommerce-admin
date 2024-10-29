import { Button } from '@components/Button';
import Drawer from '@components/Drawer';
import DrawerBody from '@components/Drawer/DrawerBody';
import DrawerFooter from '@components/Drawer/DrawerFooter';
import DrawerHeader from '@components/Drawer/DrawerHeader';
import Icon from '@components/Icon';
import Label from '@components/Label';
import MediaInput from '@components/MediaInput/MediaInput';
import Select from '@components/Select/Select';
import Switch from '@components/Switch';
import TextEditor from '@components/TextEditor/Editor';
import TextInput from '@components/TextInput';
import { IObject } from '@interfaces/common.interface';
import { ENV } from 'config/ENV.config';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CategoryService, ICategoryPayload } from 'services/api/products/Category.services';
import { parentTreeToLinear } from 'utils/categoryTreeOperation';
import { isNull } from 'utils/check-validity';
import { debounce } from 'utils/debouncer';
import makeSlug from 'utils/make-slug';

const generateDefaultValues = (defaultValues?: ICategoryPayload) => ({
	name: defaultValues?.name || '',
	slug: defaultValues?.slug || '',
	parent: defaultValues?.parent || '',
	description: defaultValues?.description || '',
	image: defaultValues?.image || '',
	isActive: defaultValues?.isActive || '',
});

type AddCategoryProps = {
	isOpen: boolean;
	handleClose?: Function;
	onSubmit: any;
	editData?: IObject;
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
		control,
		reset,
		watch,
		setValue,
		clearErrors,
		setError,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		if (isOpen) {
			getLinearCategories(editData?.isEditMode ? editData?.data?._id : null);
			reset(generateDefaultValues(editData?.data));
		}
	}, [isOpen, editData]);

	const checkSlug = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
		if (editData?.isEditMode) return;
		if (!e.target.value) return clearErrors('slug');
		const slug = makeSlug(e.target.value);
		setValue('slug', slug);
		CategoryService.isSlugUnique(slug).then((res) => {
			res.data
				? clearErrors('slug')
				: setError('slug', {
						message: 'This slug is already used',
						type: 'invalid',
						types: { validate: false },
				  });
		});
	}, 500);

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

	const slug = watch('slug');

	return (
		<Drawer show={isOpen} handleClose={handleClose}>
			<div className='category_form'>
				<DrawerHeader
					title={editData?.isEditMode ? 'Update Category' : 'Add Category'}
					onClickClose={handleClose}
				/>
				<form onSubmit={handleSubmit(onSubmit)} noValidate>
					<DrawerBody>
						<TextInput
							label='Category name'
							placeholder='Name'
							isRequired
							isAutoFocus
							registerProperty={{
								...register('name', { required: true, onChange: checkSlug }),
							}}
							color={errors?.name ? 'danger' : 'secondary'}
							errorMessage={errors?.name && 'Name is required!'}
						/>
						<TextInput
							label='Slug'
							isRequired
							isDisabled={editData?.isEditMode}
							endIcon={slug && !errors?.slug && <Icon icon='done' color='success' />}
							helpText={
								<div className='text_regular text_subtitle'>
									{ENV.STORE_DOMAIN}/category/
									<span className='text_strong'>{slug}</span>
								</div>
							}
							registerProperty={{
								...register('slug', { required: true, onChange: checkSlug, disabled: editData?.isEditMode }),
							}}
							color={errors?.slug ? 'danger' : 'secondary'}
							errorMessage={errors?.slug?.message as string}
						/>
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
									<TextEditor onEditorChange={onChange} defaultValue={value} />
								)}
							/>
						</div>
						<div className='form_group'>
							<Label>Category Image</Label>
							<MediaInput name='image' control={control} multiple={false} />
						</div>
						<div className='mt-4' style={{ maxWidth: '50%' }}>
							<Switch
								label='Category Status'
								checkedTitle='Visible'
								unCheckedTitle='Hidden'
								defaultChecked={editData?.isEditMode ? editData?.isActive : true}
								registerProperty={{
									...register('isActive'),
								}}
							/>
						</div>
					</DrawerBody>
					<DrawerFooter>
						<div className='d-flex'>
							{editData?.isEditMode ? (
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
								<Button variant='fill' type='submit' isLoading={isSaving} disabled={!isNull(errors)}>
									{editData?.isEditMode ? 'Update' : 'Add'} Category
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
