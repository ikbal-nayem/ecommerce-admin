import WxMainLg from "@components/MainContentLayout/WxMainLg";
import SelectOption from "@components/Select/Select";
import WxButton from "@components/WxButton";
import { WxFormHeader } from "@components/WxFormLayout";
import WxIcon from "@components/WxIcon/WxIcon";
import WxSlider from "@components/WxSlider";
import { ISliderItem } from "@interfaces/themeCustomization.interface";
import { ThemeCustomizationService } from "services/api/settings/ThemeCustomization.service";
import {
	SliderItemService,
	SliderService,
} from "services/api/onlineStore/themes/Slider.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import "./HomePage.scss";

interface ISlider {
	id: string;
	title: string;
	isActive: boolean;
	isDisabled?: boolean;
	storeId?: string;
}

export default function CustomizationHome() {
	const [previewFlag, setPreviewFlag] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [reloaderSlider, setIsReloadSlider] = useState<boolean>(false);
	const [sliderItems, setSliderItems] = useState<any[]>([]);
	const [sliders, setSliders] = useState<ISliderItem[]>([]);
	const [themeSettings, setThemeSettings] = useState<any>();
	const [selectedSlider, setSelectedSlider] = useState<ISlider | any>(
		{} as any
	);
	const [selectedPreviusSlider, setSelectedPreviusSlider] = useState<
		ISlider | any
	>({} as any);

	const onChangeSlider = (value: any) => {
		if (!value) {
			setSelectedSlider({});
			return;
		}

		if (value.id !== selectedSlider?.id) setSliderItems([]);

		// setPreviewFlag(false);
		setSelectedSlider(value);
		if (previewFlag && value.id !== selectedSlider?.id) setIsReloadSlider(true);
	};

	useEffect(() => {
		getSliders();
		getThemeSettings();
	}, []);

	useEffect(() => {
		if (sliders?.length && themeSettings) {
			const slider = sliders.find(
				(item) => item.id === themeSettings?.homePage?.sliderId
			);
			setSelectedSlider(slider);
			setSelectedPreviusSlider(slider);
		}
	}, [sliders, themeSettings]);

	const getThemeSettings = () => {
		ThemeCustomizationService.getThemeSettings()
			.then((res) => {
				setThemeSettings(res.body);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const getSliders = () => {
		SliderService.get({})
			.then((res) => {
				res.body.map((item) => {
					item.isDisabled = !item.isActive;
				});
				setSliders(res.body);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};
	const onSaveFun = () => {
		setIsLoading(true);
		ThemeCustomizationService.saveHome({
			sliderId: selectedSlider?.id || null,
		})
			.then((res) => {
				ToastService.success(res.message);
				getThemeSettings();
			})
			.catch((err) => {
				ToastService.error(err.message);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	useEffect(() => {
		if (
			previewFlag &&
			(!sliderItems?.length || sliderItems[0].sliderId !== selectedSlider?.id)
		)
			getSliderImageList();
	}, [previewFlag, reloaderSlider]);

	const getSliderImageList = () => {
		setIsLoading(true);
		SliderItemService.getBySliderId(selectedSlider?.id)
			.then((res) => {
				setSliderItems(res.body);
			})
			.finally(() => {
				setIsLoading(false);
				setIsReloadSlider(false);
			});
	};

	return (
		<WxMainLg className="homeSection">
			<WxFormHeader title="Homepage" />
			{isLoading && <Preloader />}
			<div className="wx__card wx__p-3">
				<div className="wx__row">
					<div className="page-title wx__d-flex wx__justify-content-between wx__align-items-center">
						<h6 className="wx__text_semibold wx__mb-0">Home Slider</h6>
						<div className="right wx__d-flex wx__flex-row wx__align-items-center">
							{/* TODO:: need to responsive */}
							<div style={{ width: "200px" }} className="wx__me-3">
								<SelectOption
									options={sliders}
									onChange={onChangeSlider}
									getOptionValue={(option) => option}
									getOptionLabel={(option) => option?.title}
									value={selectedSlider}
								/>
							</div>
							<WxButton
								onClick={onSaveFun}
								variant="fill"
								className="wx__me-3 wx__btn_sm"
								disabled={
									JSON.stringify(selectedPreviusSlider) ===
									JSON.stringify(selectedSlider)
								}
							>
								Save
							</WxButton>
							{!!selectedSlider?.id && (
								<WxButton
									onClick={() => setPreviewFlag(!previewFlag)}
									variant="outline"
									color="secondary"
									className="wx__btn_sm"
								>
									{previewFlag ? (
										<WxIcon icon="visibility_off" />
									) : (
										<WxIcon icon="remove_red_eye" />
									)}
								</WxButton>
							)}
						</div>
					</div>
				</div>
				{previewFlag && !!sliderItems?.length && (
					<div className="preview-slider wx__mt-4">
						<WxSlider
							imageList={sliderItems}
							timeInterval={3500}
							srcKey={"image"}
						/>
					</div>
				)}
			</div>
		</WxMainLg>
	);
}
