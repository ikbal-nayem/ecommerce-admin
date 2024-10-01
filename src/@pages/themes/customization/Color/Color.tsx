import WxMainLg from "@components/MainContentLayout/WxMainLg";
import TableLoader from "@components/TableLoader/TableLoader";
import WxButton from "@components/WxButton";
import WxColorPicker from "@components/WxColorPicker";
import { WxFormHeader } from "@components/WxFormLayout";
import { ThemeCustomizationService } from "services/api/settings/ThemeCustomization.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./Color.scss";

export default function CustomizationColor() {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const { register, handleSubmit, reset } = useForm();

	useEffect(() => {
		ThemeCustomizationService.getThemeSettings()
			.then((resp) => reset({ ...resp.body?.color }))
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsLoading(false));
	}, []);

	const onSubmit = (requestData) => {
		setIsSaving(true);
		ThemeCustomizationService.saveColor(requestData)
			.then((resp) => ToastService.success(resp.message))
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsSaving(false));
	};

	return (
		<WxMainLg className="color-sec">
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<WxFormHeader
					title="Color"
					rightContent={
						<WxButton variant="fill" type="submit" disabled={isSaving}>
							{isSaving ? <Preloader /> : "Save"}
						</WxButton>
					}
				/>
				{/* basic Color */}
				<div className="card wx__p-4">
					{isLoading ? <TableLoader isLoading={isLoading} /> : null}
					<div className="row">
						<h6 className="wx__text_semibold">Basic color</h6>
						<div className="col-md-4 col-sm-6 wx__mt-2">
							<p className="wx__mb-2 text__small">Primary color</p>
							<WxColorPicker
								registerProperty={{
									...register("primary"),
								}}
							/>
						</div>
						<div className="col-md-4 col-sm-6 wx__mt-2">
							<p className="wx__mb-2 text__small">Secondary color</p>
							<WxColorPicker
								registerProperty={{
									...register("secondary"),
								}}
							/>
						</div>
					</div>
				</div>
				{/* Button Color */}
				<div className="card wx__mt-4 wx__p-4">
					<div className="row">
						<h6 className="wx__text_semibold">Button</h6>
						<div className="col-md-4 col-sm-6 wx__mt-2">
							<p className="wx__mb-2 text__small">Button Text</p>
							<WxColorPicker
								registerProperty={{
									...register("button.text"),
								}}
							/>
						</div>
					</div>
				</div>
				{/* Footer Color */}
				<div className="card wx__mt-4 wx__p-4">
					<div className="row">
						<h6 className="wx__text_semibold">Footer</h6>
						<div className="col-md-4 col-sm-6 wx__mt-2">
							<p className="wx__mb-2 text__small">Background Color</p>
							<WxColorPicker
								registerProperty={{
									...register("footer.background"),
								}}
							/>
						</div>
						<div className="col-md-4 col-sm-6 wx__mt-2">
							<p className="wx__mb-2 text__small">Head line</p>
							<WxColorPicker
								registerProperty={{
									...register("footer.headLine"),
								}}
							/>
						</div>
						<div className="col-md-4 col-sm-6 wx__mt-2">
							<p className="wx__mb-2 text__small">text</p>
							<WxColorPicker
								registerProperty={{
									...register("footer.text"),
								}}
							/>
						</div>
					</div>
				</div>
			</form>
		</WxMainLg>
	);
}
