import "./WxTextarea.scss";

type Colors = "primary" | "secondary" | "danger" | "warning" | "success";
// type W = 25 | 50 | 75 | 100;

interface ITextareaProps {
	color?: Colors;
	className?: string;
	style?: object;
	isRequired?: boolean;
	placeholder?: string;
	type?: string;
	helpText?: JSX.Element | string;
	label?: string | JSX.Element;
	labelRight?: JSX.Element | string;
	registerProperty?: any;
	isAutoFocus?: boolean;
	onChange?: Function;
	noMargin?: boolean;
	rows?: number;
	maxLength?: number;
	errorMessage?: string;
}

const WxTextarea = ({
	color = "secondary",
	isRequired = false,
	label,
	placeholder,
	type,
	labelRight,
	helpText,
	registerProperty,
	isAutoFocus = false,
	onChange,
	noMargin,
	rows,
	maxLength,
	errorMessage,
}: ITextareaProps) => {
	return (
		<div className={`form_group ${noMargin ? "m-0" : ""}`}>
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
			<textarea
				className={`m-0 wx__input_${color}`}
				type={type}
				required={isRequired}
				autoFocus={isAutoFocus}
				onChange={onChange}
				placeholder={placeholder}
				maxLength={maxLength}
				rows={rows}
				spellCheck
				{...registerProperty}
			/>
			{errorMessage ? (
				typeof errorMessage === "string" ? (
					<span className={`note_text text-danger`}>{errorMessage}</span>
				) : (
					<>{errorMessage}</>
				)
			) : null}
			{helpText ? (
				typeof helpText === "string" ? (
					<span
						className={`note_text ${
							color === "danger" ? "text-danger" : ""
						}`}
					>
						{helpText}
					</span>
				) : (
					<>{helpText}</>
				)
			) : null}
		</div>
	);
};

export default WxTextarea;
