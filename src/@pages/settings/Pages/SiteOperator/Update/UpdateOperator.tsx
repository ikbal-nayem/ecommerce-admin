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
			<WxFormHeader
				title="Update Operator "
				backNavigationLink={SETTINGS_SITE_OPERATOR}
			/>
			{isLoading && <Preloader />}

			<form onSubmit={handleSubmit(onSubmitting)}>
				<div className="wx__row">
					<div className="wx__col-md-8 wx__col-sm-12 wx__mt-3">
						<div className="wx__card wx__p-4">
							<div className="wx__row">
								<div className="wx__col-md-12 wx__col-sm-12">
									<WxInput
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
								<div className="wx__col-md-12 wx__col-sm-12 wx__mt-3">
									<WxInput
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
					<div className="wx__col-md-4 wx__col-sm-12 wx__mt-3">
						<div className="wx__card wx__form_right wx__p-4">
							<WxButton type="submit" variant="fill" disabled={isSubmitting}>
								Save Operator {isSubmitting && <Preloader />}
							</WxButton>
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
							<div className="wx__d-flex wx__justify-content-between wx__align-items-center wx__mb-3">
								<div className="d-flex">
									<WxSwitch
										label={
											<div className="wx__d-flex wx__text_medium wx__me-1">
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
							<div className="wx__d-flex wx__align-items-center status_mxg_warning">
								<WxIcon icon="info" />
								<p className="wx__text_small wx__text_regular wx__ms-2 wx__mb-0">
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
