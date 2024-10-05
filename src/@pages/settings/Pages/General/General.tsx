import WxMainLg from "@components/MainContentLayout/MainLg";
import WxSelect from "@components/Select/WxSelect";
import {Button} from "@components/Button";
import { WxFormHeader } from "@components/WxFormLayout";
import WxHr from "@components/WxHr";
import WxIcon from "@components/Icon";
import TextInput from "@components/TextInput";
import AddressNcontactSkelton from "@components/WxSkelton/Setting/General/AddressNcontactSkelton";
import BasicInfoSkelton from "@components/WxSkelton/Setting/General/BasicInfoSkelton";
import { SETTINGS } from "routes/path-name.route";
import { LocationService } from "services/api/Location.service";
import { GeneralSettingService } from "services/api/settings/General.service";
import { LocalStorageService } from "services/utils/local-storage.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
// import { useAppDispatch, useAppSelector } from "store/hooks";
import { setUserInfo } from "store/reducers/userReducer";
import skeltonLoader from "utils/skeltonLoader";
import "./General.scss";

const General = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const {
    register: addressRegister,
    handleSubmit: addressHandleSubmit,
    setValue: addressSetValue,
    watch: addressWatch,
    reset: addressReset,
    formState: { errors: addressErrors },
  } = useForm();

  const [basicInfoFlag, setBasicInfoFlag] = useState<boolean>(false);
  const [basicInfo, setBasicInfo] = useState<any>();
  const [storeTypes, setSToreTypes] = useState<any[]>([]);
  const [addressFlag, setAddressFlag] = useState<boolean>(false);
  const [storeAddress, setStoreAddress] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [divisions, setDivision] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const dispatch = useDispatch();
  const { user_data } = useSelector((data: any) => data?.user);

  // loader states

  const [basicInfoLoader, setBasicInfoLoader] = useState<boolean>(true);
  const [addressNContactLoader, setAddressNContactLoader] =
    useState<boolean>(true);

  useEffect(() => {
    getInfo();
    getStoreAddresses();
    GeneralSettingService.getStoreType({}).then((res) => {
      setSToreTypes(res?.body);
    });
  }, []);

  useEffect(() => {
    getDivisions();
  }, []);

  useEffect(() => {
    addressWatch("state") && divisions && getDistricts(divisions);
  }, [addressWatch("state"), divisions]);

  const getStoreAddresses = () => {
    GeneralSettingService.getStoreAddress()
      .then((res) => {
        addressReset({ ...res?.body[0], city: res.body[0]?.city });
        setStoreAddress(res?.body[0] || {});
      })
      .finally(() => {
        skeltonLoader(setAddressNContactLoader);
      });
  };

  const getInfo = () => {
    GeneralSettingService.getStoreInfo()
      .then((res) => {
        setBasicInfo(res.body);
        setValue("name", res.body.name);
        setValue("legalName", res.body.legalName);
        setValue("businessName", res.body.businessName);
        setValue("storeTypes.id", res.body?.storeTypes?.id);
      })
      .finally(() => {
        setIsLoading(false);
        skeltonLoader(setBasicInfoLoader);
      });
  };

  const onSubmitBasicInfo = (requestData: any) => {
    setIsLoading(true);
    GeneralSettingService.update(requestData)
      .then((res) => {
        ToastService.success(res.message);
        getInfo();
        setBasicInfoFlag(false);
        const resData = {
          ...user_data,
          store_name: res?.body?.businessName,
        };

        LocalStorageService.set("user_data", resData);

        dispatch(
          setUserInfo({
            user_data: resData,
          })
        );
      })
      .catch((err) => {
        ToastService.error(err.message);
      })
      .finally(() => setIsLoading(false));
  };

  const getDivisions = () => {
    LocationService.getDivision("19").then((res) => {
      setDivision(res?.body);
    });
  };

  const onChangeDivision = (divisionInfo: any) => {
    addressSetValue("state", divisionInfo);
    addressSetValue("city", null);
    setDistricts([]);
  };

  const getDistricts = (states: any) => {
    const findDivision = states.find(
      (item) => item?.division_name_eng === addressWatch("state")
    );

    LocationService.getDistrict(
      "19",
      findDivision?.division_id ? findDivision?.division_id : "30"
    ).then((res) => {
      setDistricts(res?.body);
      addressSetValue("city", storeAddress?.city);
    });
  };

  const onSubmitAddress = (requestData: any) => {
    setIsLoading(true);

    requestData.id = storeAddress?.id;
    delete requestData.storeTypes;
    GeneralSettingService.storeAddressUpdate(requestData)
      .then((res) => {
        getStoreAddresses();
        ToastService.success(res.message);
        setAddressFlag(false);
      })
      .catch((err) => {
        ToastService.error(err.message);
      })
      .finally(() => setIsLoading(false));
  };

  const onSubmitContactInfo = (requestData: any) => {
    ToastService.success("Form submited successfully");
    const timer = setTimeout(() => {
      setAddressFlag(false);
    }, 1000);
  };

  return (
    <WxMainLg className="setting_general_sec">
      <WxFormHeader title="General" backNavigationLink={SETTINGS} />

      {isLoading ? <Preloader /> : null}

      <form onSubmit={handleSubmit(onSubmitBasicInfo)}>
        {!basicInfoLoader ? (
          <div className="card p-3 mt-3">
            <div className="row">
              <div className="col-md-12 col-sm-12 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Basic Information</h5>
                {basicInfoFlag ? (
                  <div className="d-flex">
                    <Button
                      variant="none"
                      className="cancel__btn"
                      onClick={() => setBasicInfoFlag(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="none">
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="none"
                    onClick={() => setBasicInfoFlag(true)}
                  >
                    Edit
                  </Button>
                )}
              </div>
              <WxHr />
            </div>
            {basicInfoFlag ? (
              <div className="row">
                <div className="col-md-6 col-sm-12 mt-2">
                  <TextInput
                    label="Store name"
                    noMargin
                    registerProperty={{
                      ...register("businessName", { required: true }),
                    }}
                    color={errors.businessName ? "danger" : "primary"}
                    errorMessage={
                      errors.businessName && "Store name is Required"
                    }
                  />
                </div>
                <div className="col-md-6 col-sm-12 mt-2">
                  <TextInput
                    label="Legal Name Of Company"
                    noMargin
                    registerProperty={{ ...register("legalName") }}
                  />
                </div>
                <div className="col-md-6 col-sm-12 mt-2">
                  <WxSelect
                    label="Store Industry"
                    noMargin
                    options={storeTypes}
                    placeholder="Select Store Industry"
                    valuesKey="id"
                    textKey="name"
                    registerProperty={{
                      ...register("storeTypes.id", { required: true }),
                    }}
                    onChange={(e) => {}}
                    color={errors?.storeTypes ? "danger" : "secondary"}
                    errorMessage={
                      errors?.storeTypes && "Store Types is required!"
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="row">
                <p className="text_body text_strong">
                  {basicInfo?.businessName}
                </p>
                <p className="text_small text_regular">
                  {basicInfo?.legalName} | {basicInfo?.storeTypes?.name || ""}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded">
            <BasicInfoSkelton viewBox="0 0 595 100" />
          </div>
        )}
      </form>

      <form onSubmit={addressHandleSubmit(onSubmitAddress)}>
        {!addressNContactLoader ? (
          <div className="card p-3 mt-3 address_form">
            <div className="row">
              <div className="col-md-12 col-sm-12 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Address & Contact</h5>
                {addressFlag ? (
                  <div className="d-flex">
                    <Button
                      variant="none"
                      className="cancel__btn"
                      onClick={() => setAddressFlag(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="none" disabled={isLoading}>
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <Button variant="none" onClick={() => setAddressFlag(true)}>
                    Edit
                  </Button>
                )}
              </div>
              <p className="text_body wx__body_regular mb-1">
                Used on customer order confirmations and your WebX bill.
              </p>
              <WxHr />
            </div>
            {addressFlag ? (
              <div className="row">
                <div className="col-md-12 col-sm-12 mt-2">
                  <TextInput
                    registerProperty={{
                      ...addressRegister("country", { required: false }),
                    }}
                    label="Country"
                    defaultValue="Bangladesh"
                    className=""
                    isDisabled
                  />
                </div>
                <div className="col-md-12 col-sm-12 mt-2">
                  <TextInput
                    isRequired
                    label="Address"
                    noMargin
                    registerProperty={{
                      ...addressRegister("addressLine1", { required: true }),
                    }}
                    color={addressErrors.addressLine1 ? "danger" : "primary"}
                    errorMessage={
                      addressErrors.addressLine1 && "Address is Required"
                    }
                  />
                </div>
                <div className="col-md-12 col-sm-12 mt-2">
                  <TextInput
                    label="Appartment,  suits, etc"
                    noMargin
                    registerProperty={{ ...addressRegister("addressLine2") }}
                  />
                </div>
                <div className="col-md-4 col-sm-12 mt-2">
                  <WxSelect
                    label="Division/State"
                    noMargin
                    options={divisions}
                    placeholder="Select Division"
                    valuesKey="division_name_eng"
                    textKey="division_name_eng"
                    registerProperty={{
                      ...addressRegister("state", {
                        required: true,
                        onChange: (e) => onChangeDivision(e.target.value),
                      }),
                    }}
                    color={
                      addressErrors?.address?.state ? "danger" : "secondary"
                    }
                    errorMessage={
                      addressErrors?.address?.state &&
                      "Division/State is required!"
                    }
                  />
                </div>
                <div className="col-md-4 col-sm-12 mt-2">
                  {/* {getValues("city")} */}
                  <WxSelect
                    label="District/City"
                    options={districts}
                    placeholder="Select District/City"
                    valuesKey="zilla_name_eng"
                    textKey="zilla_name_eng"
                    defaultValue={addressWatch("city")}
                    registerProperty={{
                      ...addressRegister("city", { required: true }),
                    }}
                    isDisabled={!districts?.length}
                    color={
                      addressErrors?.address?.city ? "danger" : "secondary"
                    }
                    errorMessage={
                      addressErrors?.address?.city &&
                      "District/City is required!"
                    }
                  />
                </div>
                <div className="col-md-4 col-sm-12 mt-2">
                  <TextInput
                    registerProperty={{
                      ...addressRegister("zip", { required: true }),
                    }}
                    label="Post code"
                    color={addressErrors?.address?.zip ? "danger" : "secondary"}
                    errorMessage={
                      addressErrors?.address?.zip && "Post Code is required!"
                    }
                  />
                </div>
                <div className="col-md-6 col-sm-12 mt-2">
                  <TextInput
                    label="Email Address"
                    type="email"
                    registerProperty={{ ...addressRegister("email") }}
                  />
                </div>
                <div className="col-md-6 col-sm-12 mt-2">
                  <TextInput
                    label="Phone Number."
                    registerProperty={{ ...addressRegister("phone") }}
                  />
                </div>
              </div>
            ) : (
              <>
                {storeAddress && Object.keys(storeAddress).length !== 0 ? (
                  <>
                    <div className="d-flex justify-content-between">
                      <div>
                        <div className="row">
                          <div className="text_body text_strong d-flex align-items-center">
                            <WxIcon icon="location_on" />
                            <span>
                              {storeAddress?.addressLine1
                                ? storeAddress?.addressLine1 + ", "
                                : ""}
                              {storeAddress?.addressLine2
                                ? storeAddress?.addressLine2 + ", "
                                : ""}
                              {storeAddress?.city ? storeAddress?.city : ""}
                              {storeAddress?.zip
                                ? "-" + storeAddress?.zip + ", "
                                : ", "}
                              {storeAddress?.state
                                ? storeAddress?.state + ", "
                                : ""}
                              {storeAddress?.country
                                ? storeAddress?.country
                                : ""}
                            </span>
                          </div>
                        </div>
                        {/* <div className="row"> */}
                        <div className="d-flex">
                          {storeAddress?.email && (
                            <div className="text_body text_strong d-flex align-items-center  my-2">
                              <WxIcon icon="email" />
                              <div className="d-flex flex-column">
                                <span> {storeAddress?.email || ""}</span>
                              </div>
                            </div>
                          )}
                          {storeAddress?.phone && (
                            <div className=" text_body text_strong d-flex align-items-center ms-3">
                              <WxIcon icon="phone" />
                              <span> {storeAddress?.phone || ""}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <WxIcon
                        onClick={() => setAddressFlag(true)}
                        icon="edit"
                      />
                    </div>
                  </>
                ) : (
                  <span>No address available</span>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="bg-white rounded mt-3">
            <AddressNcontactSkelton viewBox="0 0 595 110" />
          </div>
        )}
      </form>

      {/* <form onSubmit={handleSubmit(onSubmitContactInfo)}>
        <div className="card p-3 mt-3 contact_form">
          <div className="row">
            <div className="col-md-12 col-sm-12 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Contact Information</h5>
            </div>
            <WxHr />
          </div>

          <div className="row">
            <div className="text_body text_strong d-flex align-items-center mb-3">
              <WxIcon icon="phone" />
              <span> {storeAddress?.phone || ""}</span>
            </div>
            <div className="text_body text_strong d-flex align-items-center mb-3">
              <WxIcon icon="email" />
              <div className="d-flex flex-column">
                <span> {storeAddress?.email || ""}</span>
                <span className="text_small text_regular">
                  Webx will communicated via this email
                </span>
              </div>
            </div>
          </div>
        </div>
      </form> */}

      <div className="card p-3 mt-3 currency_sec">
        <div className="row">
          <div className="col-md-12 col-sm-12 d-flex justify-content-between align-items-center text__small">
            <h5 className="mb-0">Store currency</h5>
            <div className="d-flex align-items-center">
              <WxIcon icon="info" variants="outlined" />
              <p className="ms-1 mb-0">
                More currencies are coming soon
              </p>
            </div>
          </div>
          <WxHr />
        </div>
        <div className="row">
          <p className="text_body text_strong">
            Bangladeshi takas (BDT)
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmitAddress)}>
        <div className="card p-3 mt-3 address_form">
          <div className="row">
            <div className="col-md-12 col-sm-12 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Time Zone</h5>
              <div className="d-flex align-items-center text-secondary">
                <WxIcon
                  icon="info"
                  variants="outlined"
                  className="mt-auto"
                />
                <p className="ms-1 mb-0">
                  More timezone are coming soon
                </p>
              </div>
            </div>
            <WxHr />
          </div>

          <div className="row">
            <p className="text_body text_strong d-flex align-items-center">
              (GMT +6:00) Astana, Dhaka
            </p>
          </div>
        </div>
      </form>
    </WxMainLg>
  );
};

export default General;
