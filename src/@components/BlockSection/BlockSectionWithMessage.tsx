import Icon from '@components/Icon';
import { IColors } from '@interfaces/common.interface';

type BlockSectionWithMessageProps = {
	children: React.ReactNode;
	isBlocked: boolean;
	message?: string;
	color?: IColors;
};

export const BlockSectionWithMessage = ({
	children,
	isBlocked,
	message,
	color = 'primary',
}: BlockSectionWithMessageProps) => {
	if (!isBlocked) return children;
	return (
		<div className='position-relative'>
			<div
				className={`position-absolute w-100 h-100 rounded bg-light-${color}`}
				style={{
					zIndex: 2,
					backdropFilter: 'blur(6px)',
					WebkitBackdropFilter: 'blur(6px)',
					background: 'rgb(175 175 175 / 34%)',
				}}
			>
				<div className='h-100 d-flex flex-column align-items-center justify-content-center'>
					<Icon icon='manufacturing' size={70} className='mb-5' color='primary' />
					<h2 className={`text-${color}`}>{message || 'This section is under maintanance!'}</h2>
				</div>
			</div>
			{children}
		</div>
	);
};
