import { Button } from '@components/Button';
import { ConfirmationModal } from '@components/ConfirmationModal/ConfirmationModal';
import Icon from '@components/Icon';
import MainLg from '@components/MainContentLayout/MainLg';
import NotFound from '@components/NotFound/NotFound';
import Pagination from '@components/Pagination';
import TextInput from '@components/TextInput';
import CollectionTBSkelton from '@components/WxSkelton/CollectionTBSkelton';
import { IMeta, IRequestPayload } from '@interfaces/common.interface';
import useLoader from 'hooks/useLoader';
import { useEffect, useRef, useState } from 'react';
import { CollectionService, ICollectionPayload } from 'services/api/products/Collection.services';
import { ToastService } from 'services/utils/toastr.service';
import { isNull } from 'utils/check-validity';
import { debounce } from 'utils/debouncer';
import { makeFormData } from 'utils/preprocessor';
import skeltonLoader from 'utils/skeltonLoader';
import CollectionAdd from './collection-form';
import CollectionTable from './collection-table';
import './Collection.scss';

const reqBody = {
	filter: { searchKey: '' },
	meta: {
		page: 0,
		limit: 10,
	},
};

const Collection = () => {
	const [open, setOpen] = useState(false);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [isLoading, setIsLoading] = useLoader(true);
	const [isLoader, setIsLoader] = useState<boolean>(true);
	const [isSaving, setIsSaving] = useLoader(false);
	const [collections, setCollections] = useState<ICollectionPayload[]>();
	const [collectionMeta, setCollectionMeta] = useState<any>();
	const deleteItem = useRef(null);
	const editData = useRef<ICollectionPayload>();
	const requestPayload = useRef<IRequestPayload>(reqBody);

	const handleClose = () => {
		setOpen(false);
		setIsConfirmOpen(false);
		editData.current = null;
		deleteItem.current = null;
	};

	useEffect(() => {
		getCollection();
	}, []);

	const getCollection = () => {
		setIsLoading(true);
		CollectionService.search(requestPayload.current)
			.then((res) => {
				setCollections(res?.data);
				setCollectionMeta(res.meta || {});
			})
			.catch((err) => ToastService.error(err))
			.finally(() => {
				setIsLoading(false);
				skeltonLoader(setIsLoader);
			});
	};

	const onPaginationChange = (meta: IMeta) => {
		requestPayload.current.meta = meta;
		getCollection();
	};

	const onSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
		requestPayload.current.filter.searchKey = e.target.value;
		requestPayload.current.meta.page = 1;
		getCollection();
	}, 500);

	const handleEdit = (data: ICollectionPayload) => {
		editData.current = data;
		setOpen(true);
	};

	// This function will be called when user click on comfirm delete button
	const onConfirmDelete = () => {
		const { _id } = deleteItem.current;
		if (!_id) {
			handleClose();
			return;
		}
		setIsSaving(true);
		CollectionService.delete(_id)
			.then((res) => {
				ToastService.success('Collection deleted successfully');
				handleClose();
				getCollection();
				onConfirmClose();
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsSaving(false));
	};

	const handleDelete = (item: ICollectionPayload) => {
		deleteItem.current = item;
		setIsConfirmOpen(true);
	};

	const onConfirmClose = () => {
		deleteItem.current = null;
		setIsConfirmOpen(false);
	};

	const onSubmit = async (data: ICollectionPayload) => {
		setIsSaving(true);
		if (!isNull(editData.current)) {
			const fd = await makeFormData(data);
			CollectionService.update(editData.current?._id, fd)
				.then((response) => {
					ToastService.success(response.message);
					handleClose();
					getCollection();
				})
				.catch((error) => ToastService.error(error.message))
				.finally(() => setIsSaving(false));
			return;
		}

		const fd = await makeFormData(data);
		CollectionService.create(fd)
			.then((response) => {
				ToastService.success(response.message);
				handleClose();
				getCollection();
			})
			.catch((error) => ToastService.error(error.message))
			.finally(() => setIsSaving(false));
		return;
	};

	return (
		<MainLg className='collection_container'>
			<div className='d-flex justify-content-between align-items-center'>
				<h4 className='text_h4 text_semibold mb-0'>Collection</h4>
				<Button disabled={isLoader} variant='fill' onClick={() => setOpen(true)}>
					Add Collection
				</Button>
				<CollectionAdd
					isOpen={open}
					handleClose={handleClose}
					onSubmit={onSubmit}
					editData={editData.current}
					isSaving={isSaving}
					handleDelete={handleDelete}
				/>
			</div>
			{isLoader ? (
				<div className='bg-white mt-3 rounded'>
					<CollectionTBSkelton viewBox='0 0 600 310' />
				</div>
			) : (
				<div className='card mt-3'>
					<div className='p-3'>
						<TextInput
							noMargin
							startIcon={<Icon icon='search' />}
							onChange={onSearch}
							placeholder='Search collection...'
						/>
					</div>
					{!isLoader && !isLoading && !collections?.length ? (
						<div className='mt-3'>
							<NotFound title='No collection found!' />
						</div>
					) : null}
					{collections?.length ? (
						<>
							<CollectionTable data={collections} handleEdit={handleEdit} onDelete={handleDelete} />
							<div className='p-4'>
								<Pagination meta={collectionMeta} onPaginationChange={onPaginationChange} />
							</div>
						</>
					) : null}
				</div>
			)}
			<ConfirmationModal
				isSubmitting={isSaving}
				isOpen={isConfirmOpen}
				onClose={onConfirmClose}
				onConfirm={onConfirmDelete}
				body={`Are your sure you want to delete '${deleteItem.current?.name}'? This action wont be reverseable!`}
			/>
		</MainLg>
	);
};

export default Collection;
