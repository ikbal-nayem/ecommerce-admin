import WxButton from "@components/Button";
import WxModal from "@components/WxModal";
import WxModalBody from "@components/WxModal/WxModalBody";
import WxModalFooter from "@components/WxModal/WxModalFooter";
import WxModalHeader from "@components/WxModal/WxModalHeader";
import { ButtonLoader } from "services/utils/preloader.service";

interface ConfirmationModalProps {
	title?: string;
	body?: any;
	confirmType?: "primary" | "danger" | "secondary";
	onConfirm?: any;
	onConfirmLabel?: string;
	isOpen: boolean;
	setIsOpen?: (isOpen: boolean) => void;
	onClose?: () => void;
	isSubmitting?: boolean;
}

export const ConfirmationModal = ({
	isOpen,
	isSubmitting,
	setIsOpen,
	title,
	confirmType = "danger",
	body,
	onClose,
	onConfirm,
	onConfirmLabel,
}: ConfirmationModalProps) => {
	return (
		<WxModal show={isOpen} handleClose={onClose}>
			<WxModalHeader
				title={title || "Delete Confirmation"}
				closeIconAction={() => (onClose ? onClose() : setIsOpen(false))}
			/>
			<WxModalBody>
				{body ? (
					body
				) : (
					<p className="text_body text_regular">
						Are your sure you want to delete it? This action wont be reversible!
					</p>
				)}
			</WxModalBody>
			<WxModalFooter>
				<div className="d-flex justify-content-end">
					<WxButton
						className="me-3"
						variant="outline"
						color="secondary"
						onClick={() => (onClose ? onClose() : setIsOpen(false))}
						disabled={isSubmitting}
					>
						Cancel
					</WxButton>
					{onConfirm ? (
						<WxButton
							variant="fill"
							color={confirmType}
							onClick={() => onConfirm()}
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<ButtonLoader />
							) : (
								onConfirmLabel || "Yes Delete It"
							)}
						</WxButton>
					) : null}
				</div>
			</WxModalFooter>
		</WxModal>
	);
};
