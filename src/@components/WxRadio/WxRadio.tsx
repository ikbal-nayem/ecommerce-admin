import { memo, useEffect, useState } from "react";

interface IRadioButton {
  options?: any;
  id?: string;
  value?: string | number | boolean;
  name?: string;
  returnValue?: "label" | "id" | "object" | string;
  textKey?: string;
  label?: string | JSX.Element;
  checked?: number;
  className?: string;
  isChecked?: boolean;
  singleUse?: boolean;
  isRequired?: boolean;
  children?: any;
  registerProperty?: any;
  defaultChecked?: boolean;
  onClick?: (e?: any) => void;
  onChange?: (e?: any) => void;
  noMargin?: boolean;
  radioStyle?: "column" | "row";
}

const WxRadio = ({
  options,
  id,
  name,
  value,
  label,
  children,
  returnValue = "label",
  textKey = "label",
  checked = 0,
  isChecked,
  className,
  registerProperty,
  isRequired = false,
  singleUse = false,
  radioStyle = "column",
  defaultChecked = true,
  onClick,
  onChange,
  noMargin,
}: IRadioButton) => {
  const [selectedValue, setSelectedValue] = useState<
    string | number | boolean
  >();

  useEffect(() => {
    if (options) {
      setSelectedValue(options[checked][returnValue]);
    } else setSelectedValue(value);
  }, []);

  return (
    <div
      className={`d-flex align-item-center ${
        noMargin ? "" : "mb-3"
      } ${className ? className : ""}`}
      onClick={onClick}
    >
      {singleUse ? (
        <div className="form-check form-check-inline w-100">
          <input
            className="form-check-input"
            type="radio"
            name={name}
            id={id}
            value={value}
            onChange={onChange}
            checked={isChecked}
            role="button"
            {...registerProperty}
          />
          {label ? (
            <label
              className="form-check-label wx__text_small wx__radio_btn_label wx__text_medium "
              htmlFor={id}
              style={{ cursor: "pointer" }}
            >
              {label}
              {isRequired ? (
                <span style={{ color: "#f5222d", marginLeft: "5px" }}>*</span>
              ) : null}
            </label>
          ) : null}

          {children && selectedValue === value ? children : ""}
        </div>
      ) : (
        <div>
          {label ? (
            <label
              className="form-check-label wx__radio_btn_label   wx__text_semibold"
              style={{
                marginBottom: "4px",
                marginRight: "0px",
                fontSize: "0.813rem",
                fontWeight: 500,
              }}
            >
              {label}
              {isRequired ? (
                <span style={{ color: "#f5222d", marginLeft: "5px" }}>*</span>
              ) : null}
            </label>
          ) : null}
          <div className={`wx__d-flex wx__flex-${radioStyle}`}>
            {options?.map((item: any, index: number) => {
              return (
                <div
                  key={id + index}
                  className="form-check form-check-inline d-flex wx__align-item-center"
                >
                  <input
                    className="form-check-input"
                    type="radio"
                    name={name}
                    id={id + index}
                    value={
                      returnValue === "object"
                        ? JSON.stringify(item)
                        : item[returnValue]
                    }
                    disabled={Boolean(item.disable)}
                    onChange={(e: any) => {
                      onChange && onChange(e);
                    }}
                    {...registerProperty}
                    defaultChecked={defaultChecked && checked === index}
                    style={{ cursor: "pointer" }}
                  />
                  <label
                    className="form-check-label wx__text_body wx__text_medium wx__radio_btn_label wx__my-auto"
                    htmlFor={id + index}
                    style={{ cursor: "pointer" }}
                  >
                    {item[textKey]}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(WxRadio);
