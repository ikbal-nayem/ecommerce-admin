import { Button } from '@components/Button';
import Checkbox from '@components/Checkbox';
import Drawer from '@components/Drawer';
import DrawerBody from '@components/Drawer/DrawerBody';
import DrawerFooter from '@components/Drawer/DrawerFooter';
import DrawerHeader from '@components/Drawer/DrawerHeader';
import TextInput from '@components/TextInput';
import React, { useEffect, useState } from 'react';
import { CollectionService, ICollectionPayload } from 'services/api/products/Collection.services';
import Preloader from 'services/utils/preloader.service';
import useDebounce from 'utils/debouncer';

import Icon from '@components/Icon';
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
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [collectionList, setCollectionList] = useState<ICollectionPayload[]>([]);
	let search = useDebounce(searchQuery, 500);

	const handleClose = () => setDrawerOpen(false);

	useEffect(() => {
		drawer_open && getCollectionList();
	}, [drawer_open]);

	useEffect(() => {
		search && getCollectionList(search);
	}, [search]);

	const getCollectionList = (searchString: string = null) => {
		setIsLoading(true);
		const payload = {
			body: { name: searchString },
			meta: { offset: 0, limit: 20 },
		};
		CollectionService.get(payload)
			.then((res) => {
				if (res.data?.length) setCollectionList(res.data);
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsLoading(false));
	};

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
							placeholder='Search categories'
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
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
