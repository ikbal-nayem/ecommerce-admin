import { ConfirmationModal } from "@components/ConfirmationModal/ConfirmationModal";
import {Button} from "@components/Button";
import WxDrawer from "@components/Drawer";
import WxDrawerFooter from "@components/Drawer/DrawerFooter";
import WxDrawerHeader from "@components/WxDrawer/WxDrawerHeader";
import {
	IVendorPayload,
	VendorService,
} from "services/api/products/Vendor.services";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import useDebounce from "utils/debouncer";
import VendorEditor from "../vendor-editor/VendorEditor";
import VendorList from "../vendor-list/VendorList";
import "./ManageVendor.scss";

type ManageVendorProps = {
	drawerOpen?: boolean;
	handleClose?: Function;
};

const ManageVendor = ({ drawerOpen, handleClose }: ManageVendorProps) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
	const [isEditorOpen, setIsEditorOpen] = useState(false);
	const [isEditForm, setIsEditForm] = useState(false);
	const [vendorList, setVendorList] = useState<IVendorPayload[]>();
	const [editData, setEditData] = useState<IVendorPayload>();
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [saving, setSaving] = useState<boolean>(false);
	const deleteItem = useRef(null);
	let search = useDebounce(searchQuery, 300);
	const { register, handleSubmit, setValue, reset } = useForm();

	const { user_data } = useSelector((value: any) => value.user);

	useEffect(() => {
		if (isEditForm) {
			setValue("id", editData?.id);
			setValue("name", editData?.name);
			setValue("isWebxUser", editData?.isWebxUser);
			setValue("storeId", editData?.storeId);
		}
	}, [isEditForm, editData]);

	useEffect(() => {
		drawerOpen && getVendorList();
	}, [drawerOpen]);

	useEffect(() => {
		search && getVendorList(search);
	}, [search]);

	const handleEditorClose = () => {
		reset();
		setEditData(null);
		setIsEditForm(false);
		setIsEditorOpen(false);
	};

	const handleEdit = (data: any) => {
		setEditData(data);
		setIsEditForm(true);
		setIsEditorOpen(true);
	};

	const getVendorList = (searchQuery: string = null) => {
		setIsLoading(true);
		const payload = {
			body: { name: searchQuery },
			meta: { offset: 0, limit: 20 },
		};
		VendorService.get(payload)
			.then((resp) => setVendorList(resp.body))
			.catch((error) => ToastService.error(error.message))
			.finally(() => setIsLoading(false));
	};

	const handleDelete = (item: IVendorPayload) => {
		deleteItem.current = item;
		setConfirmOpen(true);
	};

	const onConfirmClose = () => {
		deleteItem.current = null;
		setConfirmOpen(false);
	};

	const onDelete = () => {
		const { id } = deleteItem.current;
		VendorService.delete([id])
			.then((resp) => {
				ToastService.success(resp.message);
				getVendorList();
				handleEditorClose();
				onConfirmClose();
			})
			.catch((error) => ToastService.error(error.message));
	};

	const handleSave = (data: IVendorPayload) => {
		setSaving(true);
		if (isEditForm) {
			VendorService.update(data)
				.then((resp) => {
					getVendorList();
					ToastService.success(resp.message);
					handleEditorClose();
				})
				.catch((error) => ToastService.error(error.message))
				.finally(() => setSaving(false));
			return;
		}
		data.isWebxUser = true;
		VendorService.create(data)
			.then((resp) => {
				handleEditorClose();
				ToastService.success(resp.message);
				getVendorList();
			})
			.catch((error) => ToastService.error(error.message))
			.finally(() => setSaving(false));
	};

	return (
		<>
			<WxDrawer show={drawerOpen} handleClose={handleClose}>
				<div className="wx__manage_vendor">
					<WxDrawerHeader
						title={
							isEditorOpen
								? `${isEditForm ? "Edit" : "Add"} vendor`
								: "Manage Vendor"
						}
						backIconAction={isEditorOpen ? handleEditorClose : null}
						onClickClose={handleClose}
					/>
					<form noValidate onSubmit={handleSubmit(handleSave)}>
						{isEditorOpen ? (
							<VendorEditor registerProps={register} />
						) : (
							<VendorList
								isLoading={isLoading}
								handleEdit={handleEdit}
								vendorList={vendorList}
								setSearchQuery={setSearchQuery}
								handleDelete={handleDelete}
							/>
						)}

						<WxDrawerFooter>
							<div className="wx__manage_vendor__footer">
								{isEditForm ? (
									<div className="me-auto">
										<Button
											color="danger"
											variant="fill"
											disabled={saving}
											onClick={() => handleDelete(editData)}
										>
											Delete
										</Button>
									</div>
								) : null}
								<Button
									className="me-3"
									variant="outline"
									color="secondary"
									disabled={saving}
									onClick={() =>
										isEditorOpen ? handleEditorClose() : handleClose()
									}
								>
									Cancel
								</Button>
								<Button
									type={isEditorOpen ? "submit" : "button"}
									variant="fill"
									disabled={saving}
									onClick={() => (!isEditorOpen ? setIsEditorOpen(true) : null)}
								>
									{isEditorOpen ? "Save" : "Add Vendor"}
								</Button>
							</div>
						</WxDrawerFooter>
					</form>
				</div>
				<ConfirmationModal
					isOpen={confirmOpen}
					onClose={onConfirmClose}
					onConfirm={onDelete}
					body={`Are your sure you want to delete '${deleteItem.current?.name}'? This action wont be reverseable!`}
				/>
			</WxDrawer>
		</>
	);
};

export default ManageVendor;
