import {Button} from "@components/Button";
import WxDrawer from "@components/Drawer";
import WxDrawerBody from "@components/Drawer/DrawerBody";
import WxDrawerFooter from "@components/Drawer/DrawerFooter";
import WxDrawerHeader from "@components/WxDrawer/WxDrawerHeader";
import TextInput from "@components/TextInput";
import Switch from "@components/Switch";
import { ButtonLoader } from "services/utils/preloader.service";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const SliderDrawer = ({
	isOpen,
	handleFormClose,
	editedData,
	isEditForm,
	onSubmitting,
	isSaving,
	handleDelete,
}) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({});

	useEffect(() => {
		isEditForm ? reset({ ...editedData }) : reset({ isActive: true });
	}, [isEditForm, editedData, isOpen]);

	return (
		<WxDrawer show={isOpen} handleClose={handleFormClose}>
			<div className="manage_slider_sec">
				<WxDrawerHeader
					title={`${isEditForm ? "Edit" : "Add"} Slider`}
					onClickClose={handleFormClose}
				/>
				<form onSubmit={handleSubmit(onSubmitting)}>
					<WxDrawerBody>
						<div className="row">
							<div className="col-md-12">
								<TextInput
									isRequired
									label="Title"
									isAutoFocus
									registerProperty={{
										...register("title", { required: true }),
									}}
									errorMessage={errors?.title && "Slider title is required!"}
									color={errors.title ? "danger" : "secondary"}
								/>
							</div>

							<div className="mb-4" style={{ maxWidth: "85%" }}>
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
					</WxDrawerBody>
					<WxDrawerFooter>
						<div className="delivery_create_sec__footer">
							<div className="d-flex align-items-center justify-content-between">
								<div>
									{isEditForm && (
										<Button
											variant="fill"
											type="button"
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
					</WxDrawerFooter>
				</form>
			</div>
		</WxDrawer>
	);
};
export default SliderDrawer;
