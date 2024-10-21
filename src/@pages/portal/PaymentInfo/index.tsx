import { ConfirmationModal } from "@components/ConfirmationModal/ConfirmationModal";
import WxMainFull from "@components/MainContentLayout/WxMainFull";
import WxNotFound from "@components/NotFound/NotFound";
import {Button} from "@components/Button";
import { FormHeader } from "@components/FormLayout";
import { IPortalPaymentMedia } from "@interfaces/portal.interface";
import { ProfileService } from "services/api/settings/Profile.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useRef, useState } from "react";
import PaymentInfoForm from "./InfoForm";
import "./PaymentInfo.scss";
import PaymentMethodCard from "./PaymentMethodCard";

export default function PaymentInfo() {
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
	const [confirmationModal, setConfirmationModal] = useState<boolean>(false);
	const [paymentInfoList, setPaymentInfoList] = useState<IPortalPaymentMedia[]>(
		[]
	);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const updateItem = useRef<IPortalPaymentMedia>(null);
	const deleteItem = useRef<IPortalPaymentMedia>(null);

	useEffect(() => {
		getPaymentMethodList();
	}, []);

	const getPaymentMethodList = () => {
		ProfileService.getPaymentMethods()
			.then((resp) => setPaymentInfoList(resp.body))
			.finally(() => setIsLoading(false));
	};

	const onDrawerClose = () => {
		updateItem.current = null;
		setDrawerOpen(false);
	};

	const onUpdate = (uItem) => {
		updateItem.current = uItem;
		setDrawerOpen(true);
	};

	const onModify = (data: IPortalPaymentMedia) => {
		if (!updateItem.current) {
			setPaymentInfoList((prev) => [...prev, data]);
		} else {
			setPaymentInfoList((prev) => {
				prev[prev.findIndex((p) => p.id === data?.id)] = data;
				return prev;
			});
		}
		onDrawerClose();
	};

	// delete
	const onConfirmClose = () => {
		deleteItem.current = null;
		setConfirmationModal(false);
	};

	const onDelete = (item: IPortalPaymentMedia) => {
		deleteItem.current = item;
		setConfirmationModal(true);
	};

	const onConfirmDelete = () => {
		setIsDeleting(true);
		ProfileService.deletePaymentMethod(deleteItem.current?.id)
			.then((resp) => {
				ToastService.success(resp.message);
				getPaymentMethodList();
				onConfirmClose();
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsDeleting(false));
	};

	return (
		<WxMainFull>
			<FormHeader
				title="Payment info"
				noBack
				rightContent={
					<Button variant="fill" onClick={() => setDrawerOpen(true)}>
						Add Payment Method
					</Button>
				}
			/>
			{isLoading ? (
				<Preloader />
			) : paymentInfoList?.length ? (
				<div className="row">
					{paymentInfoList?.map((info) => (
						<div className="col-xl-3 col-md-4 col-sm-6 col-12" key={info?.id}>
							<PaymentMethodCard
								info={info}
								onUpdate={onUpdate}
								onDelete={onDelete}
							/>
						</div>
					))}
				</div>
			) : (
				<WxNotFound title="No payment information found." />
			)}
			<PaymentInfoForm
				isDrawerOpen={drawerOpen}
				onModify={onModify}
				updateItem={updateItem.current}
				handleClose={onDrawerClose}
			/>
			<ConfirmationModal
				onConfirm={onConfirmDelete}
				isOpen={confirmationModal}
				onClose={onConfirmClose}
				isSubmitting={isDeleting}
				title="Delete Confirmation!"
				body={
					<p>
						Do you want to delete{" "}
						<b>{deleteItem.current?.paymentMedia?.title}</b>.
					</p>
				}
			/>
		</WxMainFull>
	);
}
