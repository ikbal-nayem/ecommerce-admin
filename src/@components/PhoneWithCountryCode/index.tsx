import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

type Colors = "primary" | "secondary" | "danger" | "warning" | "success";
// type W = 25 | 50 | 75 | 100;

interface IPhoneProps {
	defaultValue?: string | number;
	value?: string | number;
	color?: Colors;
	className?: string;
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
	onChange?: Function;
	onBlur?: Function;
	noMargin?: boolean;
	isDisabled?: boolean;
	min?: number;
	max?: number;
	phoneNumber?: string;
	setPhoneNumber?: any;
}

const PhoneNumberInput = ({
	color = "secondary",
	isRequired = false,
	label,
	placeholder,
	labelRight,
	startIcon,
	endIcon,
	helpText,
	errorMessage,
	isAutoFocus = false,
	noMargin,
	isDisabled,
	phoneNumber,
	setPhoneNumber,
}: IPhoneProps) => {
	return (
		<div
			className={`form_group ${noMargin ? "m-0" : ""}`}
			aria-disabled={isDisabled}
		>
			{label ? (
				typeof label === "string" ? (
					<label htmlFor="">
						{label} {isRequired && <span>*</span>}
					</label>
				) : (
					<>{label}</>
				)
			) : null}
			{labelRight && <div className="float-end">{labelRight}</div>}
			<div
				className={`wx__input_group_${color} ${
					!startIcon && !endIcon ? "p-0" : ""
				}`}
			>
				{startIcon ? startIcon : null}

				<PhoneInput
					style={{ width: "100%" }}
					defaultCountry="BD"
					// initialValueFormat="national"
					required={isRequired}
					autoFocus={isAutoFocus}
					placeholder={placeholder}
					value={phoneNumber}
					onChange={setPhoneNumber}
					limitMaxLength
				/>
				{endIcon ? endIcon : null}
			</div>
			{helpText ? (
				typeof helpText === "string" ? (
					<span
						className={`note_text ${color === "danger" && "text-danger"}`}
					>
						{helpText}
					</span>
				) : (
					<>{helpText}</>
				)
			) : null}

			{errorMessage ? (
				typeof errorMessage === "string" ? (
					<span
						className={`note_text ${color === "danger" && "text-danger"}`}
					>
						{errorMessage}
					</span>
				) : (
					<>{errorMessage}</>
				)
			) : null}
		</div>
	);
};

export default PhoneNumberInput;
