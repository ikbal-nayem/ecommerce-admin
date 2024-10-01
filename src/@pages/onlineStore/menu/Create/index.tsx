import WxMainLg from "@components/MainContentLayout/WxMainLg";
import WxButton from "@components/WxButton";
import { WxFormHeader } from "@components/WxFormLayout";
import WxHr from "@components/WxHr";
import WxIcon from "@components/WxIcon/WxIcon";
import WxInput from "@components/WxInput";
import WxSwitch from "@components/WxSwitch";
import { MASTER_META_TYPE } from "config/constants";
import { ENV } from "config/ENV.config";
import { MENU } from "routes/path-name.route";
import { AdminService } from "services/api/admin/Admin.service";
import { MenuSetService } from "services/api/onlineStore/Menu.service";
import { CategoryService } from "services/api/products/Category.services";
import { CollectionService } from "services/api/products/Collection.services";
import { PagesSettingService } from "services/api/settings/Pages.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { parentTreeToLinear } from "utils/categoryTreeOperation";
import { generateUUID } from "utils/random-generate";
import "./Create.scss";
import Create from "./CreateMenu";
import MenuItemTable from "./MenuItemTable";

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
  const level = parseInt(ENV.MENU_LIST_LEVEL);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const handleFormClose = (reload: boolean = false) => {
    setEditedData(null);
    setOpenForm(false);
  };

  useEffect(() => {
    setLoading(true)
    const dropReq = AdminService.getByMetaType(MASTER_META_TYPE.STORE_MENU_TYPE)
    const categoryReq = CategoryService.categoryGetByStoreId('storeId')
    const collectionReq = CollectionService.get()
    const pageReq = PagesSettingService.getList({ meta: {}, body: {} })
    Promise.all([dropReq, categoryReq, collectionReq, pageReq])
    .then(([dropResp, categoryResp, collectionResp, pageResp]) => {
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
    .catch(()=> ToastService.error('Something went wrong'))
    .finally(()=> setLoading(false))
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
    MenuSetService.create(requestData)
      .then((res) => {
        ToastService.success(res.message);
        navigate(MENU);
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

  // Add children recursive function
  const recursiveMenuSet = (data: any[], id: string, newData) => {
    data.map((menu) => {
      if (menu?.id === id) {
        menu?.children?.push(newData);
      }
      if (menu?.children && menu?.children?.length)
        return recursiveMenuSet(menu.children, id, newData);
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
      if (menu?.children && menu?.children?.length)
        return recursiveMenuEdit(menu.children, id, newData);
    });

    return data.filter((menu) => menu && menu);
  };

  // Delete recursive function
  const recursiveDelete = (data: any[], rowData) => {
    data = data.filter((item) => item?.id !== rowData?.id);
    data.forEach((dd) => {
      dd?.children?.length &&
        (dd.children = recursiveDelete(dd.children, rowData));
    });
    return data;
  };

  const handleDelete = (data) => {
    const newData = recursiveDelete(menuList, data);
    setMenuList([...newData]);
  };

  const handleCreateSubcategory = (data) => {
    setFormData(data);
    setOpenForm(true);
  };

  const setOpenFormFun = () => {
    setFormData({});
    setOpenForm(true);
  };

  if (loading) return <Preloader />;

  return (
		<WxMainLg className="create_menu_sec">
			<WxFormHeader title="Create Menu" backNavigationLink={MENU} />
			<form onSubmit={handleSubmit(onSubmitting)} noValidate>
				<div className="row wx__m-auto w-100">
					<div className="col-lg-8 cards-sec col-md-12 col-sm-12 left">
						<div className="card wx__p-4 wx__mt-3">
							<WxInput
								isRequired
								label="Menu set name"
								isAutoFocus
								placeholder="e.g. Header"
								registerProperty={{
									...register("name", { required: true }),
								}}
								color={errors?.roleName ? "danger" : "secondary"}
								errorMessage={errors?.roleName ? "Role Name is required!" : ""}
							/>
						</div>

						<div className="card wx__p-4 wx__mt-3">
							<h6 className="wx__text_heading wx__text_semibold">Menu Items</h6>

							{menuList?.length ? (
								<div className="menu-item-list wx__mb-3">
									<MenuItemTable
										level={level}
										data={menuList}
										handleEdit={handleEdit}
										handleDelete={handleDelete}
										handleCreateSubcategory={handleCreateSubcategory}
									/>
								</div>
							) : null}

							<button
								className="add-menu-btn"
								type="button"
								onClick={setOpenFormFun}
							>
								<WxIcon hoverTitle="Add menu" icon="add_circle" /> Add menu
							</button>
						</div>
					</div>
					<div className="right cards-sec col-lg-4 col-md-12 col-sm-12 wx__mt-3">
						<div className="card wx__p-3">
							<WxButton type="submit" variant="fill" disabled={saving}>
								Save{saving ? <Preloader /> : null}
							</WxButton>

							<WxHr />

							<div className="wx__pe-5">
								<WxSwitch
									label={
										<div className="d-flex menu_help_icon wx__align-items-center">
											<span className="">Status</span>
										</div>
									}
									checkedTitle="Active"
									unCheckedTitle="Inactive"
									defaultChecked={true}
									registerProperty={{ ...register("isActive") }}
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
					dropdownData={{
						dropdownList: dropdownList,
						categories: categoriesDD,
						collection: collectionDD,
						page: pageDD,
					}}
					formData={formData}
					handleEdit={handleEdit}
					submitMenuForm={submitMenuForm}
				/>
			)}
		</WxMainLg>
	);
};

export default CreateMenu;
