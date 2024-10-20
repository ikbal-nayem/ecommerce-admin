import { ConfirmationModal } from "@components/ConfirmationModal/ConfirmationModal";
import WxMainLg from "@components/MainContentLayout/MainLg";
import TableLoader from "@components/TableLoader/TableLoader";
import {Button} from "@components/Button";
import { WxFormHeader } from "@components/WxFormLayout";
import WxIcon from "@components/Icon";
import Switch from "@components/Switch";
import WxThumbnail from "@components/Thumbnail";
import { ISlider } from "@interfaces/themeCustomization.interface";
import { THEME_CUSTOMIZATION_SLIDER_DETAILS } from "routes/path-name.route";
import { SliderService } from "services/api/onlineStore/themes/Slider.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { generateDateFormat } from "utils/splitDate";
import { imageURLGenerate } from "utils/utils";
import AddSlider from "./components/AddSlider";
import "./Slider.scss";

const Slider = () => {
	const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [sliderData, setSliderData] = useState<ISlider[]>([]);
	const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
	const [isEditForm, setIsEditForm] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState(false);
	const editItem = useRef<ISlider | null>(null);
	const deleteItem = useRef<ISlider | null>(null);

	useEffect(() => {
		getSliders();
	}, []);

	const getSliders = () => {
		setIsLoading(true);
		SliderService.get({
			meta: {
				limit: 1000,
				offset: 0,
				sort: [{ order: "desc", field: "createdOn" }],
			},
		})
			.then((res) => setSliderData(res.body))
			.finally(() => setIsLoading(false));
	};

	const handleFormClose = () => {
		editItem.current = null;
		setIsEditForm(false);
		setIsFormOpen(false);
	};

	const handleConfirmClose = () => {
		deleteItem.current = null;
		setIsConfirmOpen(false);
	};

	const handleDelete = (item: ISlider) => {
		deleteItem.current = item;
		setIsConfirmOpen(true);
	};

	const onConfirmDelete = () => {
		setIsLoading(true);
		SliderService.deleteAll([deleteItem.current?.id])
			.then((res) => {
				ToastService.success(res.message);
				sliderData.splice(
					sliderData.findIndex((sl) => sl?.id === deleteItem.current?.id),
					1
				);
				setSliderData([...sliderData]);
				handleConfirmClose();
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsLoading(false));
	};

	const onEditStart = (requestData: ISlider) => {
		editItem.current = requestData;
		setIsEditForm(true);
		setIsFormOpen(true);
	};

	const onStatusChange = (
		requestData: ISlider,
		status: boolean,
		index: number
	) => {
		requestData.isActive = status;
		SliderService.update(requestData)
			.then((res) => {
				sliderData[index] = requestData;
				setSliderData([...sliderData]);
			})
			.catch((err) => ToastService.error(err.message));
	};

	const onSubmitting = (requestData: ISlider) => {
		setIsSaving(true);
		if (isEditForm) {
			SliderService.update(requestData)
				.then((res) => {
					ToastService.success(res.message);
					getSliders();
					handleFormClose();
				})
				.catch((err) => ToastService.error(err.message))
				.finally(() => setIsSaving(false));
			return;
		}
		SliderService.create(requestData)
			.then((res) => {
				ToastService.success(res.message);
				setSliderData([res.body, ...sliderData]);
				handleFormClose();
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsSaving(false));
	};

	return (
		<WxMainLg className="homeSection">
			<WxFormHeader title="Slider" />
			<div className="card p-3">
				<TableLoader isLoading={isLoading} />
				<div className="title_section">
					<div className="title" />
					<Button onClick={() => setIsFormOpen(true)} variant="outline">
						<WxIcon icon="add" />
						<span>Add Slider</span>
					</Button>
				</div>
				{sliderData?.length ? (
					<div className="wx__responsive_table">
						{sliderData.map((item: ISlider, index) => (
							<ul
								className="single-banner d-flex justify-content-between align-items-center"
								key={index}
							>
								<li className="banner-left">
									<div className="d-flex align-items-center">
										<WxThumbnail src={imageURLGenerate(item?.thumbnail)} />
										<div className="banner_title_section">
											<Link
												className="banner_title"
												to={THEME_CUSTOMIZATION_SLIDER_DETAILS({ id: item.id })}
											>
												{item.title}
											</Link>
											<br />
											<small className="text-muted text_small">
												Last updated on &nbsp;
												{generateDateFormat(
													item?.lastUpdated,
													"%date%-%MM%-%yyyy%, %hour%:%minute% %ampm%"
												)}
											</small>
										</div>
									</div>
								</li>
								<li className="banner-right me-2">
									<div className="d-flex align-items-center gap-3">
										<Switch
											onChange={(e) =>
												onStatusChange(item, e.target.checked, index)
											}
											isChecked={item?.isActive}
										/>
										<WxIcon
											variants="outlined"
											icon="delete"
											color="danger"
											size={22}
											onClick={() => handleDelete(item)}
											className="edit-icon"
										/>
										<WxIcon
											variants="outlined"
											icon="edit"
											size={22}
											onClick={() => onEditStart(item)}
										/>
									</div>
								</li>
							</ul>
						))}
					</div>
				) : (
					<div className="no_banner_added">No Slider added</div>
				)}
			</div>
			<AddSlider
				isOpen={isFormOpen}
				isEditForm={isEditForm}
				handleFormClose={handleFormClose}
				editedData={editItem.current}
				onSubmitting={onSubmitting}
				handleDelete={handleDelete}
				isSaving={isSaving}
			/>
			<ConfirmationModal
				isSubmitting={isLoading}
				isOpen={isConfirmOpen}
				onClose={handleConfirmClose}
				onConfirm={onConfirmDelete}
				body={`Are your sure you want to delete '${deleteItem.current?.title}'? This action wont be reverseable!`}
			/>
		</WxMainLg>
	);
};

export default Slider;
