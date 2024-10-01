import "./WxCheckbox.scss";

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

const WxCheckbox = ({
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
			className={`${
				noMargin ? "" : "mb-3"
			} form-check form-check-inline d-flex align-items-center ${className}`}
		>
			<input
				id={id}
				className="form-check-input"
				type="checkbox"
				role="button"
				disabled={disabled}
				onChange={onChange}
				defaultChecked={defaultChecked}
				checked={checked}
				{...registerProperty}
			/>
			<label
				className="ms_2 form-check-label text_body"
				htmlFor={id}
			>
				{label}
			</label>
		</div>
	);
};

export default WxCheckbox;
