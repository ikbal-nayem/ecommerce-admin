import { Button } from '@components/Button';
import Modal from '@components/Modal';
import ModalBody from '@components/Modal/ModalBody';
import ModalFooter from '@components/Modal/ModalFooter';
import ModalHeader from '@components/Modal/ModalHeader';
import { ReactNode } from 'react';

interface ConfirmationModalProps {
	title?: string;
	body?: string | ReactNode | ReactNode[];
	confirmType?: 'primary' | 'danger' | 'secondary';
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
	confirmType = 'danger',
	body,
	onClose,
	onConfirm,
	onConfirmLabel,
}: ConfirmationModalProps) => {
	return (
		<Modal show={isOpen} handleClose={onClose}>
			<ModalHeader
				title={title || 'Delete Confirmation'}
				onClickClose={() => (onClose ? onClose() : setIsOpen(false))}
			/>
			<ModalBody>
				{body || (
					<p className='text_body text_regular'>
						Are your sure you want to delete it? This action wont be reversible!
					</p>
				)}
			</ModalBody>
			<ModalFooter>
				<div className='d-flex justify-content-end'>
					<Button
						className='me-3'
						variant='outline'
						color='secondary'
						onClick={() => (onClose ? onClose() : setIsOpen(false))}
						disabled={isSubmitting}
					>
						Cancel
					</Button>
					{onConfirm ? (
						<Button variant='fill' color={confirmType} onClick={() => onConfirm()} isLoading={isSubmitting}>
							{onConfirmLabel || 'Yes, Delete It'}
						</Button>
					) : null}
				</div>
			</ModalFooter>
		</Modal>
	);
};
