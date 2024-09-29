import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  date?: string;
  setDate?: any;
}

const TimePicker = ({
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
  className,
  date,
  setDate,
}: IPhoneProps) => {
  return (
    <div
      className={`wx__form_group ${noMargin ? "wx__m-0" : ""} ${
        className ? className : ""
      }`}
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
      {labelRight && <div className="wx__float-end">{labelRight}</div>}
      <div
        className={`wx__input_group_${color} ${
          !startIcon && !endIcon ? "wx__p-0" : ""
        }`}
      >
        {startIcon ? startIcon : null}
        <DatePicker
          selected={date}
          onChange={(date: Date) => setDate(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText={placeholder}
          yearDropdownItemNumber={100}
          scrollableYearDropdown={true}
          showYearDropdown
          // showMonthDropdown
        />
        {endIcon ? endIcon : null}
      </div>
      {helpText ? (
        typeof helpText === "string" ? (
          <span
            className={`note_text ${color === "danger" && "wx__text-danger"}`}
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
            className={`note_text ${color === "danger" && "wx__text-danger"}`}
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

export default TimePicker;
