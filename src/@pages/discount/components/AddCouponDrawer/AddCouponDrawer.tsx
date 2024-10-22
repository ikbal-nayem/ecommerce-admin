import {Button} from "@components/Button";
import Checkbox from "@components/Checkbox";
import WxDrawer from "@components/Drawer";
import WxDrawerBody from "@components/Drawer/DrawerBody";
import WxDrawerFooter from "@components/Drawer/DrawerFooter";
import WxDrawerHeader from "@components/WxDrawer/WxDrawerHeader";
import Icon from "@components/Icon";
import TextInput from "@components/TextInput";
import WxThumbnail from "@components/Thumbnail";
import { CustomerService } from "services/api/Customer.service";
import { GroupService } from "services/api/Group.service";
import { CategoryService } from "services/api/products/Category.services";
import { ProductService } from "services/api/products/Product.services";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import {
  setGlobCategoriesList,
  setGlobCustomerGroupList,
  setGlobCustomerList,
  setGlobProductList,
} from "store/reducers/utileReducer";
import { dispatch } from "store/store";
import useDebounce from "utils/debouncer";
import { imageURLGenerate } from "utils/utils";
import "./AddCouponDrawer.scss";

interface IAddCouponDrawer {
  drawer: boolean;
  setDrawer: Function;
  onDrawerClose?: () => void;
  drawerContent: string;
  setDrawerContent: Function;
  listContent: any;
  checkedData?: any;
  setCheckedData?: any;
  setListContent: Function;
  isEdit?: boolean;
  productIds?: string[];
  categoriesIds?: string[];
  customersIds?: string[];
  customersGroupIds?: string[];
}

const AddCouponDrawer = forwardRef(
  (
    {
      drawer,
      setDrawer,
      onDrawerClose,
      drawerContent,
      setDrawerContent,
      listContent,
      checkedData,
      setCheckedData,
      setListContent,
      isEdit = false,
      productIds,
      categoriesIds,
      customersIds,
      customersGroupIds,
    }: IAddCouponDrawer,
    ref
  ) => {
    const [loader, setLoader] = useState<boolean>(true);
    const [page, setPage] = useState<any>({
      products: 0,
      categories: 0,
      customers: 0,
      customerGroups: 0,
    });

    const totalPageSessionData =
      JSON.parse(sessionStorage.getItem("infinite-scroll-total-page")) || {};

    const [totalPage, setTotalPage] = useState<any>({
      products: totalPageSessionData.products || 0,
      categories: totalPageSessionData.categories || 0,
      customers: totalPageSessionData.customers || 0,
      customerGroups: totalPageSessionData.customerGroups || 0,
    });
    const loading = useRef(null);

    // states for search and debounce
    const [searchQuery, setSearchQuery] = useState<string>("");
    let search: string = useDebounce(searchQuery.trim(), 500);

    useEffect(() => {
      if (!!listContent?.[drawerContent]?.length && !page[drawerContent]) {
        setLoader(false);
        // return;
      }

      drawerContent == "products" && getProducts();
      drawerContent == "categories" && getCategoryList();
      drawerContent == "customers" && getCustomers();
      drawerContent == "customerGroups" && getGroup();
    }, [search, page]);

    useEffect(() => {
      if (search) {
        // when user will search anything page/offset number 0 will be pass as payload
        setPage({
          products: 0,
          categories: 0,
          customers: 0,
          customerGroups: 0,
        });
      } else {
        // when user will back from search state will be empty like initial stage otherwise it will remain with last searched data
        setListContent((state) => ({
          ...state,
          [drawerContent]: [],
        }));
      }
    }, [search]);

    const requireProperties = (
      data: [],
      id: string | number,
      name: string | number,
      img = null
    ) => {
      const newArray = data.map((obj: any) => {
        return {
          id: obj[id],
          name: obj[name],
          image: img ? obj[img] : null,
        };
      });
      return newArray;
    };

    // products
    const getProducts = () => {
      ProductService.search({
        body: {
          searchKey: search || null,
        },
        meta: {
          offset: search ? 0 : page.products,
          limit: 20,
          sort: [{ order: "desc", field: "createdOn" }],
        },
      })
        .then((res: any) => {
          const meta = res.meta;
          // set total page count for infinite scroll
          setTotalPage((state) => ({
            ...state,
            products: meta.totalPageCount,
          }));
          sessionStorage.setItem(
            "infinite-scroll-total-page",
            JSON.stringify({
              ...totalPageSessionData,
              products: meta.totalPageCount,
            })
          );
          const result = requireProperties(
            res.body,
            "id",
            "title",
            "thumbnail"
          );

          if (!search) {
            // adding data with previous data when use infinite scroll
            setListContent((state) => ({
              ...state,
              products: [...[...state.products], ...result],
            }));
          } else {
            // adding only new data when use search
            setListContent((state) => ({
              ...state,
              products: [...result],
            }));
          }
          dispatch(setGlobProductList(res.body));
        })
        .catch((err) => ToastService.error(err))
        .finally(() => setLoader(false));
    };

    //  end

    const getCategoryList = () => {
      CategoryService.get({
        body: {
          name: search || null,
        },
        meta: {
          offset: search ? 0 : page.categories,
          limit: 20,
          sort: [{ order: "asc", field: "name" }],
        },
      })
        .then((res) => {
          const meta = res.meta;
          // set total page count for infinite scroll
          setTotalPage((state) => ({
            ...state,
            categories: meta.totalPageCount,
          }));
          sessionStorage.setItem(
            "infinite-scroll-total-page",
            JSON.stringify({
              ...totalPageSessionData,
              categories: meta.totalPageCount,
            })
          );

          const result = requireProperties(res.body, "id", "name", "banner");

          if (!search) {
            // adding data with previous data when use infinite scroll
            setListContent((state) => ({
              ...state,
              categories: [...[...state.categories], ...result],
            }));
          } else {
            // adding only new data when use search
            setListContent((state) => ({
              ...state,
              categories: [...result],
            }));
          }

          dispatch(setGlobCategoriesList(res.body));
        })
        .catch((err) => {
          ToastService.error(err);
        })
        .finally(() => setLoader(false));
    };
    // end

    // customer list
    const getCustomers = () => {
      CustomerService.get({
        body: {
          name: search || null,
        },
        meta: {
          offset: search ? 0 : page.customers,
          limit: 20,
          sort: [{ order: "asc", field: "name" }],
        },
      })
        .then((res) => {
          const meta = res.meta;

          // set total page count for infinite scroll
          setTotalPage((state) => ({
            ...state,
            customers: meta.totalPageCount,
          }));

          sessionStorage.setItem(
            "infinite-scroll-total-page",
            JSON.stringify({
              ...totalPageSessionData,
              customers: meta.totalPageCount,
            })
          );

          const result = requireProperties(res.body, "customerId", "name");

          if (!search) {
            // adding data with previous data when use infinite scroll
            setListContent((state) => ({
              ...state,
              customers: [...[...state.customers], ...result],
            }));
          } else {
            // adding only new data when use search
            setListContent((state) => ({
              ...state,
              customers: [...result],
            }));
          }

          dispatch(setGlobCustomerList(res.body));
        })
        .catch((err) => {
          ToastService.error(err.message);
        })
        .finally(() => setLoader(false));
    };

    // end

    // customer group
    const getGroup = () => {
      GroupService.get({
        body: {
          title: search || null,
        },
        meta: {
          offset: search ? 0 : page.customerGroups,
          limit: 20,
          sort: [{ order: "asc", field: "title" }],
        },
      })
        .then((res) => {
          const meta = res.meta;
          // set total page count for infinite scroll
          setTotalPage((state) => ({
            ...state,
            customerGroups: meta.totalPageCount,
          }));
          sessionStorage.setItem(
            "infinite-scroll-total-page",
            JSON.stringify({
              ...totalPageSessionData,
              customerGroups: meta.totalPageCount,
            })
          );

          const result = requireProperties(res.body, "id", "title");

          if (!search) {
            // adding data with previous data when use infinite scroll
            setListContent((state) => ({
              ...state,
              customerGroups: [...[...state.customerGroups], ...result],
            }));
          } else {
            // adding only new data when use search
            setListContent((state) => ({
              ...state,
              customerGroups: [...result],
            }));
          }

          dispatch(setGlobCustomerGroupList(res.body));
        })
        .catch((err: any) => {
          ToastService.error(err.message);
        })
        .finally(() => setLoader(false));
    };
    // end

    const handleSelectedData = (data) => {
      const exists = checkedData[drawerContent].some(
        (item) => item.id === data.id
      );
      if (exists) {
        setCheckedData((state) => ({
          ...state,
          [drawerContent]: state[drawerContent].filter(
            (item) => item.id !== data.id
          ),
        }));
        return;
      }
      setCheckedData((state) => ({
        ...state,
        [drawerContent]: [...state[drawerContent], data],
      }));
    };

    // callback function for infinite scroll
    const handleObserver = useCallback(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          page[drawerContent] = page[drawerContent] + 1;
          setPage({ ...page });
        }
      },
      [page]
    );

    // for infinite scroll
    useEffect(() => {
      if (listContent[drawerContent]?.length) {
        const option = {
          root: null,
          rootMargin: "0px",
          threshold: 1.0,
        };

        const observer = new IntersectionObserver(handleObserver, option);

        loading.current && observer.observe(loading.current);
      }
    }, [listContent[drawerContent]]);

    return (
      <WxDrawer show={drawer} handleClose={onDrawerClose}>
        <div className="wx__coupon_drawer">
          <WxDrawerHeader
            title={`Select ${drawerContent}`}
            onClickClose={onDrawerClose}
          />
          <form noValidate>
            <WxDrawerBody>
              <div id="testDiv">
                <TextInput
                  onChange={(e: any) => {
                    setSearchQuery(e.target.value);
                    e.target.value.trim().length && setLoader(true);
                  }}
                  startIcon={<Icon variants="round" icon="search" />}
                  placeholder="search ..."
                />
                {/* <Button>00 {drawerContent} selected</Button> */}
                <div
                  style={{ minHeight: "70vh" }}
                  className="position-relative"
                >
                  {!loader || (
                    <Preloader className="position-absolute top-50 start-50 translate-middle" />
                  )}
                  {!!listContent[drawerContent]?.length && !loader
                    ? listContent[drawerContent].map(
                        (item: any, index: number) => {
                          return (
                            <Checkbox
                              key={item.id}
                              className="py-3 wx__product_list_in_select_product_drawer"
                              onChange={(e) => {
                                handleSelectedData(item);
                              }}
                              checked={checkedData[drawerContent].some(
                                (checkItem) => checkItem.id === item.id
                              )}
                              label={
                                <div className="d-flex align-items-center">
                                  <WxThumbnail
                                    src={imageURLGenerate(item?.image)}
                                  />
                                  <span className="ms_2">{item?.name}</span>
                                </div>
                              }
                            />
                          );
                        }
                      )
                    : null}
                  {listContent[drawerContent].length > 0 &&
                  totalPage[drawerContent] > page[drawerContent] + 1 ? (
                    <div
                      ref={loading}
                      className="text-primary text-center"
                    >
                      Loading...
                    </div>
                  ) : null}

                  {!listContent[drawerContent].length && !loader && (
                    <div className="no-item d-flex justify-content-center align-items-center">
                      <p className="text_h3 ">No item found</p>
                    </div>
                  )}
                </div>
              </div>
            </WxDrawerBody>
            <WxDrawerFooter>
              <div className="collection_form__footer">
                <div className="ms-auto d-flex">
                  <Button
                    className="me-3"
                    variant="outline"
                    color="secondary"
                    onClick={onDrawerClose}
                  >
                    Cancel
                  </Button>
                  {!!checkedData[drawerContent].length && (
                    <Button onClick={onDrawerClose} variant="fill">
                      Save
                    </Button>
                  )}
                </div>
              </div>
            </WxDrawerFooter>
          </form>
        </div>
      </WxDrawer>
    );
  }
);

export default AddCouponDrawer;
