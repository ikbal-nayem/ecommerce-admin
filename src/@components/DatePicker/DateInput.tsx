import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";

type Colors = "primary" | "secondary" | "danger" | "warning" | "success";
// type W = 25 | 50 | 75 | 100;

type isShow = "date" | "time";

interface IDatenTime {
  // types for styling & others
  color?: Colors;
  isRequired?: boolean;
  defaultValue?: string | number;
  label?: string | JSX.Element;
  labelRight?: JSX.Element | string;
  startIcon?: any;
  endIcon?: any;
  helpText?: JSX.Element | string;
  errorMessage?: JSX.Element | string;
  value?: string | number;
  className?: string;
  style?: object;
  type?: isShow;
  registerProperty?: any;
  isAutoFocus?: boolean;
  noMargin?: boolean;
  isDisabled?: boolean;
  // types for DatePicker date
  date?: any;
  setDate?: any;
  dateFormate?: string;
  placeholder?: string;
  selectsRange?: boolean;
  scrollableYearDropdown?: boolean;
  yearDropdownItemNumber?: number;
  // types for DatePicker time
  time?: any;
  setTime?: any;
  timeCaption?: string;
  timeFormate?: string;
  timeIntervals?: number;
  // props for both DatePicker date & time
  inline?: any;
  startDate?: any;
  endDate?: any;
  minDate?: any;
  maxDate?: any;
  // events types
  onChange?: Function;
  onBlur?: Function;
  onClick?: Function;
}

const DateInput = ({
  // props for styling
  color = "secondary",
  isRequired = false,
  label,
  labelRight,
  startIcon,
  endIcon,
  helpText,
  errorMessage,
  isAutoFocus = false,
  noMargin,
  isDisabled,
  className,
  type = "date",
  // props for DatePicker date
  date,
  setDate,
  dateFormate = "dd/MM/yyyy",
  placeholder,
  selectsRange = false,
  scrollableYearDropdown = true,
  yearDropdownItemNumber = 100,
  // props for DatePicker date
  time,
  setTime,
  timeCaption,
  timeFormate,
  timeIntervals,
  // props for both DatePicker date & time
  inline,
  startDate,
  endDate,
  minDate,
  maxDate,
  // events
  onClick,
  onBlur,
  onChange,
}: IDatenTime) => {
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
        }
        ${startIcon ? "icon-left" : endIcon ? "icon-right" : ""}`}
      >
        {startIcon ? startIcon : null}

        {type === "date" && (
          <DatePicker
            selected={date}
            startDate={startDate}
            endDate={endDate}
            onChange={(date: Date) => setDate(date)}
            onClick={onClick}
            dateFormat={dateFormate}
            placeholderText={placeholder}
            yearDropdownItemNumber={yearDropdownItemNumber}
            scrollableYearDropdown={scrollableYearDropdown}
            showYearDropdown
            minDate={minDate}
            maxDate={maxDate}
            selectsRange={selectsRange}
            inline={inline}
          />
        )}

        {type === "time" && (
          <DatePicker
            selected={time}
            onChange={(date) => setTime(date)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={timeIntervals}
            timeCaption={timeCaption}
            dateFormat={timeFormate}
            minDate={minDate}
            maxDate={maxDate}
            inline={inline}
          />
        )}

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

export default DateInput;
