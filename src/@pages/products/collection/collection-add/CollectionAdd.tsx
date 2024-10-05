import WxButton from '@components/Button';
import { SingleImage } from '@components/MediaInput';
import MediaInput from '@components/MediaInput/MediaInput';
import TextInput from '@components/TextInput';
import WxDrawer from '@components/WxDrawer';
import WxDrawerBody from '@components/WxDrawer/WxDrawerBody';
import WxDrawerFooter from '@components/WxDrawer/WxDrawerFooter';
import WxDrawerHeader from '@components/WxDrawer/WxDrawerHeader';
import WxEditor from '@components/WxEditor/WxEditor';
import WxLabel from '@components/WxLabel';
import { ENV } from 'config/ENV.config';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CollectionService, ICollectionPayload } from 'services/api/products/Collection.services';
import { ButtonLoader } from 'services/utils/preloader.service';
import { ToastService } from 'services/utils/toastr.service';
import useDebounce from 'utils/debouncer';
import makeSlug from 'utils/make-slug';
import { compressImage } from 'utils/utils';
import './CollectionAdd.scss';

type AddCollectionProps = {
	isOpen: boolean;
	handleClose?: Function;
	onSubmit: any;
	isEditForm?: boolean;
	editData?: ICollectionPayload;
	handleDelete?: Function;
	isSaving?: boolean;
};

const AddCollection = ({
	handleClose,
	isOpen,
	onSubmit,
	isEditForm,
	editData,
	handleDelete,
	isSaving,
}: AddCollectionProps) => {
	const [isUploading, setIsUploading] = useState(false);
	const [isDeletingImage, setIsDeletingImage] = useState<boolean>(false);
	const [imageList, setImageList] = useState([]);
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

	const [watch_name, watch_slug] = watch(['name', 'slug']);

	const slug = useDebounce(watch_slug, 500);

	useEffect(() => {
		!isEditForm && setValue('slug', makeSlug(watch_name));
	}, [watch_name]);

	useEffect(() => {
		if (!isEditForm) {
			setValue('slug', makeSlug(slug));
			slug &&
				CollectionService.isSlugAvailable({ slug }).then((res) => {
					if (res.body) {
						clearErrors('slug');
						return;
					}
					setError('slug', { message: res.message });
				});
		}
	}, [slug]);

	useEffect(() => {
		if (isOpen && isEditForm) {
			reset(editData);
			setImageList(editData?.image ? [editData?.image] : []);
		} else {
			reset({});
			setImageList([]);
		}
	}, [editData, isEditForm, isOpen]);

	const handleImageAdd = useCallback(
		async (images: File[]) => {
			setIsUploading(true);
			const compressedImg = await compressImage(images[0]);
			if (!isEditForm) {
				setImageList(images);
				setValue('image', compressedImg);
				setIsUploading(false);
				return;
			}
			const formData: any = new FormData();
			formData.append('file', compressedImg);
			formData.append('id', editData?._id);
			CollectionService.uploadBanner(formData)
				.then((resp) => {
					setImageList([resp.body]);
					setValue('image', resp.body);
				})
				.catch((err) => ToastService.error(err.message))
				.finally(() => setIsUploading(false));
		},
		[editData, isEditForm]
	);

	return (
		<WxDrawer show={isOpen} handleClose={handleClose}>
			<div className='collection_form'>
				<WxDrawerHeader
					title={isEditForm ? 'Update Collection' : 'Add Collection'}
					closeIconAction={handleClose}
				/>
				<form onSubmit={handleSubmit(onSubmit)} noValidate>
					<WxDrawerBody>
						<TextInput
							label='Collection name'
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
							isDisabled={isEditForm}
							helpText={
								<div className='text_regular text_subtitle'>
									{ENV.STORE_DOMAIN}/products/collection/&nbsp;
									<span className='text_strong'>{watch_slug}</span>
								</div>
							}
							registerProperty={{
								...register('slug', { required: true }),
							}}
							color={errors?.slug ? 'danger' : 'secondary'}
							errorMessage={errors?.slug?.message as string}
						/>
						<div className='form_group'>
							<WxLabel>Collection details</WxLabel>
							<Controller
								control={control}
								name='description'
								render={({ field: { onChange, value } }) => (
									<WxEditor onEditorChange={onChange} defaultValue={value} />
								)}
							/>
						</div>
						<div className='form_group'>
							<WxLabel>Collection Image</WxLabel>
							<MediaInput
								name='image'
								control={control}
								// fileList={imageList}
								// onChange={handleImageAdd}
								// onRemove={handleImageRemove}
								isUploading={isUploading}
								multiple={false}
							/>
						</div>
					</WxDrawerBody>
					<WxDrawerFooter>
						<div className='collection_form__footer'>
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
								<WxButton variant='fill' type='submit' disabled={isDeletingImage || isSaving}>
									{isSaving ? <ButtonLoader /> : isEditForm ? 'Update' : 'Save'}
								</WxButton>
							</div>
						</div>
					</WxDrawerFooter>
				</form>
			</div>
		</WxDrawer>
	);
};

export default AddCollection;
