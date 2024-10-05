import clsx from 'clsx';
import './Icon.scss';

interface IIcon {
	icon: string;
	variants?: 'outlined' | 'filled' | 'round' | 'sharp' | 'two-tone';
	color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'disabled';
	onClick?: any;
	className?: string;
	id?: string;
	role?: string;
	disabled?: boolean;
	hoverTitle?: string;
	style?: any;
	size?: number;
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
		style={{ fontSize: size || '1.1rem', ...style }}
	>
		{icon}
	</span>
);

export default Icon;
