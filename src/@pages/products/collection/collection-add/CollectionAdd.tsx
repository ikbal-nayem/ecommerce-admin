import { Button } from '@components/Button';
import MediaInput from '@components/MediaInput/MediaInput';
import TextInput from '@components/TextInput';
import WxDrawer from '@components/WxDrawer';
import WxDrawerBody from '@components/WxDrawer/WxDrawerBody';
import WxDrawerFooter from '@components/WxDrawer/WxDrawerFooter';
import WxDrawerHeader from '@components/WxDrawer/WxDrawerHeader';
import WxEditor from '@components/WxEditor/WxEditor';
import WxLabel from '@components/WxLabel';
import { ENV } from 'config/ENV.config';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CollectionService, ICollectionPayload } from 'services/api/products/Collection.services';
import { ButtonLoader } from 'services/utils/preloader.service';
import { isObjectNull } from 'utils/check-validity';
import useDebounce from 'utils/debouncer';
import makeSlug from 'utils/make-slug';
import './CollectionAdd.scss';

type AddCollectionProps = {
	isOpen: boolean;
	handleClose?: Function;
	onSubmit: any;
	editData?: ICollectionPayload;
	handleDelete?: Function;
	isSaving?: boolean;
};

const AddCollection = ({
	handleClose,
	isOpen,
	onSubmit,
	editData,
	handleDelete,
	isSaving,
}: AddCollectionProps) => {
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

	const isEditForm = !isObjectNull(editData);

	const [watch_name, watch_slug] = watch(['name', 'slug']);

	const slug = useDebounce(watch_slug, 500);

	useEffect(() => {
		!isEditForm && setValue('slug', makeSlug(watch_name));
	}, [watch_name]);

	useEffect(() => {
		if (!isEditForm) {
			// setValue('slug', makeSlug(slug));
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
		if (isEditForm) {
			reset({
				name: editData?.name,
				slug: editData?.slug,
				description: editData?.description,
				image: editData?.image,
			});
		} else
			reset({
				name: '',
				slug: '',
				description: '',
			});
	}, [editData]);

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
								...register('slug', { required: true, disabled: isEditForm }),
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
							<MediaInput name='image' control={control} multiple={false} />
						</div>
					</WxDrawerBody>
					<WxDrawerFooter>
						<div className='collection_form__footer'>
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
								<Button variant='fill' type='submit' disabled={isSaving}>
									{isSaving ? <ButtonLoader /> : isEditForm ? 'Update' : 'Save'}
								</Button>
							</div>
						</div>
					</WxDrawerFooter>
				</form>
			</div>
		</WxDrawer>
	);
};

export default AddCollection;
