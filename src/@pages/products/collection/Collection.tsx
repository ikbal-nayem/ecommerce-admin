import { Button } from '@components/Button';
import { ConfirmationModal } from '@components/ConfirmationModal/ConfirmationModal';
import MainLg from '@components/MainContentLayout/MainLg';
import NotFound from '@components/NotFound/NotFound';
import Pagination from '@components/WxPagination/WxPagination';
import CollectionTBSkelton from '@components/WxSkelton/CollectionTBSkelton';
import useLoader from 'hooks/useLoader';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CollectionService, ICollectionPayload } from 'services/api/products/Collection.services';
import { ToastService } from 'services/utils/toastr.service';
import { isObjectNull } from 'utils/check-validity';
import { makeFormData } from 'utils/preprocessor';
import skeltonLoader from 'utils/skeltonLoader';
import CollectionAdd from './collection-add/CollectionAdd';
import CollectionTable from './collection-table/CollectionTable';
import './Collection.scss';

const meta = {
	meta: {
		page: 0,
		limit: 10,
		sort: [
			{
				order: 'desc',
				field: 'createdOn',
			},
		],
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
	const [searchParams, setSearchParams] = useSearchParams();
	const [currentPage, setCurrentPage] = useState<number>(
		Number(searchParams.get('page')) ? Number(searchParams.get('page')) - 1 : 0
	);
	const [paginationLimit, setPaginationLimit] = useState(10);
	const editData = useRef<ICollectionPayload>();

	const handleClose = () => {
		setOpen(false);
		setIsConfirmOpen(false);
		editData.current = null;
		deleteItem.current = null;
	};

	useEffect(() => {
		if (currentPage || paginationLimit) getCollection();
	}, [currentPage, paginationLimit]);

	const getCollection = () => {
		setIsLoading(true);
		CollectionService.get()
			.then((res) => {
				setCollections(res?.data || []);
				setCollectionMeta(res.meta || {});
			})
			.catch((err) => ToastService.error(err))
			.finally(() => {
				setIsLoading(false);
				skeltonLoader(setIsLoader);
			});
	};

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
		if (!isObjectNull(editData.current)) {
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
			{!isLoader && !isLoading && !collections?.length ? (
				<div className='mt-3'>
					<NotFound title='No collection found!' />
				</div>
			) : null}
			{isLoader ? (
				<div className='bg-white mt-3 rounded'>
					<CollectionTBSkelton viewBox='0 0 600 310' />
				</div>
			) : (
				<div className='collection_table_content card'>
					{collections?.length ? (
						<>
							<CollectionTable data={collections} handleEdit={handleEdit} onDelete={handleDelete} />
							<div className='p-4'>
								<Pagination
									meta={collectionMeta}
									currentPage={currentPage}
									setCurrentPage={setCurrentPage}
									paginationLimit={paginationLimit}
									setPaginationLimit={setPaginationLimit}
								/>
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
