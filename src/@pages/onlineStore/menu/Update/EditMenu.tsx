import WxButton from "@components/WxButton";
import WxDrawer from "@components/WxDrawer";
import WxDrawerBody from "@components/WxDrawer/WxDrawerBody";
import WxDrawerFooter from "@components/WxDrawer/WxDrawerFooter";
import WxDrawerHeader from "@components/WxDrawer/WxDrawerHeader";
import WxIcon from "@components/WxIcon/WxIcon";
import WxInput from "@components/WxInput";
import WxSwitch from "@components/WxSwitch";
import { MASTER_META_KEY } from "config/constants";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import isValidUrl from "utils/checkvalidUrl";
import "../Create/Create.scss";

const Create = ({
  isOpen,
  handleFormClose,
  handleEdit,
  dropdownData,
  editedData,
  formData,
  submitMenuForm,
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showSubItem, setShowSubItem] = useState<string>("-1");
  const [isCustom, setIsCustom] = useState<boolean>(
    editedData?.isCustom || false
  );
  const [dropdownList] = useState(dropdownData?.dropdownList);
  const [categories] = useState<any>(dropdownData?.categories);
  const [collection] = useState<any>(dropdownData?.collection);
  const [metaKey, setMetaKey] = useState<string>();
  const [page] = useState<any>(dropdownData?.page);
  const [autoFocus, setAutoFocus] = useState<boolean>(false);
  const [subDropdownList, setSubDropdownList] = useState({
    title: "",
    children: [],
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
    setError,
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    reset();
    if (editedData) reset({ ...editedData });
  }, [formData]);

  const onSubmitting = (requestData) => {
    if (requestData?.url) requestData.url = metaKey + requestData.url;
    if (
      !isCustom ||
      (isCustom &&
        (requestData?.url?.match("https") ||
          requestData?.url?.match("http") ||
          requestData?.url?.match("www.")))
    ) {
      requestData.isCustom = isCustom;
      if (editedData?.name) submitMenuForm(requestData);
      else submitMenuForm(requestData, formData.id);
      reset({});
      handleFormClose(true);
      return;
    }
    setError("url", { message: "URL must contain http/https/www" });
  };
  const setDropdownFun = (value) => {
    setShowSubItem(value);

    if (value?.metaKey === MASTER_META_KEY.STORE_MENU_TYPE_CATEGORIES) {
      setMetaKey("products?category=");
      setIsCustom(false);
      setSubDropdownList({ title: value.title, children: categories });
    } else if (value?.metaKey === MASTER_META_KEY.STORE_MENU_TYPE_COLLECTIONS) {
      setMetaKey("products?collection=");
      setIsCustom(false);
      setSubDropdownList({ title: value.title, children: collection });
    } else if (value?.metaKey === MASTER_META_KEY.STORE_MENU_TYPE_PAGES) {
      setMetaKey("pages/");
      setIsCustom(false);
      setSubDropdownList({ title: value.title, children: page });
    }
    //else if(value?.metaKey === MASTER_META_KEY.STORE_MENU_TYPE_PRODUCTS) setSubDropdownList({title: value.title, children: collection})
    else {
      setMetaKey("");
      setIsCustom(true);
      setShowSubItem("-1");
      setShowDropdown(false);
    }
  };

  const getCountaaa = (value) => {
    if (value === MASTER_META_KEY.STORE_MENU_TYPE_CATEGORIES)
      return categories.length;
    else if (value === MASTER_META_KEY.STORE_MENU_TYPE_COLLECTIONS)
      return collection.length;
    else if (value === MASTER_META_KEY.STORE_MENU_TYPE_PAGES)
      return page.length;
    //else if(value === MASTER_META_KEY.STORE_MENU_TYPE_PRODUCTS) return categories.length
    else {
      return;
    }
  };

  const setOptionFun = (value) => {
    setValue("url", value.slug);
    setShowSubItem("-1");
    setShowDropdown(false);
  };

  const setCustomFun = () => {
    setIsCustom(false);
    setShowDropdown(true);
    setValue("url", "");
    setAutoFocus(true);
  };

  return (
    <WxDrawer show={isOpen} handleClose={handleFormClose}>
      <div className="menu_create_sec">
        <WxDrawerHeader
          title={`${editedData ? "Edit" : "Add"} Menu Item`}
          closeIconAction={handleFormClose}
        />
        <form onSubmit={handleSubmit(onSubmitting)} noValidate>
          <WxDrawerBody>
            <div className="wx__row">
              {/* {formData?.name ? (
                <div className="wx__col-md-12 wx__col-sm-12">
                  <div className="parent-menu-show">{formData.name}</div>
                </div>
              ) : null} */}

              <div className="wx__col-md-12 wx__col-sm-12">
                <WxInput
                  isRequired
                  label="Menu Zone Name"
                  registerProperty={{ ...register("name", { required: true }) }}
                  color={errors?.name ? "danger" : "secondary"}
                  errorMessage={errors?.name ? "This field is required!" : ""}
                />
              </div>
              <div className="wx__col-md-12 wx__col-sm-12 wx__mt-2 link-field">
                <WxInput
                  isRequired
                  label="Link"
                  type="url"
                  isReadOnly={!isCustom}
                  registerProperty={{
                    ...register("url", {
                      required: "The field is required!",
                      validate: {
                        checkUrl: (val) =>
                          isValidUrl(val) || !isCustom ? true : "Invalid URL",
                      },
                    }),
                  }}
                  isAutoFocus={true}
                  color={errors?.url ? "danger" : "secondary"}
                  errorMessage={errors?.url && errors?.url?.message}
                  onClick={() => setShowDropdown(true)}
                  className="wx__mb-0"
                />
                {isCustom && (
                  <div className="custom-close">
                    <WxIcon icon="close" onClick={setCustomFun} />
                  </div>
                )}

                {showDropdown && !isCustom && (
                  <div className="set-menu-dropdown">
                    {showSubItem === "-1" ? (
                      dropdownList.map((item, index) => {
                        return (
                          <button
                            key={index}
                            onClick={() => setDropdownFun(item)}
                            type="button"
                            className="wx__w-100 wx__d-flex wx__align-items-center wx__justify-content-between category-btn"
                          >
                            <p className="wx__mb-1 count-submenu">
                              {item.title}
                              {getCountaaa(item.metaKey) ? (
                                <span>({getCountaaa(item.metaKey)})</span>
                              ) : null}
                            </p>
                            <WxIcon icon="chevron_right" />
                          </button>
                        );
                      })
                    ) : (
                      <div>
                        <div className="wx__d-flex wx__justify-content-between wx__align-items-center wx__mb-3 sub-category">
                          <div
                            className="wx__d-flex wx__align-items-center wx__ps-2"
                            onClick={() => setShowSubItem("-1")}
                          >
                            <WxIcon icon="chevron_left" />
                            <p className="wx__text_body wx__text_medium wx__mb-1 ms_2">
                              {subDropdownList.title}
                            </p>
                          </div>
                          <p className="wx__mb-0 wx__text_small wx__text_regular">
                            {subDropdownList.children.length} found
                          </p>
                        </div>
                        <div className="sub-dropdown">
                          {subDropdownList?.children?.map((item, index) => {
                            return (
                              <button
                                key={index}
                                type="button"
                                onClick={() => setOptionFun(item)}
                                className="wx__w-100 category-btn"
                              >
                                {item.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="wx__col-md-12 wx__col-sm-12 wx__mt-4 status_switch">
                <WxSwitch
                  label="Status"
                  checkedTitle="Active"
                  unCheckedTitle="Inactive"
                  defaultChecked={
                    getValues("isActive") === false ? false : true
                  }
                  registerProperty={{ ...register("isActive") }}
                />
              </div>
            </div>
          </WxDrawerBody>
          <WxDrawerFooter>
            <div className="delivery_create_sec__footer">
              <div className="wx__d-flex wx__justify-content-end">
                <WxButton
                  color="secondary"
                  type="button"
                  variant="outline"
                  className="wx__me-2"
                  onClick={handleFormClose}
                >
                  Cancel
                </WxButton>
                <WxButton variant="fill" type="submit">
                  Add
                </WxButton>
              </div>
            </div>
          </WxDrawerFooter>
        </form>
      </div>
    </WxDrawer>
  );
};
export default Create;
