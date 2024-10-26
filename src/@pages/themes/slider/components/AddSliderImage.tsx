import {Button} from "@components/Button";
import Drawer from "@components/Drawer";
import DrawerBody from "@components/Drawer/DrawerBody";
import DrawerFooter from "@components/Drawer/DrawerFooter";
import DrawerHeader from "@components/Drawer/DrawerHeader";
import TextInput from "@components/TextInput";
import Label from "@components/Label";
import { MediaInput } from "@components/MediaInput";
import Switch from "@components/Switch";
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
		<Drawer show={isOpen} handleClose={handleFormClose}>
			<div className="manage_slider_sec">
				<DrawerHeader
					title={`${isEditForm ? "Edit" : "Add"} Slider Banner`}
					onClickClose={handleFormClose}
				/>
				<form onSubmit={handleSubmit(submitForm)}>
					<DrawerBody>
						<div className="row">
							<div className="col-md-12">
								<Label>Slider Image</Label>
								<MediaInput
									fileList={images}
									// onChange={handleImageAdd}
									// onRemove={onImageRemove}
									// multiple={false}
								/>
							</div>
							<div className="my-4" style={{ maxWidth: "90%" }}>
								<Switch
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
										<TextInput
											label="Button Text"
											isRequired
											registerProperty={{
												...register("buttonTitle", {
													required: "Button text is required!",
												}),
											}}
											color={errors?.buttonTitle ? "danger" : "secondary"}
											errorMessage={errors?.buttonTitle?.message as string}
										/>
									</div>

									<div className="col-md-12">
										<TextInput
											label="Button Url"
											isRequired
											registerProperty={{
												...register("buttonUrl", {
													required: "Button URL is required!",
												}),
											}}
											color={errors?.buttonUrl ? "danger" : "secondary"}
											errorMessage={errors?.buttonUrl?.message as string}
										/>
									</div>
								</>
							)}

							<div className="col-md-12">
								<TextInput
									label="Title"
									registerProperty={{ ...register("title") }}
								/>
							</div>
							<div className="col-md-12">
								<TextInput
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

							<div className="mb-4" style={{ maxWidth: "90%" }}>
								<Switch
									label="Status"
									checkedTitle="Active"
									unCheckedTitle="Inactive"
									registerProperty={{
										...register("isActive"),
									}}
								/>
							</div>
						</div>
					</DrawerBody>
					<DrawerFooter>
						<div className="delivery_create_sec__footer">
							<div className="d-flex align-items-center justify-content-between">
								<div>
									{isEditForm && (
										<Button
											variant="fill"
											disabled={isSaving}
											color="danger"
											onClick={() => handleDelete(editedData)}
										>
											Delete
										</Button>
									)}
								</div>

								<div className="d-flex align-items-center justify-content-between">
									<Button
										color="secondary"
										type="button"
										variant="outline"
										className="me-2"
										onClick={handleFormClose}
										disabled={isSaving}
									>
										Cancel
									</Button>
									<Button variant="fill" type="submit" disabled={isSaving}>
										{isSaving ? (
											<ButtonLoader />
										) : isEditForm ? (
											"Update"
										) : (
											"Add"
										)}
									</Button>
								</div>
							</div>
						</div>
					</DrawerFooter>
				</form>
			</div>
		</Drawer>
	);
};
export default AddSliderImage;
