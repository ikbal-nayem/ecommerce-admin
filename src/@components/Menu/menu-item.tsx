import clsx from 'clsx';
import { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type IMenuItem = {
	children: ReactNode;
	onClick?: () => void;
	className?: string;
	linkTo?: string;
};

const MenuItem: FC<IMenuItem> = ({ children, className, onClick, linkTo }) => {
	return (
		<li>
			{linkTo ? (
				<Link className={clsx('dropdown-item py-1', { [className]: !!className })} to={linkTo}>
					{children}
				</Link>
			) : (
				<a className={clsx('dropdown-item py-1', { [className]: !!className })} onClick={onClick}>
					{children}
				</a>
			)}
		</li>
	);
};

export { MenuItem };
