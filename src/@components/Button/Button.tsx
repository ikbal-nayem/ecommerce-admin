import clsx from 'clsx';
import React from 'react';

type Sizes = 'sm' | 'lg' | 'default';
type Colors = 'primary' | 'secondary' | 'danger';
type Variants = 'fill' | 'outline' | 'none';
type Types = 'button' | 'reset' | 'submit';
type W = 25 | 50 | 75 | 100;

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	color?: Colors;
	size?: Sizes;
	variant?: Variants;
	className?: string;
	children: any;
	style?: object;
	width?: W;
	type?: Types;
	isLoading?: boolean;
	loadingText?: string;
}

const Button = ({
	color = 'primary',
	size = 'default',
	variant = 'none',
	className,
	style,
	children,
	width,
	type = 'button',
	isLoading,
	loadingText,
	...rest
}: IButtonProps) => {
	return (
		<button
			className={clsx(
				'd-flex justify-content-center align-items-center',
				{ [`w-${width}`]: !!width, wx__btn: size === 'default', [`wx__btn_${size}`]: size !== 'default' },
				`${
					variant === 'none'
						? `wx__btn_${color}_outline_none`
						: variant === 'outline'
						? `wx__btn_${color}_outline`
						: `wx__btn_${color}`
				}`,
				className
			)}
			style={style}
			type={type}
			disabled={isLoading || rest.disabled}
			{...rest}
		>
			{isLoading ? (
				<>
					{loadingText || 'Processing'}
					<span className='button-loader'></span>
				</>
			) : (
				children
			)}
		</button>
	);
};

export default Button;
