import { ConfirmationModal } from "@components/ConfirmationModal/ConfirmationModal";
import WxMainLg from "@components/MainContentLayout/WxMainLg";
import WxNotFound from "@components/NotFound/WxNotFound";
import SelectOption from "@components/Select/Select";
import WxButton from "@components/WxButton";
import { WxFormHeader } from "@components/WxFormLayout";
import WxHr from "@components/WxHr";
import WxIcon from "@components/WxIcon/WxIcon";
import CustomerAdresSkelton from "@components/WxSkelton/Customer/CustomerAdresSkelton";
import CustomerContactDtls from "@components/WxSkelton/Customer/CustomerContactDtls";
import CustomerDtlInfoSkelton from "@components/WxSkelton/Customer/CustomerDtlInfoSkelton";
import CustomerLastOrdrSkelton from "@components/WxSkelton/Customer/CustomerLastOrdrSkelton";
import WxTag from "@components/WxTag";
import WxThumbnail from "@components/WxThumbnail/WxThumbnail";
import {
	CUSTOMERS,
	CUSTOMER_CREATE,
	ORDER,
	ORDER_CREATE,
} from "routes/path-name.route";
import { CustomerService } from "services/api/Customer.service";
import { GroupService } from "services/api/Group.service";
import { OrderService } from "services/api/Order.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { statusColorMapping } from "utils/colorMap";
import skeltonLoader from "utils/skeltonLoader";
import { generateDateFormat } from "utils/splitDate";
import { imageURLGenerate } from "utils/utils";
import AddressManage from "./components/AddressMange/AddressMange";
import CustomerGroup from "./components/CustomerGroup";
import CustomerInfo from "./components/CustomerInfo/CustomerInfo";
import { CustomerEditModal } from "./components/modals/customer-edit-form/CustmrEditModal";
import "./CustomerDetails.scss";

const CustomerDetails = () => {
  const { register, handleSubmit, setValue, reset } = useForm();

  const navigate = useNavigate();

  const [isEditCustomerInfo, setIsEditCustomerInfo] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isEditor, setIsEditor] = useState<boolean>(false);
  const [isGroupDrawerOpen, setIsGroupDrawerOpen] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isEditGroup, setIsEditGroup] = useState<boolean>(false);
  const [customerNotFound, setIsCustomerNotFound] = useState<boolean>(false);
  const [customer, setCustomer] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [customerAddresses, setCustomerAddresses] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<any[]>([]);

  const [lastOrder, setLastOrder] = useState<any>();
  const [statistics, setStatistics] = useState<any>();

  const [customerDetailsLoader, setCustomerDetailsLoader] =
    useState<boolean>(true);
  const [customerAddressLoader, setCustomerAddressLoader] =
    useState<boolean>(true);

  const [lastOrderLoader, setLastOrderLoader] = useState<boolean>(true);

  const { activePlan } = useSelector((state: any) => state?.user);

  const { id } = useParams();

  useEffect(() => {
    if (!isDrawerOpen) reset();
  }, [isDrawerOpen]);

  useEffect(() => {
    getGroup();
    getCustomerAddress();
    getCustomerLastOrder();
    getCustomerStatistics();
  }, []);

  useEffect(() => {
    if (isLoading) getCustomerDetails();
  }, [id, isLoading]);

  useEffect(() => {
    if (!isLoading) getGroup();
  }, [isGroupDrawerOpen]);

  const getCustomerDetails = () => {
    CustomerService.profile(id)
      .then((res) => {
        setCustomer(res.body);
        setValue("firstName", res.body?.customer.firstName);
        setValue("lastName", res.body?.customer.lastName);
        setValue("email", res.body?.customer.email);
        setValue("phoneNumber", res.body?.customer.phoneNumber);
        setSelectedGroups(res.body?.groups);
        setIsCustomerNotFound(false);
      })
      .catch((err) => {
        setIsCustomerNotFound(true);
        ToastService.error(err.message);
      })
      .finally(() => {
        skeltonLoader(setCustomerDetailsLoader);
        setIsLoading(false);
      });
  };

  const onSubmitCustomerInfo = (requestData) => {
    requestData.id = customer?.customer?.id;
    CustomerService.update(requestData)
      .then((res) => {
        ToastService.success("Customer info updated successfully");
        setIsEditCustomerInfo(false);
        customer.customer = res.body;
        setCustomer(customer);
      })
      .catch((err) => {
        ToastService.error(err.message);
      });
  };

  const getCustomerAddress = () => {
    CustomerService.getAddress({ body: { customer: { id: id } } })
      .then((res) => {
        setCustomerAddresses(res.body);
      })
      .catch((err) => ToastService.error)
      .finally(() => {
        skeltonLoader(setCustomerAddressLoader);
      });
  };

  const onDeleteCustomer = () => {
    setIsOpenModal(true);
  };

  const onConfirmDelete = () => {
    if (!customer.customer.id) return;
    setIsLoading(true);
    CustomerService.delete([customer.customer.id])
      .then((res) => {
        ToastService.success("Customer deleted successfully");
        navigate(CUSTOMERS);
      })
      .catch((err) => {
        ToastService.error(err.message);
      })
      .finally(() => setIsLoading(false));
  };

  const onAddNewAddress = () => {
    setIsDrawerOpen(true);
    setIsEditor(true);
    reset();
  };

  const onAddressManage = () => {
    setIsDrawerOpen(true);
    setIsEditor(false);
  };

  const onCloseMangeDrawer = () => {
    setIsGroupDrawerOpen(false);
  };

  const getGroup = () => {
    // setIsLoading(true);
    GroupService.get({})
      .then((response) => {
        if (response.body?.length) {
          setGroups(response.body);
        }
      })
      .catch((err) => {
        ToastService.error(err.message);
      })
      .finally(() => setIsLoading(false));
  };

  const onUpdateGroup = () => {
    selectedGroups.forEach((item) => {
      delete item.value,
        delete item.title,
        delete item.label,
        delete item.storeId;
    });
    const formData: any = {};
    formData.customerId = customer.customer.id;
    formData.groups = selectedGroups;
    CustomerService.groupUpdate(formData)
      .then((res) => {
        ToastService.success("Customer group updated successfully");
        // setIsLoading(true);
        getCustomerDetails();
        setIsEditGroup(false);
      })
      .catch((err) => {
        ToastService.error(err.message);
      });
  };

  const getCustomerLastOrder = () => {
    OrderService.getCustomerLastOrder({
      body: {
        customerId: id,
      },
    })
      .then((res) => {
        setLastOrder(res.body);
      })
      .finally(() => {
        skeltonLoader(setLastOrderLoader);
      });
  };
  const getCustomerStatistics = () => {
    OrderService.getCustomerStatistics({
      body: {
        customerId: id,
      },
    }).then((res) => {
      setStatistics(res.body);
    });
  };

  return (
    <WxMainLg className="wx__customer_details">
      <div className="wx__customer_header wx__d-flex wx__align-items-center wx__justify-content-between">
        {!isLoading && (
          <WxFormHeader
            noMargin
            title={customer?.customer ? "Customer Details" : "Back"}
            backNavigationLink={CUSTOMERS}
          />
        )}
        {customer?.customer && (
          <WxButton
            variant="none"
            color="primary"
            onClick={() => navigate(ORDER_CREATE + "?customer_id=" + id)}
            disabled={!activePlan?.hasManualOrder}
          >
            create Order
          </WxButton>
        )}
      </div>
      {isLoading && <Preloader absolutePosition />}
      {!isLoading && customer?.customer ? (
        <div className="wx__row">
          <div className="wx__col-lg-8 wx__col-md-7 wx__col-sm-12 wx__mt-3">
            {customerDetailsLoader ? (
              <div className="wx__card wx__customer-info wx__mb-3">
                <CustomerDtlInfoSkelton viewBox="0 0 650 200" />
                {/* <CustomerHistory /> */}
              </div>
            ) : (
              <div className="wx__card wx__p-4 wx__customer-info wx__mb-3">
                <CustomerInfo customer={customer} statistics={statistics} />
                {/* <CustomerHistory /> */}
              </div>
            )}
            {lastOrderLoader ? (
              <div className="wx__bg-white wx__rounded wx__mb-2">
                <CustomerLastOrdrSkelton viewBox="0 0 600 245" />
              </div>
            ) : (
              <div className="order_history wx__bg-white wx__p-3 wx__rounded wx__mb-3">
                <p className="wx__text_body wx__text_medium">LAST ORDER</p>
                <div className="wx__d-flex wx__justify-content-between">
                  <div className="wx__d-flex wx__justify-content-between wx__align-items-center">
                    <p className="m-0 wx__text_body wx__text_strong order-number">
                      Order {lastOrder?.orderNo || "#0000"}
                    </p>
                    {lastOrder?.orderStatus ? (
                      <WxTag
                        label={lastOrder?.orderStatus}
                        color={statusColorMapping(lastOrder?.orderStatus)}
                        className="wx__ms-2"
                      />
                    ) : null}
                  </div>
                  <span className="wx__text_subtitle">
                    {lastOrder?.orderDate
                      ? generateDateFormat(
                          lastOrder?.orderDate,
                          "%date% %MM%, %yyyy% at %hour%:%minute% %ampm%"
                        )
                      : null}
                  </span>
                </div>
                {lastOrder?.orderLineList?.map((lineItem, index) => (
                  <div
                    className="wx__d-flex wx__justify-content-between wx__align-items-center mt-4"
                    key={index}
                  >
                    <div className="wx__d-flex wx__justify-content-between  wx__align-items-center">
                      <WxThumbnail
                        name={lineItem?.productName}
                        src={
                          imageURLGenerate(
                            lineItem?.productImages?.length &&
                              lineItem?.productImages[0]?.previewUrl
                          ) || null
                        }
                      />
                      <div className="ms-3 ">
                        <p className="m-0 wx__text_h6 wx__text_medium text-overflow-hidden">
                          {lineItem?.productName || ""}
                        </p>
                        <span className="wx__text_subtitle">
                          {lineItem?.quantity || ""} Piece -{" "}
                          {lineItem?.variant
                            ?.map((variant) => variant.value)
                            ?.join("/ ") || ""}{" "}
                        </span>
                      </div>
                    </div>
                    <h5 className="wx__text_h6 wx__text_medium">
                      {lineItem?.subTotal?.toFixed().toLocaleString() || "0.00"}{" "}
                      BDT
                    </h5>
                  </div>
                ))}

                <WxHr />
                <div className="wx__d-flex wx__justify-content-end">
                  <WxButton
                    variant="fill"
                    onClick={() => navigate(ORDER + "?customerId=" + id)}
                  >
                    View All Orders
                  </WxButton>
                </div>
              </div>
            )}
            {!customerDetailsLoader && (
              <div className="hide-mobile-view">
                <WxButton
                  variant="outline"
                  color="danger"
                  onClick={onDeleteCustomer}
                >
                  Delete Customer
                </WxButton>
              </div>
            )}
          </div>
          <div className="wx__col-lg-4 wx__col-md-5 wx__col-sm-12 wx__mt-3">
            {customerDetailsLoader ? (
              <div className="wx__bg-white wx__rounded wx__mb-3">
                <CustomerContactDtls viewBox="0 0 380 170" />
              </div>
            ) : (
              <div className="wx__card wx__p-4 wx__customer-contact-info">
                <div className="wx__d-flex wx__justify-content-between">
                  <div className="wx__text_body wx__text_medium">
                    CONTACT DETAILS
                  </div>
                  <WxIcon
                    onClick={() => setIsEditCustomerInfo(true)}
                    icon="edit"
                  />
                </div>
                {customer?.customer?.email && (
                  <div className="wx__d-flex wx__align-items-center contact-email wx__mt-3">
                    <WxIcon icon="email" />
                    <span className="text wx__ms-2">
                      {customer?.customer?.email || ""}
                    </span>
                  </div>
                )}
                {customer?.customer?.phoneNumber && (
                  <div className="wx__d-flex wx__align-items-center customer-phone wx__mt-1">
                    <WxIcon icon="phone" />
                    <span className="text wx__ms-2">
                      {customer?.customer?.phoneNumber || ""}
                    </span>
                  </div>
                )}
              </div>
            )}
            {customerDetailsLoader ? (
              <div className="wx__bg-white wx__rounded wx__my-3">
                <CustomerContactDtls viewBox="0 0 380 170" />
              </div>
            ) : (
              <div className="wx__card wx__p-4 wx__customer-contact-info wx__mt-3">
                <div className="wx__d-flex wx__justify-content-between">
                  <div className="wx__text_body wx__text_medium">
                    CUSTOMER GROUP
                  </div>
                  <WxIcon
                    icon={isEditGroup ? "close" : "edit"}
                    onClick={() => setIsEditGroup(!isEditGroup)}
                  />
                </div>
                {!!customer?.groups.length && (
                  <div className="wx__d-flex wx__align-items-center customer-group wx__mt-3">
                    <WxIcon icon="groups" />
                    <span className="text wx__ms-2">
                      {customer?.groups
                        ?.map((group) => group?.title)
                        .join(", ") || ""}
                    </span>
                  </div>
                )}
                {isEditGroup && (
                  <div className={`wx__form_group wx__m-0`}>
                    <label htmlFor="">Customer Group</label>
                    <div className="wx__float-end">
                      <span
                        className="wx__text_btn_small wx__text-primary wx__text_medium"
                        role="button"
                        onClick={() => setIsGroupDrawerOpen(true)}
                      >
                        Manage
                      </span>
                    </div>
                    <div className={`wx__input_group_secondary`}>
                      {groups.length ? (
                        <div style={{ width: "100%" }}>
                          <SelectOption
                            defaultSelected={selectedGroups}
                            options={groups}
                            getOptionValue={(option) => option}
                            getOptionLabel={(option) => option?.title}
                            isMulti
                            onChange={(values: any[]) =>
                              setSelectedGroups(values)
                            }
                          />
                          <div className="wx__d-flex wx__justify-content-end wx__mt-3">
                            <WxButton
                              variant="outline"
                              color="primary"
                              onClick={() => onUpdateGroup()}
                            >
                              Update
                            </WxButton>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            )}
            {customerAddressLoader ? (
              <div className="wx__bg-white wx__my-3 wx__rounded">
                <CustomerAdresSkelton viewBox="0 0 380 590" />
              </div>
            ) : (
              <div className="wx__card wx__p-4 wx__customer-contact-info wx__mt-3">
                <div className="wx__d-flex wx__justify-content-between">
                  <div className="wx__text_body wx__text_medium">
                    CUSTOMER ADDRESS
                  </div>
                  <WxIcon onClick={() => onAddressManage()} icon="edit" />
                </div>
                <div>
                  {customerAddresses.map((address) => (
                    <div className="wx__mb-4" key={address.id}>
                      <div className="wx__d-flex customer-location wx__mt-3">
                        <WxIcon icon="location_on" />
                        <span className="text wx__ms-2">
                          {address?.title || ""}
                        </span>
                      </div>
                      <div className="address-text">
                        {address?.addressLine1 || ""},{" "}
                        {address?.addressLine2 || ""}, {address?.cityName || ""}
                        , {address?.state || ""} {address?.postCode || ""},{" "}
                        {address?.country || ""}.
                      </div>
                    </div>
                  ))}
                  <WxButton
                    variant="none"
                    color="primary"
                    type="button"
                    onClick={() => onAddNewAddress()}
                  >
                    Add New Address
                  </WxButton>
                </div>
              </div>
            )}
            <div className="show-mobile-view wx__w-100 wx__mt-4">
              <WxButton
                variant="outline"
                color="danger"
                w={100}
                onClick={onDeleteCustomer}
              >
                Delete Customer
              </WxButton>
            </div>
          </div>
        </div>
      ) : null}

      {isEditCustomerInfo && (
        <CustomerEditModal
          show={isEditCustomerInfo}
          onHide={setIsEditCustomerInfo}
          handleCloseForm={() => setIsEditCustomerInfo(false)}
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmitCustomerInfo}
          isSubmitting={isLoading}
        />
      )}
      {isDrawerOpen && (
        <AddressManage
          drawerOpen={isDrawerOpen}
          handleFormClose={setIsDrawerOpen}
          addresses={customerAddresses}
          getCustomerAddress={getCustomerAddress}
          customerId={customer?.customer?.id}
          isNewAddress={isEditor}
          setIsNewAddress={setIsEditor}
        />
      )}
      {isOpenModal && (
        <ConfirmationModal
          isOpen={isOpenModal}
          setIsOpen={setIsOpenModal}
          onConfirm={onConfirmDelete}
          title="Customer Delete!"
          body="Are you sure you want to delete this customer?"
        />
      )}
      {isGroupDrawerOpen && (
        <CustomerGroup
          drawerOpen={isGroupDrawerOpen}
          handleClose={onCloseMangeDrawer}
        />
      )}
      {customerNotFound && (
        <WxNotFound
          title="No Customer found"
          btn_text="Create Customer"
          btn_link={CUSTOMER_CREATE}
        />
      )}
    </WxMainLg>
  );
};

export default CustomerDetails;
