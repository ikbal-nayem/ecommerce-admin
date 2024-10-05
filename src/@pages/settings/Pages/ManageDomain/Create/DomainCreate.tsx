import WxMainSm from "@components/MainContentLayout/WxMainSm";
import {Button} from "@components/Button";
import { WxFormHeader } from "@components/WxFormLayout";
import TextInput from "@components/TextInput";
import { DOMAIN_SETUP_INSTRUCTION } from "config/constants";
import { IDomainSettingsItem } from "@interfaces/Settings.interface";
import { SETTINGS_DOMAIN } from "routes/path-name.route";
import { DomainSettingService } from "services/api/settings/Domain.service";
import { ToastService } from "services/utils/toastr.service";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { imageURLGenerate } from "utils/utils";
import "./DomainCreate.scss";

const DomainCreate = () => {
	const [saving, setSaving] = useState(false);
	const [domain, setDomain] = useState<IDomainSettingsItem>();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: "onChange",
	});

	const onSubmitting = (requestData: any) => {
		if (domain?.id) return;
		setSaving(true);
		DomainSettingService.create(requestData)
			.then((res) => {
				ToastService.success(res.message);
				setDomain(res.body);
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setSaving(false));
	};

	return (
		<WxMainSm className="domain_create_sec">
			<div className="mb-3">
				<WxFormHeader
					title="Connect Existing Domain"
					backNavigationLink={SETTINGS_DOMAIN}
				/>
			</div>
			<form onSubmit={handleSubmit(onSubmitting)} noValidate>
				<div className="card p-4">
					<div className="row">
						<div className="col-md-12 col-sm-12">
							<TextInput
								label="Existing Domain"
								isRequired
								noMargin
								placeholder="Enter your domain you want connect."
								registerProperty={{
									...register("domainAddress", {
										required: "Domain is required",
										pattern: {
											value:
												/^(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|([a-zA-Z0-9][a-zA-Z0-9-_]{1,61}[a-zA-Z0-9]))\.([a-zA-Z]{2,6}|[a-zA-Z0-9-]{2,30}\.[a-zA-Z]{2,3})$/,
											message: "Invalid domain address",
										},
									}),
								}}
								color={errors?.domainAddress ? "danger" : "secondary"}
								errorMessage={errors?.domainAddress?.message}
							/>
						</div>
						<p className="text_subtitle mt-3">
							<strong>Note: </strong>Please read this{" "}
							<a
								href={imageURLGenerate(DOMAIN_SETUP_INSTRUCTION)}
								target="_blank"
								rel="noopener noreferrer"
							>
								instruction
							</a>{" "}
							carefully before adding your custom domain.
						</p>
						{!domain?.id ? (
							<div>
								<Button type="submit" variant="fill" w={25} disabled={saving}>
									Save
								</Button>
							</div>
						) : null}
					</div>
				</div>
			</form>
			{domain?.id ? (
				<div className="card p-4 mt-3">
					<p>
						Thanks for staying with WebX. It will take few minutes (usually{" "}
						<b>1-5</b> minutes) to configure your domain and acquire{" "}
						<b>Free SSL</b>.
						<br />
						<br />
						Please be patient during the while.
					</p>
				</div>
			) : null}
		</WxMainSm>
	);
};

export default DomainCreate;

{
	/* <section className="domain_create_sec">
			<div className="setting_content">
				
				
			</div>
		</section> */
}
