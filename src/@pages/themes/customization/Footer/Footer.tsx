import MainLg from "@components/MainContentLayout/MainLg";
import Select from "@components/Select/Select";
import {Button} from "@components/Button";
import { FormHeader } from "@components/FormLayout";
import WxHr from "@components/WxHr";
import TextInput from "@components/TextInput";
import Label from "@components/Label";
import Switch from "@components/Switch";
import { IFilePayload } from "@interfaces/common.interface";
import { IMenuset } from "@interfaces/OnlineStore.interface";
import { IThemeFooter } from "@interfaces/themeCustomization.interface";
import { MenuSetService } from "services/api/onlineStore/Menu.service";
import { PaymentService } from "services/api/Payment.service";
import { StoreConfigService } from "services/api/settings/StoreConfig.service";
import { ThemeCustomizationService } from "services/api/settings/ThemeCustomization.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { imageURLGenerate } from "utils/utils";
import "./Footer.scss";

var layoutColumn = [
	"One Column",
	"Two Columns",
	"Three Columns",
	"Four Columns",
];

const SiteFooter = () => {
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isIconsLoading, setIsIconLoading] = useState<boolean>(true);
	const [selectedContent, setSelectedContent] = useState<number>(1);
	const [menuSetList, setMenuSetList] = useState<IMenuset[]>([]);
	const [getwayIcons, setGetwayIcons] = useState<IFilePayload[]>([]);
	const { register, handleSubmit, setValue, getValues, watch, reset } = useForm(
		{ mode: "onChange" }
	);

	useEffect(() => {
		const menusetReq = MenuSetService.getList({});
		const settingsReq = ThemeCustomizationService.getThemeSettings();
		Promise.all([menusetReq, settingsReq])
			.then(([menusetRes, settingsRes]) => {
				setMenuSetList(menusetRes.body);
				setSelectedContent(settingsRes?.body?.footer?.columnCount || 1);
				reset(settingsRes?.body?.footer || {});
			})
			.finally(() => setIsLoading(false));
		PaymentService.paymentGetwayIcons()
			.then((resp) => setGetwayIcons(resp?.body))
			.finally(() => setIsIconLoading(false));
	}, []);

	const onSelectImage = (icon: IFilePayload) => {
		const selectedIcons: IFilePayload[] = getValues("paymentIcons") || [];
		const idx = selectedIcons.findIndex(
			(i: IFilePayload) => i.fileName === icon.fileName
		);
		if (idx >= 0) {
			selectedIcons.splice(idx, 1);
		} else selectedIcons?.push(icon);
		setValue("paymentIcons", [...selectedIcons]);
	};

	const handleReset = (idx) => {
		// getValues([`contents.${idx}.menuSetId`, `contents.${idx}.isMenuVertical`, `contents.${idx}.hasSocialMediaIcons`])
		setValue(`contents.${idx}.menuSetId`, null);
		setValue(`contents.${idx}.isMenuVertical`, false);
		setValue(`contents.${idx}.hasSocialMediaIcons`, false);
	};

	const onSubmit = (data: IThemeFooter) => {
		setIsSaving(true);
		data.columnCount = selectedContent;
		data.contents = data.contents.slice(0, selectedContent);
		data.contents?.forEach((val, idx) => (val.serial = idx + 1));
		StoreConfigService.saveFooter(data)
			.then((resp) => ToastService.success(resp.message))
			.catch((err) => ToastService.error(err.messgae))
			.finally(() => setIsSaving(false));
	};

	if (isLoading) return <Preloader />;

	return (
		<MainLg className="footer-sec">
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<FormHeader
					title="Footer"
					rightContent={
						<Button variant="fill" type="submit" disabled={isSaving}>
							{isSaving ? <Preloader /> : "Save"}
						</Button>
					}
				/>
				<div className="card p-4">
					<div className="row footer-top">
						<h6 className="text_semibold">Select Footer Content</h6>
						{layoutColumn.map((layout, idx) => (
							<div
								className="col-lg-3 col-md-6 mt-3"
								key={idx}
								onClick={() => setSelectedContent(idx + 1)}
							>
								<div
									className={`column__ column__${idx + 1} ${
										selectedContent === idx + 1 ? "active" : ""
									}`}
								>
									{Array(idx + 1)
										.fill(null)
										.map((_, cIdx) => (
											<div key={cIdx} className="content" />
										))}
								</div>
								<p className="text_subtitle text_regular column-label">
									{layout}
								</p>
							</div>
						))}
					</div>
				</div>

				<div className="card mt-4 p-4">
					{Array(selectedContent)
						.fill(null)
						.map((_, idx) => (
							<div key={idx}>
								<div className="row">
									<div className="middle-title d-flex align-items-center">
										<div className="column__select me-2">
											<div className="column__select_cl" />
										</div>
										<h6 className="text_semibold mb-0">
											Select footer for column {idx + 1}
										</h6>
										<div className="ms-auto">
											<Button
												size="sm"
												color="secondary"
												variant="outline"
												onClick={() => handleReset(idx)}
											>
												Reset
											</Button>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-md-6 mt-3">
										<Select
											label="Choose menu set"
											options={menuSetList}
											placeholder="Select"
											valuesKey="id"
											textKey="name"
											registerProperty={{
												...register(`contents.${idx}.menuSetId`),
											}}
										/>
									</div>
									<div className="col-md-6"></div>
									<div className="col-md-6">
										<div className="mb-2" style={{ maxWidth: "85%" }}>
											<Switch
												label="Menu style"
												checkedTitle="Vertical"
												unCheckedTitle="Horizontal"
												registerProperty={{
													...register(`contents.${idx}.isMenuVertical`),
												}}
											/>
										</div>
									</div>
								</div>
								{selectedContent !== idx + 1 && <WxHr />}
							</div>
						))}
				</div>

				<div className="card mt-4 p-4">
					<div className="row">
						<div className="col-md-6">
							<div style={{ maxWidth: "85%" }}>
								<Switch
									label="Show social media icons"
									checkedTitle="Yes"
									unCheckedTitle="No"
									registerProperty={{
										...register("hasSocialMediaIcons"),
									}}
								/>
							</div>
						</div>
					</div>
					<div className="row mt-4">
						<div className="col-md-6">
							<TextInput
								label="Copyright Information"
								registerProperty={{
									...register("copyright"),
								}}
							/>
						</div>
					</div>
					<Label>Payment icon</Label>
					{isIconsLoading ? (
						<Preloader />
					) : getwayIcons.length ? (
						<div className="d-flex flex-wrap justify-content-center gap-2">
							{getwayIcons?.map((icon) => (
								<div
									key={icon?.fileName}
									className={`payment-getway-image ${
										watch("paymentIcons")?.some(
											(i: IFilePayload) => i.fileName === icon.fileName
										)
											? "active"
											: ""
									}`}
									onClick={() => onSelectImage(icon)}
								>
									<img
										src={imageURLGenerate(icon)}
										alt="Getway Icon"
										draggable={false}
									/>
								</div>
							))}
						</div>
					) : (
						<small className="text-center text-muted">
							No payment getway image found!
						</small>
					)}
				</div>
			</form>
		</MainLg>
	);
};

export default SiteFooter;
