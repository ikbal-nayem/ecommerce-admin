import clsx from 'clsx';

type CheckboxProps = {
	id?: string;
	label?: JSX.Element | JSX.Element[] | string | any;
	checked?: boolean;
	defaultChecked?: boolean;
	onChange?: (e?: any) => void;
	onClick?: (e?: any) => void;
	registerProperty?: any;
	className?: string;
	disabled?: boolean;
	noMargin?: boolean;
};

const Checkbox = ({
	id,
	label,
	checked,
	defaultChecked,
	onChange,
	onClick,
	className,
	registerProperty,
	disabled,
	noMargin,
}: CheckboxProps) => {
	return (
		<div
			onClick={onClick}
			className={clsx(
				'form-check form-check-inline d-flex align-items-center',
				{
					'mb-3': !noMargin,
				},
				className
			)}
		>
			<input
				id={id}
				className='form-check-input'
				type='checkbox'
				role='button'
				disabled={disabled}
				onChange={onChange}
				defaultChecked={defaultChecked}
				checked={checked}
				{...registerProperty}
			/>
			<label className='ms-2 form-check-label' htmlFor={id}>
				{label}
			</label>
		</div>
	);
};

export default Checkbox;
