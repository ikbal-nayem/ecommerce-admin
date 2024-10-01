import WxButton from "@components/WxButton";
import WxDrawer from "@components/WxDrawer";
import WxDrawerBody from "@components/WxDrawer/WxDrawerBody";
import WxDrawerFooter from "@components/WxDrawer/WxDrawerFooter";
import WxDrawerHeader from "@components/WxDrawer/WxDrawerHeader";
import WxInput from "@components/WxInput";
import WxLabel from "@components/WxLabel";
import { MediaInput } from "@components/WxMediaInput";
import WxSwitch from "@components/WxSwitch";
import { IFilePayload } from "@interfaces/common.interface";
import { ButtonLoader } from "services/utils/preloader.service";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const AddSliderImage = ({
	isOpen,
	handleFormClose,
	editedData,
	isEditForm,
	submitForm,
	isSaving,
	handleDelete,
}) => {
	const [images, setImages] = useState<IFilePayload[] | File[]>([]);
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { errors },
		watch,
	} = useForm<any>({ defaultValues: { isActive: true } });

	useEffect(() => {
		if (isEditForm) {
			reset({ ...editedData });
			setImages([editedData?.image]);
			return;
		}
		reset({ isActive: true });
		setImages([]);
	}, [isEditForm, editedData, isOpen]);

	const handleImageAdd = useCallback((images: File[]) => {
		setImages(images);
		setValue("image", images[0]);
	}, []);

	const onImageRemove = useCallback(() => {
		setImages([]);
		setValue("image", null);
	}, [isEditForm, editedData]);

	return (
		<WxDrawer show={isOpen} handleClose={handleFormClose}>
			<div className="manage_slider_sec">
				<WxDrawerHeader
					title={`${isEditForm ? "Edit" : "Add"} Slider Banner`}
					closeIconAction={handleFormClose}
				/>
				<form onSubmit={handleSubmit(submitForm)}>
					<WxDrawerBody>
						<div className="row">
							<div className="col-md-12">
								<WxLabel>Slider Image</WxLabel>
								<MediaInput
									fileList={images}
									onChange={handleImageAdd}
									onRemove={onImageRemove}
									multiple={false}
								/>
							</div>
							<div className="wx__my-4" style={{ maxWidth: "90%" }}>
								<WxSwitch
									key={watch("hasButton")}
									label="Show Button"
									checkedTitle="Yes"
									unCheckedTitle="No"
									defaultChecked={!!watch("hasButton")}
									registerProperty={{
										...register("hasButton"),
									}}
								/>
							</div>
							{!!watch("hasButton") && (
								<>
									<div className="col-md-12">
										<WxInput
											label="Button Text"
											isRequired
											registerProperty={{
												...register("buttonTitle", {
													required: "Button text is required!",
												}),
											}}
											color={errors?.buttonTitle ? "danger" : "secondary"}
											errorMessage={errors?.buttonTitle?.message}
										/>
									</div>

									<div className="col-md-12">
										<WxInput
											label="Button Url"
											isRequired
											registerProperty={{
												...register("buttonUrl", {
													required: "Button URL is required!",
												}),
											}}
											color={errors?.buttonUrl ? "danger" : "secondary"}
											errorMessage={errors?.buttonUrl?.message}
										/>
									</div>
								</>
							)}

							<div className="col-md-12">
								<WxInput
									label="Title"
									registerProperty={{ ...register("title") }}
								/>
							</div>
							<div className="col-md-12">
								<WxInput
									label="Subtitle"
									registerProperty={{ ...register("subTitle") }}
								/>
							</div>
							{/* <div className="col-md-12">
								<WxTextarea
									label="Description"
									registerProperty={{ ...register("description") }}
								/>
							</div> */}

							<div className="wx__mb-4" style={{ maxWidth: "90%" }}>
								<WxSwitch
									label="Status"
									checkedTitle="Active"
									unCheckedTitle="Inactive"
									registerProperty={{
										...register("isActive"),
									}}
								/>
							</div>
						</div>
					</WxDrawerBody>
					<WxDrawerFooter>
						<div className="delivery_create_sec__footer">
							<div className="d-flex wx__align-items-center wx__justify-content-between">
								<div>
									{isEditForm && (
										<WxButton
											variant="fill"
											disabled={isSaving}
											color="danger"
											onClick={() => handleDelete(editedData)}
										>
											Delete
										</WxButton>
									)}
								</div>

								<div className="d-flex wx__align-items-center wx__justify-content-between">
									<WxButton
										color="secondary"
										type="button"
										variant="outline"
										className="wx__me-2"
										onClick={handleFormClose}
										disabled={isSaving}
									>
										Cancel
									</WxButton>
									<WxButton variant="fill" type="submit" disabled={isSaving}>
										{isSaving ? (
											<ButtonLoader />
										) : isEditForm ? (
											"Update"
										) : (
											"Add"
										)}
									</WxButton>
								</div>
							</div>
						</div>
					</WxDrawerFooter>
				</form>
			</div>
		</WxDrawer>
	);
};
export default AddSliderImage;
