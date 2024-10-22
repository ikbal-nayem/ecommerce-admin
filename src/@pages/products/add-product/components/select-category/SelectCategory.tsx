import { Button } from '@components/Button';
import Drawer from '@components/Drawer';
import DrawerBody from '@components/Drawer/DrawerBody';
import DrawerFooter from '@components/Drawer/DrawerFooter';
import DrawerHeader from '@components/Drawer/DrawerHeader';
import { memo, useEffect, useState } from 'react';
import { CategoryService, ICategoryPayload } from 'services/api/products/Category.services';
import Preloader from 'services/utils/preloader.service';
import './SelectCategory.scss';
import SelectTree from './SelectTree';

import { ToastService } from 'services/utils/toastr.service';

type SelectCategoryProps = {
	selectedCategory?: ICategoryPayload;
	setCategory?: Function;
};

const SelectCategory = ({ setCategory, selectedCategory }: SelectCategoryProps) => {
	const [drawer_open, setDrawerOpen] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [categories, setCategories] = useState<ICategoryPayload[]>([]);
	const [localSelect, setLocalSelect] = useState<ICategoryPayload>(selectedCategory);

	useEffect(() => {
		drawer_open && getCategory();
	}, [drawer_open]);

	const handleClose = () => setDrawerOpen(false);

	const getCategory = () => {
		setIsLoading(true);
		CategoryService.getTree()
			.then((res) => {
				if (res.data.length) setCategories(res.data);
			})
			.catch((err) => ToastService.error(err))
			.finally(() => setIsLoading(false));
	};

	const onFinalSelect = () => {
		setCategory(localSelect);
		handleClose();
	};

	return (
		<>
			<Button variant='outline' onClick={() => setDrawerOpen(true)}>
				Select Category
			</Button>
			<Drawer show={drawer_open} handleClose={handleClose}>
				<div className='wx__category_select'>
					<DrawerHeader title='Select categories' onClickClose={handleClose} />

					<DrawerBody>
						{/* <TextInput
							type="search"
							startIcon={<Icon icon="search" />}
							placeholder="Search categories"
						/> */}

						{isLoading ? <Preloader absolutePosition /> : null}
						{!isLoading && !categories.length ? <h6 className='text-center'>No categories found!</h6> : null}

						<div className='nested_categories'>
							<SelectTree data={categories} setCategory={setLocalSelect} selectedCategory={localSelect} />
						</div>
					</DrawerBody>

					<DrawerFooter>
						<div className='wx__category_select__footer'>
							<Button className='me-3' variant='outline' color='secondary' onClick={handleClose}>
								Cancel
							</Button>
							<Button variant='fill' onClick={onFinalSelect}>
								Select Category
							</Button>
						</div>
					</DrawerFooter>
				</div>
			</Drawer>
		</>
	);
};

export default memo(SelectCategory);
