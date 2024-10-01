import React, { useEffect, useState } from "react";
import WxButton from "@components/WxButton";
import WxModal from "@components/WxModal";
import WxModalBody from "@components/WxModal/WxModalBody";
import WxModalFooter from "@components/WxModal/WxModalFooter";
import WxModalHeader from "@components/WxModal/WxModalHeader";
import WxInput from "@components/WxInput";
import { OrderService } from "services/api/Order.service";
import { ToastService } from "services/utils/toastr.service";

interface EditNotesProps {
	orderId: string;
	defaultNote?: string;
	onOrderNoteUpdate?: any;
}

export const EditNotes = ({
	orderId,
	defaultNote,
	onOrderNoteUpdate,
}: EditNotesProps) => {
	const [open, setOpen] = React.useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
	const [note, setNote] = useState<string>(defaultNote || "");
	const [error, setError] = useState<boolean>(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!note) {
			setError(true);
			return;
		}
		setIsSubmitting(true);
		OrderService.updateOrderNote(orderId, { orderNote: note })
			.then((resp) => {
				setOpen(false);
				onOrderNoteUpdate(resp.body?.orderNote);
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsSubmitting(false));
		setError(false);
	};

	return (
		<>
			<span
				className="wx__text-primary wx__text_small"
				role="button"
				onClick={() => setOpen(true)}
			>
				Edit
			</span>
			<WxModal show={open}>
				<WxModalHeader
					title="Edit Notes"
					closeIconAction={() => setOpen(false)}
				/>
				<form onSubmit={handleSubmit} noValidate>
					<WxModalBody>
						<WxInput
							isRequired
							label="Order Notes"
							isAutoFocus
							value={note}
							onChange={(e) => setNote(e.target.value)}
							color={error ? "danger" : "secondary"}
							errorMessage={error ? "Please enter a note" : ""}
						/>
					</WxModalBody>
					<WxModalFooter>
						<div className="d-flex justify-content-end">
							<WxButton
								className="wx__me-3"
								variant="outline"
								color="secondary"
								onClick={() => setOpen(false)}
								disabled={isSubmitting}
							>
								Cancel
							</WxButton>
							<WxButton variant="fill" type="submit" disabled={isSubmitting}>
								Done
							</WxButton>
						</div>
					</WxModalFooter>
				</form>
			</WxModal>
		</>
	);
};
