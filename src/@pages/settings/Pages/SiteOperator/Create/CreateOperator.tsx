import WxMainLg from "@components/MainContentLayout/WxMainLg";
import WxSelect from "@components/Select/WxSelect";
import WxButton from "@components/WxButton";
import { WxFormHeader } from "@components/WxFormLayout";
import WxHr from "@components/WxHr";
import WxIcon from "@components/WxIcon/WxIcon";
import WxInput from "@components/WxInput";
import WxSwitch from "@components/WxSwitch";
import { SETTINGS_SITE_OPERATOR } from "routes/path-name.route";
import { AdminService } from "services/api/admin/Admin.service";
import { SiteOperatorService } from "services/api/settings/SiteOperator.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./CreateOperator.scss";

const SiteOperator = () => {
	const [roleOption, setRoleOption] = useState<any[]>([]);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isValid },
	} = useForm({ mode: "onChange" });

	const navigate = useNavigate();

	useEffect(() => {
		getRoles();
	}, []);

	const onSubmitting = (requestData: any) => {
		// console.log(requestData)
		setIsSubmitting(true);
		// requestData.isActive = requestData.isActive
		// 	? true
		// 	: false;
		SiteOperatorService.create(requestData)
			.then((res) => {
				ToastService.success(res.message);
				navigate(SETTINGS_SITE_OPERATOR);
			})
			.catch((err) => {
				ToastService.error(err.message);
			})
			.finally(() => setIsSubmitting(false));
	};

	const getRoles = () => {
		AdminService.getMerchantRoleList({
			meta: {},
			body: {},
		}).then((res) => {
			setRoleOption(res.body);
			setValue("roleId", res.body?.[0].id);
		});
	};
	return (
		<WxMainLg className="operator_create">
			<WxFormHeader
				title="Add Operator "
				backNavigationLink={SETTINGS_SITE_OPERATOR}
			/>
			<form onSubmit={handleSubmit(onSubmitting)} noValidate>
				<div className="wx__row">
					<div className="wx__col-lg-8 wx__col-md-7 wx__col-sm-12 wx__mt-3">
						<div className="wx__card wx__p-4">
							<div className="wx__row">
								<div className="wx__col-md-12 wx__col-sm-12">
									<WxInput
										isRequired
										noMargin
										label="Email Address or Phone Number"
										registerProperty={{
											...register("userName", { required: true }),
										}}
										color={errors.userName ? "danger" : "secondary"}
										errorMessage={
											errors.userName && "Email or Phone is required"
										}
									/>
								</div>
								<div className="wx__col-md-12 wx__col-sm-12 wx__mt-3">
									<WxInput
										label="Operator Name"
										isRequired
										noMargin
										registerProperty={{
											...register("name", { required: true }),
										}}
										color={errors.name ? "danger" : "secondary"}
										errorMessage={errors.name && "Name is required"}
									/>
								</div>
							</div>
						</div>

						<div className="wx__card wx__p-4 wx__mt-3">
							<div className="wx__row">
								<h5 className="wx__text_heading wx__text_semibold wx__mb-0">
									Add User Password
								</h5>
								<div className="wx__col-md-6 wx__col-sm-12 wx__mt-3">
									<WxInput
										isRequired
										noMargin
										label="Password"
										type="password"
										registerProperty={{
											...register("password", { required: true }),
										}}
										color={errors.password ? "danger" : "secondary"}
										errorMessage={errors.password && "Password is required"}
									/>
								</div>
								<div className="wx__col-md-6 wx__col-sm-12 wx__mt-3">
									<WxInput
										isRequired
										noMargin
										label="Confirm Password"
										type="password"
										registerProperty={{
											...register("confirmPassword", { required: true }),
										}}
										color={errors.confirmPassword ? "danger" : "secondary"}
										errorMessage={
											errors.confirmPassword && "Confirm Password is required"
										}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="wx__col-lg-4 wx__col-md-5 wx__col-sm-12 wx__mt-3">
						<div className="wx__card wx__form_right wx__p-4">
							<WxButton
								type="submit"
								variant="fill"
								disabled={!isValid || isSubmitting}
							>
								Add Operator {isSubmitting && <Preloader />}
							</WxButton>
							<WxHr />
							<WxSelect
								label="Choose Role"
								isRequired
								valuesKey="id"
								textKey="roleName"
								options={roleOption}
								registerProperty={{ ...register("roleId", { required: true }) }}
								color={errors.roleId ? "danger" : "secondary"}
								errorMessage={errors.roleId && "Confirm Password is required"}
							/>
							<WxHr />
							<div className="wx__d-flex wx__justify-content-between wx__align-items-center wx__mb-3">
								<div className="d-flex">
									<WxSwitch
										label={
											<div className="wx__d-flex wx__text_medium">
												<span className="wx__me-1">Operator Status</span>
											</div>
										}
										defaultChecked={true}
										checkedTitle="Active"
										unCheckedTitle="Inactive"
										registerProperty={{
											...register("isActive"),
										}}
									/>
								</div>
							</div>
							<div className="wx__d-flex wx__align-items-center status_mxg_warning">
								<WxIcon icon="info" />
								<p className="wx__text_small wx__text_regular ms_2 wx__mb-0">
									Operator will get password through email
								</p>
							</div>
						</div>
					</div>
				</div>
			</form>
		</WxMainLg>
	);
};

export default SiteOperator;
