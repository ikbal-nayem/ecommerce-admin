import Label from '@components/WxLabel';
import clsx from 'clsx';
import { memo } from 'react';

type valuesKey = 'id' | 'text' | 'object' | any;

interface SelectProps {
	id?: any;
	defaultValue?: string;
	value?: any;
	placeholder?: string;
	label?: string | JSX.Element;
	options: any[];
	onChange?: Function;
	isRequired?: boolean;
	noMargin?: boolean;
	isDisabled?: boolean;
	registerProperty?: any;
	valuesKey?: valuesKey;
	textKey?: string;
	style?: any;
	errorMessage?: any;
	color?: any;
}

const Select = ({
	id,
	label,
	defaultValue,
	value,
	placeholder,
	options,
	onChange,
	isRequired,
	noMargin,
	registerProperty,
	valuesKey = 'object',
	textKey = 'text',
	style,
	isDisabled,
	errorMessage,
	color = 'secondary',
}: SelectProps) => {
	return (
		<div className={clsx('form_group', { 'm-0': noMargin })} aria-disabled={isDisabled ? 'true' : 'false'}>
			{label ? <Label isRequired={isRequired}>{label}</Label> : null}
			<select
				id={id}
				className={`form-select bg-white wx__input_${color} m-0`}
				style={{ ...style, padding: '0px 10px' }}
				defaultValue={defaultValue}
				value={value}
				onChange={onChange}
				disabled={isDisabled}
				role='button'
				{...registerProperty}
			>
				{placeholder ? <option value=''>{placeholder || 'Select ...'}</option> : null}

				{options?.map((option: any, index: number) => (
					<option
						value={valuesKey === 'object' ? JSON.stringify(options[index]) : option[valuesKey]}
						key={index}
						disabled={option?.disable}
					>
						{option[textKey]}
					</option>
				))}
			</select>
			{errorMessage ? (
				typeof errorMessage === 'string' ? (
					<span className={`note_text ${color === 'danger' && 'text-danger'}`}>{errorMessage}</span>
				) : (
					<>{errorMessage}</>
				)
			) : null}
		</div>
	);
};

export default memo(Select);
