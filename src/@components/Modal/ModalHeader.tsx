import { IconButton } from '@components/Button';

type ModalHeaderProps = {
	title: string;
	onClickClose?: () => void;
	className?: string;
};

const ModalHeader = ({ title, onClickClose, className }: ModalHeaderProps) => {
	return (
		<div className={`wx__modal__header ${className}`}>
			<h5 className='text_h5 text_semibold mb-0'>{title}</h5>
			{onClickClose ? <IconButton iconName='close' onClick={onClickClose} /> : null}
		</div>
	);
};

export default ModalHeader;
