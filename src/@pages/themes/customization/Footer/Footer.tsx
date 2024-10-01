import WxMainLg from "@components/MainContentLayout/WxMainLg";
import WxSelect from "@components/Select/WxSelect";
import WxButton from "@components/WxButton";
import { WxFormHeader } from "@components/WxFormLayout";
import WxHr from "@components/WxHr";
import WxInput from "@components/WxInput";
import WxLabel from "@components/WxLabel";
import WxSwitch from "@components/WxSwitch";
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
		<WxMainLg className="footer-sec">
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<WxFormHeader
					title="Footer"
					rightContent={
						<WxButton variant="fill" type="submit" disabled={isSaving}>
							{isSaving ? <Preloader /> : "Save"}
						</WxButton>
					}
				/>
				<div className="card wx__p-4">
					<div className="row footer-top">
						<h6 className="wx__text_semibold">Select Footer Content</h6>
						{layoutColumn.map((layout, idx) => (
							<div
								className="col-lg-3 col-md-6 wx__mt-3"
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
								<p className="wx__text_subtitle wx__text_regular column-label">
									{layout}
								</p>
							</div>
						))}
					</div>
				</div>

				<div className="card wx__mt-4 wx__p-4">
					{Array(selectedContent)
						.fill(null)
						.map((_, idx) => (
							<div key={idx}>
								<div className="row">
									<div className="middle-title d-flex wx__align-items-center">
										<div className="column__select wx__me-2">
											<div className="column__select_cl" />
										</div>
										<h6 className="wx__text_semibold wx__mb-0">
											Select footer for column {idx + 1}
										</h6>
										<div className="wx__ms-auto">
											<WxButton
												size="sm"
												color="secondary"
												variant="outline"
												onClick={() => handleReset(idx)}
											>
												Reset
											</WxButton>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-md-6 wx__mt-3">
										<WxSelect
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
										<div className="wx__mb-2" style={{ maxWidth: "85%" }}>
											<WxSwitch
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

				<div className="card wx__mt-4 wx__p-4">
					<div className="row">
						<div className="col-md-6">
							<div style={{ maxWidth: "85%" }}>
								<WxSwitch
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
					<div className="row wx__mt-4">
						<div className="col-md-6">
							<WxInput
								label="Copyright Information"
								registerProperty={{
									...register("copyright"),
								}}
							/>
						</div>
					</div>
					<WxLabel>Payment icon</WxLabel>
					{isIconsLoading ? (
						<Preloader />
					) : getwayIcons.length ? (
						<div className="d-flex wx__flex-wrap wx__justify-content-center gap-2">
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
						<small className="wx__text-center wx__text-muted">
							No payment getway image found!
						</small>
					)}
				</div>
			</form>
		</WxMainLg>
	);
};

export default SiteFooter;
