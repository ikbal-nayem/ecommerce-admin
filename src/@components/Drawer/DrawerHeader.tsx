import { IconButton } from '@components/Button';

type DrawerHeaderProps = {
	title: string;
	onClickClose?: Function;
	backIconAction?: Function;
	// children: JSX.Element | JSX.Element[] | string;
};

const DrawerHeader = ({ title, onClickClose, backIconAction }: DrawerHeaderProps) => {
	return (
		<div className='wx__side_drawer__header'>
			<div className='d-flex align-items-center'>
				{backIconAction ? (
					<span className='material-icons-outlined me-2' role='button' onClick={() => backIconAction()}>
						arrow_back
					</span>
				) : null}
				<h5 className='text_h5 text_semibold mb-0'>{title}</h5>
			</div>
			{onClickClose ? <IconButton iconName='close' onClick={() => onClickClose()} /> : null}
		</div>
	);
};

export default DrawerHeader;
