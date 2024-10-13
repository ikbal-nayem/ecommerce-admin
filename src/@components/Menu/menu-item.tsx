import clsx from 'clsx';
import { FC, ReactNode } from 'react';

type IMenuItem = {
	children: ReactNode;
	onClick?: () => void;
	className?: string;
};

const MenuItem: FC<IMenuItem> = ({ children, className, onClick }) => {
	return (
		<li>
			<a className={clsx('dropdown-item', { [className]: !!className })} onClick={onClick}>
				{children}
			</a>
		</li>
	);
};

export { MenuItem };
