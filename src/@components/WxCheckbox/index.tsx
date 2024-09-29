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
				noMargin ? "" : "wx__mb-3"
			} wx__form-check wx__form-check-inline wx__d-flex wx__align-items-center ${className}`}
		>
			<input
				id={id}
				className="wx__form-check-input"
				type="checkbox"
				role="button"
				disabled={disabled}
				onChange={onChange}
				defaultChecked={defaultChecked}
				checked={checked}
				{...registerProperty}
			/>
			<label
				className="wx__ms-2 wx__form-check-label wx__text_body"
				htmlFor={id}
			>
				{label}
			</label>
		</div>
	);
};

export default WxCheckbox;
