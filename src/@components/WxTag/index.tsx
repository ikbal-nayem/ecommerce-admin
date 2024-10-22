import { IColors } from '@interfaces/common.interface';
import clsx from 'clsx';

type Types = 'button' | 'reset' | 'submit';

interface ITagProps {
	color?: IColors;
	label: string;
	type?: Types;
	className?: string;
	style?: object;
	onClick?: () => void;
}

const Tag = ({ label, className, color, type = 'button', style, onClick }: ITagProps) => {
	return (
		<button
			className={clsx(`wx__btn_tags rounded`, { [`bg-light-${color} text-${color}`]: !!color }, className)}
			type={type}
			style={style}
			onClick={onClick}
		>
			{label}
		</button>
	);
};

export default Tag;
