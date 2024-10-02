import DateInput from "@components/DatePicker/DateInput";
import PhoneNumberInput from "@components/PhoneWithCountryCode";
import SelectOption from "@components/Select/Select";
import WxSelect from "@components/Select/WxSelect";
import TextInput from "@components/TextInput";
import WxSwitch from "@components/WxSwitch";
import { useEffect, useState } from "react";
interface CustomerFormProps {
  register: any;
  errors: any;
  isEdit?: boolean;
  setValue?: any;
  divisions?: any[];
  onChangeDivision: any;
  customerGroupDrawer: any;
  districts?: any[];
  setSelectedGroups?: any;
  groups?: any[];
}

export const CustomerFrom = ({
  register,
  errors,
  isEdit,
  setValue,
  divisions,
  districts,
  onChangeDivision,
  customerGroupDrawer,
  setSelectedGroups,
  groups,
}: CustomerFormProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  useEffect(() => {
    setValue("customer.phoneNumber", phoneNumber);
  }, [phoneNumber]);

  useEffect(() => {
    setValue("customer.dateOfBirth", dateOfBirth);
  }, [dateOfBirth]);

  return (
		<div>
			<div className="card p-4 mb-3">
				<div className="row">
					<div className="col-lg-6 col-md-12 col-sm-6">
						<TextInput
							label="First Name"
							className=""
							registerProperty={{
								...register("customer.firstName", { required: true }),
							}}
							color={errors?.customer?.firstName ? "danger" : "secondary"}
							errorMessage={
								errors?.customer?.firstName && "First Name is required!"
							}
							isRequired
						/>
					</div>
					<div className="col-lg-6 col-md-12 col-sm-6">
						<TextInput
							label="Last Name"
							className=""
							registerProperty={{
								...register("customer.lastName", { required: true }),
							}}
							color={errors?.customer?.lastName ? "danger" : "secondary"}
							errorMessage={
								errors?.customer?.lastName && "Last Name is required!"
							}
							isRequired
						/>
					</div>
					<div className="col-lg-6 col-md-12 col-sm-6">
						<PhoneNumberInput
							label="Phone Number"
							phoneNumber={phoneNumber}
							setPhoneNumber={setPhoneNumber}
							isRequired
						/>
					</div>
					<div className="col-lg-6 col-md-12 col-sm-6">
						<TextInput
							label="Email"
							type="email"
							registerProperty={{
								...register("customer.email", { required: false }),
							}}
						/>
					</div>
					<div className="col-lg-6 col-md-12 col-sm-6">
						<DateInput
							label={"Date of Birth"}
							date={dateOfBirth}
							setDate={setDateOfBirth}
							placeholder="DD/MM/YYYY"
						/>
					</div>

					<div className="col-lg-6 col-md-12 col-sm-6 mb-3 show-mobile-view d-md-none">
						<label htmlFor="" style={{ fontWeight: "600" }}>
							Customer Group
						</label>
						<div className="float-end">
							<span
								className="text_btn_small text-primary text_medium"
								role="button"
								onClick={customerGroupDrawer}
							>
								Manage
							</span>
						</div>
						<div className={`wx__input_group_secondary mt-2`}>
							{groups.length ? (
								<div style={{ width: "100%" }}>
									<SelectOption
										options={groups}
										isMulti
										onChange={(values: any[]) => setSelectedGroups(values)}
									/>
								</div>
							) : null}
						</div>
					</div>
					<div className="col-lg-6 col-md-12 col-sm-6 pe-5 show-mobile-view d-md-none">
						<WxSwitch
							label={
								<div className="d-flex align-items-center">
									<span>Status</span>
								</div>
							}
							checkedTitle="Active"
							unCheckedTitle="Inactive"
							defaultChecked
							registerProperty={{
								...register("customer.status"),
							}}
						/>
					</div>
				</div>
			</div>
			<div className="card p-4">
				<h5 className="mb-3">Customer Address</h5>
				<div className="row">
					<div className="col-lg-6 col-md-12 col-sm-6">
						<TextInput
							registerProperty={{
								...register("address.title", { required: false }),
							}}
							label="Title"
							className=""
						/>
					</div>
					<div className="col-lg-6 col-md-12 col-sm-6">
						<TextInput
							isRequired
							registerProperty={{
								...register("address.addressLine1", {
									required: true,
								}),
							}}
							label="Address Line 1"
							className=""
							color={errors?.address?.addressLine1 ? "danger" : "secondary"}
							errorMessage={
								errors?.address?.addressLine1 && "Address Line 1 is required!"
							}
						/>
					</div>
					<div className="col-lg-6 col-md-12 col-sm-6">
						<TextInput
							isRequired
							registerProperty={{
								...register("address.addressLine2", {
									required: false,
								}),
							}}
							label="Address Line 2"
							// className=""
							color={errors?.address?.addressLine1 ? "danger" : "secondary"}
							errorMessage={
								errors?.address?.addressLine1 && "Address Line 1 is required!"
							}
						/>
					</div>
					<div className="col-lg-6 col-md-12 col-sm-6">
						<TextInput
							registerProperty={{
								...register("address.country", { required: false }),
							}}
							label="Country"
							defaultValue="Bangladesh"
							className=""
							isDisabled
						/>
					</div>
					<div className="col-lg-6 col-md-12 col-sm-6">
						<WxSelect
							isRequired
							label="Division/State"
							options={divisions}
							placeholder="Select Division"
							valuesKey="object"
							textKey="division_name_eng"
							registerProperty={{
								...register("address.state", {
									required: true,
									onChange: (e) => onChangeDivision(e.target.value),
								}),
							}}
							color={errors?.address?.state ? "danger" : "secondary"}
							errorMessage={
								errors?.address?.state && "Division/State is required!"
							}
						/>
					</div>
					<div className="col-lg-6 col-md-12 col-sm-6">
						<WxSelect
							isRequired
							label="District/City"
							options={districts}
							placeholder="Select District/City"
							valuesKey="zilla_name_eng"
							textKey="zilla_name_eng"
							registerProperty={{
								...register("address.cityName", { required: true }),
							}}
							isDisabled={!districts?.length}
							color={errors?.address?.cityName ? "danger" : "secondary"}
							errorMessage={
								errors?.address?.cityName && "District/City is required!"
							}
						/>
					</div>
					<div className="col-lg-6 col-md-12 col-sm-6">
						<TextInput
							isRequired
							registerProperty={{
								...register("address.postCode", { required: true }),
							}}
							label="Post code"
							color={errors?.address?.postCode ? "danger" : "secondary"}
							errorMessage={
								errors?.address?.postCode && "Post Code is required!"
							}
						/>
					</div>

					<div className="col-lg-6 col-md-12 col-sm-6">
						<TextInput
							registerProperty={{
								...register("address.phone", {
									required: false,
								}),
							}}
							label="Phone Number"
							className=""
						/>
					</div>
					<div className="col-lg-6 col-md-12 col-sm-6">
						<TextInput
							registerProperty={{
								...register("address.email", {
									required: false,
								}),
							}}
							label="Email Address"
							className=""
							type="email"
						/>
					</div>
				</div>
			</div>
			<br />
		</div>
	);
};
