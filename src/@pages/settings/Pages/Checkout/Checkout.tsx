import WxMainMd from "@components/MainContentLayout/WxMainMd";
import WxButton from "@components/Button";
import WxCheckbox from "@components/WxCheckbox";
import { WxFormHeader } from "@components/WxFormLayout";
import WxHr from "@components/WxHr";
import WxRadio from "@components/WxRadio/WxRadio";
import WxSwitch from "@components/WxSwitch";
import { SETTINGS, SETTINGS_CHECKOUT } from "routes/path-name.route";
import { CheckoutSettingService } from "services/api/settings/Checkout.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./Checkout.scss";

const Checkout = () => {
  // site operator data
  const { register, handleSubmit, setValue, getValues, watch } = useForm();
  const [isLoadding, setIsLoadding] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [fullName, fullAddress, addressLine2, city, state, postCode, country] =
    watch([
      "fullName",
      "fullAddress",
      "addressLine2",
      "city",
      "state",
      "postCode",
      "country",
    ]);

  const navigate = useNavigate();

  const onSubmitFun = (requestData: any) => {
    setIsSubmitting(true);
    requestData.customerAccount = +requestData.customerAccount;
    requestData.fullName = +requestData.fullName ? 2 : 0;

    if (requestData.fullName === 0) {
      requestData.firstName = requestData.firstName ? 2 : 1;
      requestData.lastName = requestData.lastName ? 2 : 1;
    } else {
      requestData.firstName = 0;
      requestData.lastName = 0;
    }
    requestData.fullAddress = +requestData.fullAddress ? 2 : 0;
    if (requestData.fullAddress === 0) {
      requestData.addressLine1 = 2;
      requestData.addressLine2 = requestData.addressLine2
        ? requestData.addressLine2Mandatory
          ? 2
          : 1
        : 0;
      requestData.city = requestData.city
        ? requestData.cityMandatory
          ? 2
          : 1
        : 0;

      requestData.postCode = requestData.postCode
        ? requestData.postCodeMandatory
          ? 2
          : 1
        : 0;
      requestData.state = requestData.state
        ? requestData.stateMandatory
          ? 2
          : 1
        : 0;

      requestData.country = requestData.country
        ? requestData.countryMandatory
          ? 2
          : 1
        : 0;
    } else {
      requestData.fullAddress = 2;
      requestData.addressLine1 = 0;
      requestData.addressLine2 = 0;
      requestData.city = 0;
      requestData.state = 0;
      requestData.country = 0;
      requestData.postCode = 0;
    }
    delete requestData.addressLine2Mandatory;
    delete requestData.addressLine1Mandatory;
    delete requestData.cityMandatory;
    delete requestData.stateMandatory;
    delete requestData.postCodeMandatory;
    delete requestData.countryMandatory;
    delete requestData.fullAddressMandatory;
    CheckoutSettingService.update(requestData)
      .then((res) => {
        ToastService.success(res.message);
        setIsLoadding(true);
        window.scrollTo(0, 0);
      })
      .catch((err) => {
        ToastService.error(err.message);
      })
      .finally(() => setIsSubmitting(false));
  };

  useEffect(() => {
    if (isLoadding) getCheckoutInfo();
  }, [isLoadding]);

  const getCheckoutInfo = () => {
    CheckoutSettingService.getInfo()
      .then((res) => {
        const data = res.body;
        setValue("id", data.id);
        setValue("customerAccount", data.customerAccount.toString());
        setValue("fullName", data.fullName.toString());
        setValue("phone", data.phone);
        setValue("fullAddress", data.fullAddress.toString());
        setValue("firstName", !!data.firstName);
        setValue("lastName", data.lastName === 2);
        setValue("addressLine1", !!data.addressLine1);
        setValue(
          "addressLine1Mandatory",
          data?.addressLine1 === 2 ? true : false
        );
        setValue("addressLine2", !!data.addressLine2);
        setValue(
          "addressLine2Mandatory",
          data.addressLine2 === 2 ? true : false
        );
        setValue("addressLine2", !!data.addressLine2);
        setValue(
          "addressLine2Mandatory",
          data.addressLine2 === 2 ? true : false
        );
        setValue("city", !!data.city);
        setValue("cityMandatory", data.city === 2 ? true : false);
        setValue("postCode", !!data.postCode);
        setValue("postCodeMandatory", data.postCode === 2 ? true : false);
        setValue("state", !!data.state);
        setValue("stateMandatory", data.state === 2 ? true : false);
        setValue("country", !!data.country);
        setValue("countryMandatory", data.country === 2 ? true : false);
      })
      .catch((err) => {})
      .finally(() => setIsLoadding(false));
  };

  return (
		<WxMainMd className="checkout_sec">
			{(isLoadding || isSubmitting) && <Preloader />}
			<form onSubmit={handleSubmit(onSubmitFun)}>
				<div className="d-flex justify-content-between align-items-center mb-3">
					<WxFormHeader title="Checkout" backNavigationLink={SETTINGS} />
					{/* TODO::currently not working */}
					{/* <WxButton
            variant="none"
            // onClick={() => navigate(SETTINGS_ROLES_CREATE)}
          >
            View Checkout Page
          </WxButton> */}
				</div>

				<div className="card p-3 mt-3">
					<h5>Customer Account</h5>
					{/*          
          <div className="radio_btn_option">
            <label
              className="text_body d-flex text_medium mb-0 w-100 h-100"
              htmlFor="typeRadio1"
            >
              <WxRadio
                id="typeRadio1"
                name="typeRadioButton"
                returnValue="label"
                label="Only Guest checkout"
                value="0"
                singleUse={true}
                registerProperty={{ ...register("customerAccount") }}
              />
            </label>
          </div> */}
					<div className="radio_btn_option">
						<label
							className="text_body d-flex text_medium mb-0 w-100 h-100"
							htmlFor="typeRadio2"
						>
							<WxRadio
								id="typeRadio2"
								name="typeRadioButton"
								returnValue="label"
								label="Guest Checkout Allow"
								value="1"
								singleUse={true}
								registerProperty={{ ...register("customerAccount") }}
							/>
						</label>
					</div>
					<div className="radio_btn_option">
						<label
							className="text_body d-flex text_medium mb-0 w-100 h-100"
							htmlFor="typeRadio3"
						>
							<WxRadio
								id="typeRadio3"
								name="typeRadioButton"
								isRequired
								returnValue="label"
								label="Account creation is mandatory"
								value="2"
								singleUse={true}
								registerProperty={{ ...register("customerAccount") }}
							/>
						</label>
					</div>
				</div>
				<div className="card p-3 mt-3">
					<h5>Contact Info</h5>
					<p className="text_body text_regular">
						This will be your business location and not visible to your website
						visitors.
					</p>
					<div className="radio_btn_option_disable">
						<p className="text_body text_medium mb-0">
							Phone Number <span className="color_red">*</span>
						</p>
						<p className="text_small text_regular mb-0">
							This cant be unselected.
						</p>
					</div>
				</div>
				<div className="shipping_card card p-3 mt-3">
					<h5>Shipping Address</h5>
					<p className="text_body text_regular">
						This will be your business location and not visible to your website
						visitors.
					</p>
					<p className="text_caption mt-3 mb-2">
						Name Configuration
					</p>
					<div className="radio_btn_option">
						<label
							htmlFor="nameRadioBtn1"
							className="d-flex w-100 h-100"
						>
							<WxRadio
								id="nameRadioBtn1"
								name="nameRadioBtn"
								returnValue="label"
								value="2"
								// isChecked={!getValues("fullName")}
								singleUse={true}
								registerProperty={{ ...register("fullName") }}
							/>
							<div className="d-flex justify-content-center flex-column">
								<p className="text_small text_regular mb-0">
									Pattern 1
								</p>
								<p className="text_body text_medium mb-0">
									Full Name
								</p>
							</div>
						</label>
					</div>

					<div className="radio_btn_option">
						<label
							htmlFor="nameRadioBtn2"
							className="d-flex w-100 h-100"
						>
							<WxRadio
								id="nameRadioBtn2"
								name="nameRadioBtn"
								returnValue="label"
								value="0"
								singleUse={true}
								registerProperty={{ ...register("fullName") }}
							/>
							<div className="d-flex justify-content-center flex-column">
								<p className="text_small text_regular mb-0">
									Pattern 2
								</p>
								<p className="text_body text_medium mb-0">
									First Name, Last Name
								</p>
							</div>
						</label>
					</div>
					{fullName === "0" ? (
						<div className="w-100">
							<div className=" radio_btn_sub_option ms-5">
								<p className="text_body text_medium mb-0">
									First Name<span className="color_red">*</span>
								</p>
								<WxSwitch
									checkedTitle="Mandatory"
									unCheckedTitle="Optional"
									defaultChecked
									registerProperty={{ ...register("firstName") }}
								/>
							</div>
							<div className=" radio_btn_sub_option ms-5">
								<p className="text_body text_medium mb-0">
									Last Name
								</p>
								<WxSwitch
									checkedTitle="Mandatory"
									unCheckedTitle="Optional"
									registerProperty={{ ...register("lastName") }}
								/>
							</div>
						</div>
					) : null}

					<p className="text_caption mt-3 mb-2">
						Address Configuration
					</p>
					<div className="radio_btn_option">
						<label
							htmlFor="addressRadioBtn1"
							className="d-flex w-100 h-100"
						>
							<WxRadio
								id="addressRadioBtn1"
								name="addressRadioBtn"
								returnValue="label"
								value="2"
								singleUse={true}
								// isChecked={!getValues("fullAddress")}
								registerProperty={{ ...register("fullAddress") }}
							/>
							<div className="d-flex justify-content-center flex-column">
								<p className="text_small text_regular mb-0">
									Pattern 1
								</p>
								<p className="text_body text_medium mb-0">
									Full Address
								</p>
							</div>
						</label>
					</div>
					{fullAddress === "2" ? (
						<div className="w-100">
							<div className="radio_btn_field d-flex align-items-center justify-content-between ms-5">
								<div className="d-flex align-items-center">
									<WxCheckbox checked disabled />
									<div className="d-flex flex-column">
										<p className="text_body text_medium mb-0">
											Full Address <span className="color_red">*</span>
										</p>
										<p className="text_small text_regular mb-0">
											This cant be unselected.
										</p>
									</div>
								</div>
								<WxSwitch
									isChecked
									checkedTitle="Mandatory"
									registerProperty={{ ...register("fullAddressMandatory") }}
									disabled
								/>
							</div>
						</div>
					) : null}

					<div className="radio_btn_option">
						<label
							htmlFor="addressRadioBtn2"
							className="d-flex w-100 h-100"
						>
							<WxRadio
								id="addressRadioBtn2"
								name="addressRadioBtn"
								returnValue="label"
								value="0"
								singleUse={true}
								registerProperty={{ ...register("fullAddress") }}
							/>
							<div className="d-flex justify-content-center flex-column">
								<p className="text_small text_regular mb-0">
									Pattern 2
								</p>
								<p className="text_body text_medium mb-0">
									Details Address
								</p>
							</div>
						</label>
					</div>
					{fullAddress === "0" ? (
						<div className="w-100">
							<div className="radio_btn_field d-flex align-items-center justify-content-between ms-5">
								<div className="d-flex align-items-center">
									<WxCheckbox
										checked
										disabled
										registerProperty={{ ...register("addressLine1") }}
									/>
									<div className="d-flex flex-column">
										<p className="text_body text_medium mb-0">
											Address Line 01 <span className="color_red">*</span>
										</p>
										<p className="text_small text_regular mb-0">
											This cant be unselected.
										</p>
									</div>
								</div>
								<WxSwitch
									isChecked
									checkedTitle="Mandatory"
									registerProperty={{ ...register("addressLine1Mandatory") }}
									disabled
								/>
							</div>
							<div className="radio_btn_sub radio_btn_sub_option justify-content-between ms-5">
								<label
									htmlFor="addressLine2"
									className="w-100 h-100 d-flex"
								>
									<WxCheckbox
										id="addressLine2"
										label="Address Line 2"
										registerProperty={{ ...register("addressLine2") }}
									/>
								</label>
								{addressLine2 ? (
									<WxSwitch
										checkedTitle="Mandatory"
										unCheckedTitle="Optional"
										registerProperty={{
											...register("addressLine2Mandatory"),
										}}
									/>
								) : null}
							</div>

							<div className="radio_btn_sub radio_btn_sub_option justify-content-between ms-5">
								<label
									htmlFor="city"
									className="w-100 h-100 d-flex"
								>
									<WxCheckbox
										id="city"
										label="city"
										registerProperty={{ ...register("city") }}
									/>
								</label>
								{city ? (
									<WxSwitch
										checkedTitle="Mandatory"
										unCheckedTitle="Optional"
										registerProperty={{
											...register("cityMandatory"),
										}}
									/>
								) : null}
							</div>

							<div className="radio_btn_sub radio_btn_sub_option justify-content-between ms-5">
								<label
									htmlFor="postCode"
									className="w-100 h-100 d-flex"
								>
									<WxCheckbox
										id="postCode"
										label="postCode"
										registerProperty={{ ...register("postCode") }}
										// checked={postCode}
									/>
								</label>
								{postCode ? (
									<WxSwitch
										checkedTitle="Mandatory"
										unCheckedTitle="Optional"
										registerProperty={{
											...register("postCodeMandatory"),
										}}
									/>
								) : null}
							</div>

							<div className="radio_btn_sub radio_btn_sub_option justify-content-between ms-5">
								<label
									htmlFor="state"
									className="w-100 h-100 d-flex"
								>
									<WxCheckbox
										id="state"
										label="Division"
										registerProperty={{ ...register("state") }}
									/>
								</label>
								{state ? (
									<WxSwitch
										checkedTitle="Mandatory"
										unCheckedTitle="Optional"
										registerProperty={{
											...register("stateMandatory"),
										}}
									/>
								) : null}
							</div>

							<div className="radio_btn_sub radio_btn_sub_option justify-content-between ms-5">
								<label
									htmlFor="country"
									className="w-100 h-100 d-flex"
								>
									<WxCheckbox
										id="country"
										label="Country"
										registerProperty={{ ...register("country") }}
									/>
								</label>
								{country ? (
									<WxSwitch
										checkedTitle="Mandatory"
										unCheckedTitle="Optional"
										defaultChecked={false}
										registerProperty={{
											...register("countryMandatory"),
										}}
									/>
								) : null}
							</div>
						</div>
					) : null}
				</div>

				<div className="submit_button submit_btn_enable">
					<WxHr />
					<div className="d-flex justify-content-between align-items-center">
						<p className="mb-0">No changes yet</p>
						<div className="d-flex">
							<WxButton
								variant="outline"
								color="secondary"
								className="me-3"
								onClick={() => navigate(SETTINGS_CHECKOUT)}
							>
								Cancel
							</WxButton>
							<WxButton variant="fill" type="submit" disabled={isSubmitting}>
								Save Change {isSubmitting && <Preloader />}
							</WxButton>
						</div>
					</div>
				</div>
			</form>
		</WxMainMd>
	);
};

export default Checkout;
