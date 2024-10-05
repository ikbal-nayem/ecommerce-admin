import WxButton from '@components/Button';
import WxSelect from '@components/Select/WxSelect';
import TextInput from '@components/TextInput';
import WxDrawer from '@components/WxDrawer';
import WxDrawerBody from '@components/WxDrawer/WxDrawerBody';
import WxDrawerFooter from '@components/WxDrawer/WxDrawerFooter';
import WxDrawerHeader from '@components/WxDrawer/WxDrawerHeader';
import WxEditor from '@components/WxEditor/WxEditor';
import WxLabel from '@components/WxLabel';
import MediaInput from '@components/MediaInput/MediaInput';
import WxSwitch from '@components/WxSwitch';
import { IFilePayload } from '@interfaces/common.interface';
import { ENV } from 'config/ENV.config';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CategoryService, ICategoryPayload } from 'services/api/products/Category.services';
import { ButtonLoader } from 'services/utils/preloader.service';
import { ToastService } from 'services/utils/toastr.service';
import { parentTreeToLinear } from 'utils/categoryTreeOperation';
import useDebounce from 'utils/debouncer';
import makeSlug from 'utils/make-slug';
import { compressImage } from 'utils/utils';
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
	const [uploading, setUploading] = useState<boolean>(false);
	const [isDeletingImage, setIsDeletingImage] = useState<boolean>(false);
	const [linearCategories, setLinearCategories] = useState<ICategoryPayload[]>([]);
	const [images, setImages] = useState<IFilePayload[] | File[]>([]);
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
			setImages(editData?.banner ? [editData?.banner] : []);
			return;
		}
		if (isOpen && editData) {
			reset({ ...editData });
		} else {
			reset({});
		}
		isOpen && getLinearCategories();
		setImages([]);
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

	const handleImageAdd = useCallback(
		async (images: File[]) => {
			setUploading(true);
			const compressedImg = await compressImage(images[0]);
			if (!isEditForm) {
				setImages(images);
				setValue('banner', compressedImg);
				setUploading(false);
				return;
			}
			const formData: any = new FormData();
			formData.append('file', compressedImg);
			formData.append('id', editData?.id);
			CategoryService.uploadBanner(formData)
				.then((resp) => {
					setImages([resp.body]);
					setValue('banner', resp.body);
				})
				.catch((err) => ToastService.error(err.message))
				.finally(() => setUploading(false));
		},
		[isEditForm, editData]
	);

	const onImageRemove = useCallback(() => {
		if (isEditForm) {
			setIsDeletingImage(true);
			CategoryService.deleteBanner({ id: editData?.id })
				.then(() => {
					setImages([]);
					setValue('banner', null);
				})
				.catch((err) => ToastService.error(err.message))
				.finally(() => setIsDeletingImage(false));
			return;
		}
		setImages([]);
		setValue('banner', null);
	}, [isEditForm, editData]);

	return (
		<WxDrawer show={isOpen} handleClose={handleClose}>
			<div className='wx__category_form'>
				<WxDrawerHeader
					title={isEditForm ? 'Update Category' : 'Add Category'}
					closeIconAction={handleClose}
				/>
				<form onSubmit={handleSubmit(onSubmit)} noValidate>
					<WxDrawerBody>
						<TextInput
							label='Category name'
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
						<WxSelect
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
							<WxLabel>Category icon</WxLabel>
							<MediaInput
								fileList={images}
								onChange={handleImageAdd}
								onRemove={onImageRemove}
								isUploading={uploading}
								multiple={false}
							/>
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
					</WxDrawerBody>
					<WxDrawerFooter>
						<div className='wx__category_form__footer'>
							{isEditForm ? (
								<div className='me-auto'>
									<WxButton
										color='danger'
										variant='fill'
										disabled={isDeletingImage || isSaving}
										onClick={() => handleDelete(editData)}
									>
										Delete
									</WxButton>
								</div>
							) : null}
							<div className='ms-auto d-flex'>
								<WxButton
									className='me-3'
									variant='outline'
									color='secondary'
									disabled={isDeletingImage || isSaving}
									onClick={() => handleClose()}
								>
									Cancel
								</WxButton>
								<WxButton variant='fill' type='submit' disabled={isSaving || isDeletingImage}>
									{isEditForm ? 'Update' : 'Add'} Category
									{isSaving || isDeletingImage ? <ButtonLoader /> : null}
								</WxButton>
							</div>
						</div>
					</WxDrawerFooter>
				</form>
			</div>
		</WxDrawer>
	);
};

export default AddCategory;
