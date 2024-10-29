import { Button } from '@components/Button';
import Drawer from '@components/Drawer';
import DrawerBody from '@components/Drawer/DrawerBody';
import DrawerFooter from '@components/Drawer/DrawerFooter';
import DrawerHeader from '@components/Drawer/DrawerHeader';
import Icon from '@components/Icon';
import Label from '@components/Label';
import MediaInput from '@components/MediaInput/MediaInput';
import Switch from '@components/Switch';
import TextEditor from '@components/TextEditor/Editor';
import TextInput from '@components/TextInput';
import { ENV } from 'config/ENV.config';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CollectionService, ICollectionPayload } from 'services/api/products/Collection.services';
import { isNull } from 'utils/check-validity';
import { debounce } from 'utils/debouncer';
import makeSlug from 'utils/make-slug';

const generateDefaultValues = (defaultValues?: ICollectionPayload) => ({
	name: defaultValues?.name || '',
	slug: defaultValues?.slug || '',
	description: defaultValues?.description || '',
	image: defaultValues?.image || '',
	isActive: !isNull(defaultValues?.isActive) ? defaultValues?.isActive : true,
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

	useEffect(() => {
		if (isEditForm) {
			reset(generateDefaultValues(editData));
		} else reset(generateDefaultValues());
	}, [editData]);

	const checkSlug = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
		if (isEditForm) return;
		if (!e.target.value) return clearErrors('slug');
		const slug = makeSlug(e.target.value);
		setValue('slug', slug);
		CollectionService.isSlugUnique(slug).then((res) => {
			res.data
				? clearErrors('slug')
				: setError('slug', {
						message: 'This slug is already used',
						type: 'invalid',
						types: { validate: false },
				  });
		});
	}, 800);

	const watch_slug = watch('slug');

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
								...register('name', { required: 'Provide a name', onChange: checkSlug }),
							}}
							color={errors?.name ? 'danger' : 'secondary'}
							errorMessage={errors?.name && 'Name is required!'}
						/>
						<TextInput
							label='Slug'
							endIcon={watch_slug && !errors?.slug && <Icon icon='done' color='success' />}
							isRequired
							isDisabled={isEditForm}
							isReadOnly={isEditForm}
							helpText={
								<div className='text_regular text_subtitle'>
									{ENV.STORE_DOMAIN}/collection/
									<span className='text_strong'>{watch_slug}</span>
								</div>
							}
							registerProperty={{
								...register('slug', {
									required: 'Slug is required',
									onChange: checkSlug,
								}),
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
						<div className='mt-4' style={{ maxWidth: '50%' }}>
							<Switch
								label='Collection Status'
								checkedTitle='Visible'
								unCheckedTitle='Hidden'
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
