import "./WxInput.scss";

type Colors = "primary" | "secondary" | "danger" | "warning" | "success";
// type W = 25 | 50 | 75 | 100;

interface IInputProps {
  defaultValue?: string | number;
  value?: string | number;
  color?: Colors;
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
}

const WxInputNumber = ({
  color = "secondary",
  isRequired = false,
  label,
  className,
  id,
  placeholder,
  type = "text",
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
}: IInputProps) => {
  return (
    <div
      className={`form_group ${noMargin ? "m-0" : ""} ${
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
      {labelRight && <div className="float-end">{labelRight}</div>}
      <div
        className={`wx__input_group_${color} ${
          !startIcon && !endIcon ? "p-0" : ""
        } ${startIcon ? "icon-left" : endIcon ? "icon-right" : ""}`}
      >
        <div className="wx__table_cell_input_number_number">
          <input
            type="number"
            id={id}
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
            {...registerProperty}
            onBlur={onBlur}
          />
          <div className=" wx__plus_minus_btn">
            <span
              onClick={(e: any) =>
                e.target.parentNode.parentNode
                  .querySelector("input[type=number]")
                  .stepUp()
              }
              className="material-icons-round plus"
            >
              arrow_drop_up
            </span>
            <span
              onClick={(e: any) =>
                e.target.parentNode.parentNode
                  .querySelector("input[type=number]")
                  .stepDown()
              }
              className="material-icons-round minus"
            >
              arrow_drop_down
            </span>
          </div>
        </div>
        {/* {endIcon ? endIcon : null} */}
      </div>
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
      <br />
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
    </div>
  );
};

export default WxInputNumber;
