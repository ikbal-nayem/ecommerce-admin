import { IColors } from '@interfaces/common.interface';
import clsx from 'clsx';
import './Icon.scss';

interface IIcon {
	icon: string;
	variants?: 'outlined' | 'filled' | 'round' | 'sharp' | 'two-tone';
	color?: IColors;
	onClick?: any;
	className?: string;
	id?: string;
	role?: string;
	disabled?: boolean;
	hoverTitle?: string;
	style?: any;
	size?: number;
	rotate?: number;
}

const Icon = ({
	icon,
	variants = 'filled',
	color,
	onClick,
	className,
	id,
	role,
	disabled,
	hoverTitle,
	style,
	size,
	rotate,
}: IIcon) => (
	<span
		title={hoverTitle}
		onClick={onClick}
		className={clsx('noselect', 'material-symbols-rounded', 'icon', {
			[`text-${color}`]: !!color,
			icon_disabled: disabled,
			[className as string]: className,
		})}
		id={id ? id : ''}
		role={role}
		style={{ fontSize: size || '1.1rem', transform: `rotate(${rotate || 0}deg)`, ...style }}
	>
		{icon}
	</span>
);

export default Icon;
