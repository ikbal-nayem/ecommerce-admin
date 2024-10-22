import WxMainLg from "@components/MainContentLayout/MainLg";
import Select from "@components/Select/Select";
import {Button} from "@components/Button";
import { FormHeader } from "@components/FormLayout";
import WxHr from "@components/WxHr";
import Icon from "@components/Icon";
import TextInput from "@components/TextInput";
import Switch from "@components/Switch";
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
			<FormHeader
				title="Add Operator "
				backNavigationLink={SETTINGS_SITE_OPERATOR}
			/>
			<form onSubmit={handleSubmit(onSubmitting)} noValidate>
				<div className="row">
					<div className="col-lg-8 col-md-7 col-sm-12 mt-3">
						<div className="card p-4">
							<div className="row">
								<div className="col-md-12 col-sm-12">
									<TextInput
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
								<div className="col-md-12 col-sm-12 mt-3">
									<TextInput
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

						<div className="card p-4 mt-3">
							<div className="row">
								<h5 className="text_heading text_semibold mb-0">
									Add User Password
								</h5>
								<div className="col-md-6 col-sm-12 mt-3">
									<TextInput
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
								<div className="col-md-6 col-sm-12 mt-3">
									<TextInput
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
					<div className="col-lg-4 col-md-5 col-sm-12 mt-3">
						<div className="card wx__form_right p-4">
							<Button
								type="submit"
								variant="fill"
								disabled={!isValid || isSubmitting}
							>
								Add Operator {isSubmitting && <Preloader />}
							</Button>
							<WxHr />
							<Select
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
							<div className="d-flex justify-content-between align-items-center mb-3">
								<div className="d-flex">
									<Switch
										label={
											<div className="d-flex text_medium">
												<span className="me-1">Operator Status</span>
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
							<div className="d-flex align-items-center status_mxg_warning">
								<Icon icon="info" />
								<p className="text_small text_regular ms_2 mb-0">
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
