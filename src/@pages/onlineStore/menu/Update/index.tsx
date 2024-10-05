import WxMainLg from '@components/MainContentLayout/MainLg';
import {Button} from '@components/Button';
import { WxFormHeader } from '@components/WxFormLayout';
import WxHr from '@components/WxHr';
import WxIcon from '@components/Icon';
import TextInput from '@components/TextInput';
import WxSwitch from '@components/WxSwitch';
import { MASTER_META_TYPE } from 'config/constants';
import { ENV } from 'config/ENV.config';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { MENU } from 'routes/path-name.route';
import { AdminService } from 'services/api/admin/Admin.service';
import { MenuSetService } from 'services/api/onlineStore/Menu.service';
import { CategoryService } from 'services/api/products/Category.services';
import { CollectionService } from 'services/api/products/Collection.services';
import { PagesSettingService } from 'services/api/settings/Pages.service';
import Preloader from 'services/utils/preloader.service';
import { ToastService } from 'services/utils/toastr.service';
import { parentTreeToLinear } from 'utils/categoryTreeOperation';
import { generateUUID } from 'utils/random-generate';
import '../Create/Create.scss';
import Create from './EditMenu';
import MenuItemTable from './MenuItemTable';

const CreateMenu = () => {
	const [saving, setSaving] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [openForm, setOpenForm] = useState<boolean>(false);
	const [editedData, setEditedData] = useState({});
	const [formData, setFormData] = useState({});
	const [menuList, setMenuList] = useState([]);
	const [dropdownList, setDropdownList] = useState([]);
	const [categoriesDD, setCategoriesDD] = useState<any>([]);
	const [collectionDD, setCollectionDD] = useState<any>([]);
	const [pageDD, setPageDD] = useState<any>([]);
	const level = +ENV.MENU_LIST_LEVEL;
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	const { id } = useParams();

	const handleFormClose = (reload: boolean = false) => {
		setEditedData(null);
		setOpenForm(false);
	};

	useEffect(() => {
		setLoading(true);
		const menuReq = MenuSetService.getById(id);
		const dropReq = AdminService.getByMetaType(MASTER_META_TYPE.STORE_MENU_TYPE);
		const categoryReq = CategoryService.categoryGetByStoreId('storeId');
		const collectionReq = CollectionService.get();
		const pageReq = PagesSettingService.getList({ meta: {}, body: {} });
		Promise.all([menuReq, dropReq, categoryReq, collectionReq, pageReq])
			.then(([menuResp, dropResp, categoryResp, collectionResp, pageResp]) => {
				if (menuResp.status == 200) {
					reset({});
					if (menuResp.body.menu) setMenuList(menuResp.body.menu);
					reset({ ...menuResp.body });
				}
				if (dropResp.body.length) {
					setDropdownList(dropResp.body);
				}
				if (categoryResp.body.length) {
					setCategoriesDD(getLinearCategories(categoryResp.body));
				}
				if (collectionResp.body.length) {
					setCollectionDD(collectionResp.body);
				}
				if (pageResp.body.length) {
					setPageDD(pageDataStructure(pageResp.body));
				}
			})
			.catch(() => ToastService.error('Something went wrong'))
			.finally(() => setLoading(false));
	}, []);

	const getLinearCategories = (categoryList, id = null) => {
		let categoryCopy = [...categoryList];
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
		return linearData;
	};

	const pageDataStructure = (data) => {
		let tempData = [];
		data.forEach((item) => {
			tempData.push({ id: item.id, slug: item.slug, name: item.title });
		});
		return tempData;
	};

	const onSubmitting = (requestData) => {
		Object.assign(requestData, { menu: menuList });
		setSaving(true);
		MenuSetService.update(requestData)
			.then((res) => {
				if (res?.status == 200) {
					reset({});
					if (res?.body?.menu) setMenuList(res.body.menu);
					reset({ ...res.body });
				}
				ToastService.success(res.message);
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setSaving(false));
	};

	const handleEdit = (data) => {
		setEditedData(data);
		setOpenForm(true);
	};

	const submitMenuForm = (data, parentId) => {
		let temp = menuList;
		if (parentId?.length) {
			// add Children
			data.id = generateUUID();
			data.children = [];
			setMenuList(recursiveMenuSet(temp, parentId, data));
			setFormData({});
		} else if (data?.id) {
			// update
			setMenuList(recursiveMenuEdit(temp, data.id, data));
			setEditedData({});
		} else {
			// create
			data.id = generateUUID();
			data.children = [];
			temp.push(data);
			setMenuList(temp);
		}
		setOpenForm(true);
	};

	// Add childrebn recursive function
	const recursiveMenuSet = (data: any[], id: string, newData) => {
		data.map((menu) => {
			if (menu?.id === id) {
				menu?.children?.push(newData);
			}
			if (menu?.children && menu?.children?.length) return recursiveMenuSet(menu.children, id, newData);
		});

		return data;
	};

	// Menu edit recursive function
	const recursiveMenuEdit = (data: any[], id: string, newData) => {
		data.map((menu) => {
			if (menu?.id === id) {
				menu.name = newData.name;
				menu.url = newData.url;
				menu.isActive = newData.isActive;
			}
			if (menu?.children && menu?.children?.length) return recursiveMenuEdit(menu.children, id, newData);
		});

		return data;
	};

	// Status Change recursive function
	const recursiveStatusChange = (data: any[], rowData, newStatus) => {
		data.map((menu) => {
			if (menu?.id === rowData.id) {
				menu.isActive = newStatus;
				menu.name = rowData.name;
				menu.url = rowData.url;
				menu.isCustom = rowData.isCustom;
			}
			if (menu?.children && menu?.children?.length)
				return recursiveStatusChange(menu.children, rowData, newStatus);
		});

		return data;
	};

	// Delete recursive function
	const recursiveDelete = (data: any[], rowData) => {
		data = data.filter((item) => item?.id !== rowData?.id);
		data.forEach((dd) => {
			dd?.children?.length && (dd.children = recursiveDelete(dd.children, rowData));
		});
		return data;
	};

	const handleCreateSubcategory = (data) => {
		setFormData(data);
		setOpenForm(true);
	};

	const setOpenFormFun = () => {
		setFormData({});
		setOpenForm(true);
	};

	const onStatusChange = (data, isChecked) => {
		let temp = menuList;
		setMenuList(recursiveStatusChange(temp, data, isChecked));
	};

	const handleDelete = (data) => {
		const newData = recursiveDelete(menuList, data);
		setMenuList([...newData]);
	};

	if (loading) return <Preloader />;

	return (
		<WxMainLg className='create_menu_sec'>
			<WxFormHeader title='Update Menu' backNavigationLink={MENU} />
			<form onSubmit={handleSubmit(onSubmitting)} noValidate>
				<div className='row m-auto w-100'>
					<div className='col-lg-8 cards-sec col-md-12 col-sm-12 left'>
						<div className='card p-4 mt-3'>
							<TextInput
								isRequired
								label='Menu set name'
								isAutoFocus
								placeholder='e.g. Header'
								registerProperty={{
									...register('name', { required: true }),
								}}
								color={errors?.roleName ? 'danger' : 'secondary'}
								errorMessage={errors?.roleName ? 'Role Name is required!' : ''}
							/>
						</div>

						<div className='card p-4 mt-3'>
							<div className='d-flex align-items-center justify-content-between mb-4 add-menu'>
								<h6 className='mb-0 text_heading text_semibold'>Menu Items</h6>
								<WxIcon hoverTitle='Add menu' icon='add_circle' onClick={setOpenFormFun} />
							</div>

							{menuList?.length ? (
								<div className='menu-item-list mb-3'>
									<MenuItemTable
										level={level}
										data={menuList}
										handleEdit={handleEdit}
										onStatusChange={onStatusChange}
										handleDelete={handleDelete}
										handleCreateSubcategory={handleCreateSubcategory}
									/>
								</div>
							) : (
								<div className='menu-item-sec mb-3'>
									<p className='text_body text_regular'>No menu items added</p>
								</div>
							)}

							<button className='add-menu-btn' type='button' onClick={setOpenFormFun}>
								<WxIcon icon='add_circle' /> Add menu
							</button>
						</div>
					</div>
					<div className='right col-lg-4 cards-sec col-md-12 col-sm-12 mt-3'>
						<div className='card p-3'>
							<Button type='submit' variant='fill' disabled={saving}>
								Update{saving ? <Preloader /> : null}
							</Button>
							<WxHr />
							<div className='pe-5'>
								<WxSwitch
									label={
										<div className='d-flex menu_help_icon align-items-center'>
											<span className=''>Status</span>
										</div>
									}
									checkedTitle='Active'
									unCheckedTitle='Inactive'
									defaultChecked={true}
									registerProperty={{ ...register('isActive') }}
								/>
							</div>
						</div>
					</div>
				</div>
			</form>
			{openForm && (
				<Create
					isOpen={openForm}
					handleFormClose={handleFormClose}
					editedData={editedData}
					formData={formData}
					handleEdit={handleEdit}
					dropdownData={{
						dropdownList: dropdownList,
						categories: categoriesDD,
						collection: collectionDD,
						page: pageDD,
					}}
					submitMenuForm={submitMenuForm}
				/>
			)}
		</WxMainLg>
	);
};

export default CreateMenu;
