import WxMainLg from "@components/MainContentLayout/WxMainLg";
import SelectOption from "@components/Select/Select";
import WxButton from "@components/WxButton";
import WxFormContainer from "@components/WxFormLayout/WxFormContainer";
import WxFormFooter from "@components/WxFormLayout/WxFormFooter";
import WxFormHeader from "@components/WxFormLayout/WxFormHeader";
import WxHr from "@components/WxHr";
import WxSwitch from "@components/WxSwitch";
import { STATUS_CONSTANT } from "config/constants";
import { CUSTOMERS } from "routes/path-name.route";
import { CustomerService } from "services/api/Customer.service";
import { GroupService, IGroup } from "services/api/Group.service";
import { LocationService } from "services/api/Location.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CustomerFrom } from "./components/CustomerFrom";
import CustomerGroup from "./components/CustomerGroup";

export default function AddCustomer() {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();
	const [selectedGroups, setSelectedGroups] = useState<any[]>([]);

	const [countries, setCountries] = useState<any[]>([]);
	const [divisions, setDivision] = useState<any[]>([]);
	const [selectedDivisionId, setSelectedDivisionId] = useState<string>("");

	const [districts, setDistricts] = useState<any[]>([]);

	const [drawerOpen, setDrawerOpen] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [groups, setGroups] = useState<any[]>([]);

	const customerGroupDrawer = () => setDrawerOpen(true);

	useEffect(() => {
		if (!drawerOpen) getGroup();
	}, [drawerOpen]);

	useEffect(() => {
		// getCountry();
		getDivisions();
	}, []);

	useEffect(() => {
		if (selectedDivisionId) {
			setDistricts([]);
			setValue("address.cityName", "");
			getDistricts();
		}
	}, [selectedDivisionId]);

	const onSubmitting = (requestData) => {
		requestData.address.state = requestData.address.state
			? JSON.parse(requestData.address.state).division_name_eng
			: "";

		setIsLoading(true);
		selectedGroups.forEach((item) => {
			delete item.value,
				delete item.title,
				delete item.label,
				delete item.storeId;
		});

		requestData.customer.password = "123";
		requestData.customer.status = requestData.customer.status
			? STATUS_CONSTANT.active
			: STATUS_CONSTANT.inactive;
		requestData.groups = selectedGroups;
		CustomerService.create(requestData)
			.then((resp) => {
				ToastService.success(resp.message);
				navigate(CUSTOMERS);
			})
			.catch((err) => {
				ToastService.error(err.message);
			})
			.finally(() => setIsLoading(false));
	};

	const getGroup = () => {
		setIsLoading(true);
		GroupService.get({})
			.then((response) => setGroups(response.body))
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsLoading(false));
	};

	const getCountry = () => {
		LocationService.getCountry().then((res) => {
			setCountries(res.body);
		});
	};

	const getDivisions = () => {
		LocationService.getDivision("19").then((res) => {
			setDivision(res.body);
		});
	};

	const onChangeDivision = (divisionInfo: any) => {
		if (!divisionInfo) return;
		divisionInfo = JSON?.parse(divisionInfo);
		if (!divisionInfo.division_id)
			ToastService.error("Please select valid Division or state");
		// setValue("address.state", divisionInfo.division_name_eng);
		setSelectedDivisionId(divisionInfo.division_id);
	};

	const getDistricts = () => {
		LocationService.getDistrict("19", selectedDivisionId).then((res) => {
			setDistricts(res.body);
		});
	};

	const handleClose = () => setDrawerOpen(false);

	return (
		<WxMainLg>
			<WxFormContainer>
				<WxFormHeader
					noMargin
					title="Add Customer"
					backNavigationLink={CUSTOMERS}
				/>
				{isLoading ? <Preloader absolutePosition /> : null}
				<form onSubmit={handleSubmit(onSubmitting)}>
					<div className="row">
						<div className="col-lg-8 col-md-7 col-sm-12 wx__mt-3">
							<CustomerFrom
								customerGroupDrawer={customerGroupDrawer}
								setSelectedGroups={setSelectedGroups}
								groups={groups}
								register={register}
								errors={errors}
								setValue={setValue}
								divisions={divisions}
								onChangeDivision={onChangeDivision}
								districts={districts}
							/>
						</div>
						<div className="col-lg-4 col-md-5 col-sm-12 hide-mobile-view wx__mt-3">
							<div className="card wx__form_right">
								<WxButton type="submit" variant="fill" disabled={isLoading}>
									Save Customer
								</WxButton>
								<WxHr />
								<div style={{ maxWidth: "80%" }}>
									<div>
										<WxSwitch
											label={
												<div className="d-flex wx__align-items-center">
													&nbsp; &nbsp;<span>Status</span>
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
								<WxHr />

								{/* <WxInput
                label="Customer Group"
                labelRight={
                  <span
                    className="wx__text_btn_small wx__text-primary wx__text_medium"
                    role="button"
                    onClick={() => customerGroupDrawer()}
                  >
                    Manage
                  </span>
                }
                startIcon={
                  <span className="material-symbols-outlined">search</span>
                }
                placeholder="Search group"
              /> */}
								<div className={`form_group wx__m-0`}>
									<label htmlFor="">Customer Group</label>
									<div className="wx__float-end">
										<span
											className="wx__text_btn_small wx__text-primary wx__text_medium"
											role="button"
											onClick={() => customerGroupDrawer()}
										>
											Manage
										</span>
									</div>
									<div className={`wx__input_group_secondary`}>
										{groups.length ? (
											<div style={{ width: "100%" }}>
												<SelectOption
													options={groups}
													isMulti
													onChange={(values: any[]) =>
														setSelectedGroups(values)
													}
													getOptionLabel={(op: IGroup) => op?.title}
													getOptionValue={(op: IGroup[]) => op}
												/>
											</div>
										) : null}
									</div>
								</div>
							</div>
						</div>
					</div>
					<WxFormFooter
						title="Unsaved Changes"
						// onCancel={onCancel}
						saveButtonText="Save Customer"
						isSaving={isLoading}
					/>
				</form>
				<CustomerGroup drawerOpen={drawerOpen} handleClose={handleClose} />
			</WxFormContainer>
		</WxMainLg>
	);
}
