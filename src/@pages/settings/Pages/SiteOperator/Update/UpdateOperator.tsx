import WxMainLg from "@components/MainContentLayout/MainLg";
import WxSelect from "@components/Select/Select";
import {Button} from "@components/Button";
import { FormHeader } from "@components/FormLayout";
import WxHr from "@components/WxHr";
import WxIcon from "@components/Icon";
import TextInput from "@components/TextInput";
import Switch from "@components/Switch";
import { SETTINGS_SITE_OPERATOR } from "routes/path-name.route";
import { AdminService } from "services/api/admin/Admin.service";
import { SiteOperatorService } from "services/api/settings/SiteOperator.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import "./UpdateOperator.scss";

const SiteOperatorUpdate = () => {
	const [roleOption, setRoleOption] = useState<any[]>([]);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const { id } = useParams();

	const {
		register,
		handleSubmit,
		watch,
		reset,
		formState: { errors },
	} = useForm();

	const navigate = useNavigate();
	const onSubmitting = (requestData: any) => {
		setIsSubmitting(true);

		SiteOperatorService.update(requestData)
			.then((res) => {
				ToastService.success(res.message);
				navigate(SETTINGS_SITE_OPERATOR);
			})
			.catch((err) => {
				ToastService.error(err.message);
			})
			.finally(() => setIsSubmitting(false));
	};

	useEffect(() => {
		getRoles();
		// getStaffInfo();
	}, []);

	const getRoles = () => {
		AdminService.getMerchantRoleList({
			meta: {},
			body: {},
		})
			.then((res) => {
				setRoleOption(res.body);
			})
			.finally(() => {
				getStaffInfo();
			});
	};

	const getStaffInfo = () => {
		SiteOperatorService.getById(id)
			.then((res) => {
				reset({
					...res.body,
					userName: res.body?.email || res.body?.phone,
				});

				// setValue("id", res.body?.id);
				// setValue("userName", res.body?.email || res.body?.phone);
				// setValue("name", res.body?.name);
				// setValue("isActive", res.body?.isActive);
				// setValue("roleId", res.body?.roleId || null);
			})
			.finally(() => setIsLoading(false));
	};

	// const

	return (
		<WxMainLg className="operator_update">
			<FormHeader
				title="Update Operator "
				backNavigationLink={SETTINGS_SITE_OPERATOR}
			/>
			{isLoading && <Preloader />}

			<form onSubmit={handleSubmit(onSubmitting)}>
				<div className="row">
					<div className="col-md-8 col-sm-12 mt-3">
						<div className="card p-4">
							<div className="row">
								<div className="col-md-12 col-sm-12">
									<TextInput
										// isRequired
										isDisabled
										noMargin
										label="Email Address or Phone Number"
										registerProperty={{
											...register("userName", { required: false }),
										}}
										color={errors.userName ? "danger" : "success"}
										errorMessage={
											errors.userName && "Email or Phone is requiredx"
										}
									/>
								</div>
								<div className="col-md-12 col-sm-12 mt-3">
									<TextInput
										label="Operator Name"
										noMargin
										registerProperty={{
											...register("name", { required: true }),
										}}
										color={errors.name ? "danger" : "success"}
										errorMessage={errors.name && "Name is required"}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="col-md-4 col-sm-12 mt-3">
						<div className="card wx__form_right p-4">
							<Button type="submit" variant="fill" disabled={isSubmitting}>
								Save Operator {isSubmitting && <Preloader />}
							</Button>
							<WxHr />
							<div>
								<WxSelect
									label="Choose Role"
									key={watch("roleId")}
									defaultValue={watch("roleId")}
									valuesKey="id"
									textKey="roleName"
									options={roleOption}
									registerProperty={{ ...register("roleId") }}
								/>
							</div>
							<WxHr />
							<div className="d-flex justify-content-between align-items-center mb-3">
								<div className="d-flex">
									<Switch
										label={
											<div className="d-flex text_medium me-1">
												<span>Operator Status</span>
											</div>
										}
										checkedTitle="Active"
										unCheckedTitle="Inactive"
										registerProperty={{
											...register("isActive"),
										}}
									/>
								</div>
							</div>
							<div className="d-flex align-items-center status_mxg_warning">
								<WxIcon icon="info" />
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

export default SiteOperatorUpdate;
