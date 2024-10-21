import Icon from '@components/Icon';
import Label from '@components/Label';
import clsx from 'clsx';
import { useState } from 'react';
import './Input.scss';

type Colors = 'primary' | 'secondary' | 'danger' | 'warning' | 'success';
// type W = 25 | 50 | 75 | 100;

interface IInputProps {
	defaultValue?: string | number;
	value?: string | number;
	color?: Colors;
	helpTextColor?: Colors;
	className?: string;
	id?: string;
	style?: object;
	isRequired?: boolean;
	placeholder?: string;
	type?: string;
	startIcon?: any;
	endIcon?: any;
	helpText?: JSX.Element | string;
	errorMessage?: JSX.Element | string;
	label?: string | JSX.Element;
	labelRight?: JSX.Element | string;
	registerProperty?: any;
	isAutoFocus?: boolean;
	isReadOnly?: boolean;
	onChange?: Function;
	onBlur?: Function;
	onClick?: Function;
	onFocus?: Function;
	noMargin?: boolean;
	isDisabled?: boolean;
	min?: number;
	max?: number;
	maxLength?: number;
	tabIndex?: string | number;
	ref?: any;
	onKeyDown?: Function;
	onKeyPress?: Function;
	isError?: boolean;
}

const TextInput = ({
	color = 'secondary',
	helpTextColor = 'secondary',
	isRequired = false,
	label,
	className,
	id,
	placeholder,
	type = 'text',
	value,
	defaultValue,
	labelRight,
	startIcon,
	endIcon,
	helpText,
	errorMessage,
	registerProperty,
	isAutoFocus = false,
	onChange,
	onBlur,
	onClick,
	noMargin,
	isDisabled,
	min,
	max,
	maxLength,
	tabIndex,
	ref,
	onFocus,
	onKeyDown,
	isReadOnly,
	onKeyPress,
	isError,
}: IInputProps) => {
	const [inputType, setInputType] = useState<string>(type);
	const [toggleIcon, setToggleIcon] = useState<string>('visibility_off');

	const handleInputType = () => {
		if (inputType === 'password') {
			setInputType('text');
			setToggleIcon('visibility');
		} else {
			setInputType('password');
			setToggleIcon('visibility_off');
		}
	};

	color = isError ? 'danger' : color;

	return (
		<div
			className={clsx('form_group', { 'm-0': !!noMargin, 'mb-3': !noMargin }, className)}
			aria-disabled={isDisabled}
		>
			{label ? (
				typeof label === 'string' ? (
					<Label isRequired={isRequired}>{label}</Label>
				) : (
					<>{label}</>
				)
			) : null}
			{labelRight && <div className='float-end'>{labelRight}</div>}
			<div
				className={`wx__input_group_${color} ${!startIcon && !endIcon ? 'p-0' : ''} ${
					startIcon ? 'icon-left' : endIcon || type === 'password' ? 'icon-right' : ''
				}`}
			>
				{startIcon ? (
					typeof startIcon === 'string' ? (
						<span className='icon'>{startIcon}</span>
					) : (
						startIcon
					)
				) : null}
				<input
					className={`wx__input_${color}`}
					id={id}
					type={inputType}
					readOnly={isReadOnly}
					required={isRequired}
					autoFocus={isAutoFocus}
					onClick={onClick}
					onFocus={onFocus}
					placeholder={placeholder}
					defaultValue={defaultValue}
					value={value}
					min={min}
					max={max}
					maxLength={maxLength}
					ref={ref}
					tabIndex={tabIndex}
					onChange={onChange}
					onBlur={onBlur}
					onKeyDown={onKeyDown}
					onKeyPress={onKeyPress}
					onWheel={(e: any) => e.target.blur()}
					{...registerProperty}
				/>
				{type === 'password' ? (
					<Icon style={{ background: 'transparent' }} onClick={handleInputType} icon={toggleIcon} />
				) : endIcon ? (
					typeof endIcon === 'string' ? (
						<span className='icon'>{endIcon}</span>
					) : (
						endIcon
					)
				) : null}
			</div>
			{errorMessage ? (
				typeof errorMessage === 'string' ? (
					<span className={`note_text ${color === 'danger' && 'text-danger'}`}>{errorMessage}</span>
				) : (
					<>{errorMessage}</>
				)
			) : null}
			{helpText ? (
				typeof helpText === 'string' ? (
					<span className={`note_text ${helpTextColor === 'danger' && 'text-danger'}`}>{helpText}</span>
				) : (
					<>{helpText}</>
				)
			) : null}
		</div>
	);
};

export default TextInput;
