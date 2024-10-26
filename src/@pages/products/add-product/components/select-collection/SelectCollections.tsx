import { Button } from '@components/Button';
import Checkbox from '@components/Checkbox';
import Drawer from '@components/Drawer';
import DrawerBody from '@components/Drawer/DrawerBody';
import DrawerFooter from '@components/Drawer/DrawerFooter';
import DrawerHeader from '@components/Drawer/DrawerHeader';
import TextInput from '@components/TextInput';
import React, { useEffect, useRef, useState } from 'react';
import { CollectionService, ICollectionPayload } from 'services/api/products/Collection.services';
import Preloader from 'services/utils/preloader.service';
import { debounce } from 'utils/debouncer';

import Icon from '@components/Icon';
import { IRequestPayload } from '@interfaces/common.interface';
import useLoader from 'hooks/useLoader';
import { ToastService } from 'services/utils/toastr.service';
import './SelectCollections.scss';

type SelectCollectionProps = {
	selectedCollections?: ICollectionPayload[];
	setCollections?: (category: ICollectionPayload) => void;
};

const SelectCollection = ({ selectedCollections, setCollections }: SelectCollectionProps) => {
	const [drawer_open, setDrawerOpen] = useState(false);
	const [isLoading, setIsLoading] = useLoader(false);
	const [collectionList, setCollectionList] = useState<ICollectionPayload[]>([]);
	const requestPayload = useRef<IRequestPayload>({
		filter: { searchKey: '' },
		meta: {
			page: 0,
			limit: 10,
		},
	});

	const handleClose = () => setDrawerOpen(false);

	useEffect(() => {
		drawer_open && getCollectionList();
	}, [drawer_open]);

	const getCollectionList = () => {
		setIsLoading(true);
		CollectionService.search(requestPayload.current)
			.then((res) => {
				if (res.data?.length) setCollectionList(res.data);
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsLoading(false));
	};

	const onSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
		requestPayload.current.filter.searchKey = e.target.value;
		requestPayload.current.meta.page = 1;
		getCollectionList();
	}, 500);

	return (
		<>
			<Button variant='outline' onClick={() => setDrawerOpen(true)} className='mb-3'>
				Select Collections
			</Button>
			<Drawer show={drawer_open} handleClose={handleClose}>
				<div className='collection_select'>
					<DrawerHeader title='Select Collections' onClickClose={handleClose} />

					<DrawerBody>
						<TextInput
							type='search'
							startIcon={<Icon icon='search' />}
							placeholder='Search collections...'
							onChange={onSearch}
						/>
						<div className='collections'>
							<hr />
							{!collectionList?.length ? (
								isLoading ? (
									<Preloader />
								) : (
									<div className='text-center'>No collections found!</div>
								)
							) : null}
							<ul>
								{collectionList?.map((collection) => (
									<li className='bg-light px-2 py-1 rounded' key={collection._id}>
										<Checkbox
											id={collection._id}
											label={collection.name}
											noMargin
											onChange={() => setCollections(collection)}
											checked={selectedCollections.some((val) => val._id === collection._id)}
										/>
									</li>
								))}
							</ul>
						</div>
					</DrawerBody>

					<DrawerFooter>
						<div className='wx__category_select__footer'>
							<Button className='me-3' variant='outline' color='secondary' onClick={handleClose}>
								Cancel
							</Button>
							<Button variant='fill' onClick={handleClose}>
								Select Category
							</Button>
						</div>
					</DrawerFooter>
				</div>
			</Drawer>
		</>
	);
};

export default SelectCollection;
