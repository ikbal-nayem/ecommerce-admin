import { Button } from '@components/Button';
import Drawer from '@components/Drawer';
import DrawerBody from '@components/Drawer/DrawerBody';
import DrawerFooter from '@components/Drawer/DrawerFooter';
import DrawerHeader from '@components/Drawer/DrawerHeader';
import MediaInput from '@components/MediaInput/MediaInput';
import TextInput from '@components/TextInput';
import TextEditor from '@components/TextEditor/Editor';
import Label from '@components/Label';
import { ENV } from 'config/ENV.config';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CollectionService, ICollectionPayload } from 'services/api/products/Collection.services';
import { isNull } from 'utils/check-validity';
import useDebounce from 'utils/debouncer';
import makeSlug from 'utils/make-slug';

const generateDefaultValues = (defaultValues?: ICollectionPayload) => ({
	name: defaultValues?.name || '',
	slug: defaultValues?.slug || '',
	description: defaultValues?.description || '',
	image: defaultValues?.image || '',
	isActive: defaultValues?.isActive || '',
});

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
	} = useForm({ defaultValues: generateDefaultValues(editData) });

	const isEditForm = !isNull(editData);

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
			reset(generateDefaultValues(editData));
		} else reset(generateDefaultValues());
	}, [editData]);

	return (
		<Drawer show={isOpen} handleClose={handleClose}>
			<div className='collection_form'>
				<DrawerHeader
					title={isEditForm ? 'Update Collection' : 'Add Collection'}
					onClickClose={handleClose}
				/>
				<form onSubmit={handleSubmit(onSubmit)} noValidate>
					<DrawerBody>
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
							<Label>Collection details</Label>
							<Controller
								control={control}
								name='description'
								render={({ field: { onChange, value } }) => (
									<TextEditor onEditorChange={onChange} defaultValue={value} />
								)}
							/>
						</div>
						<div className='form_group'>
							<Label>Collection Image</Label>
							<MediaInput name='image' control={control} multiple={false} />
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
									{isEditForm ? 'Update' : 'Save'}
								</Button>
							</div>
						</div>
					</DrawerFooter>
				</form>
			</div>
		</Drawer>
	);
};

export default AddCollection;
