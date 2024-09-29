import "./WxSwitch.scss";

interface ISwithProps {
  label?: string | JSX.Element;
  checkedTitle?: string;
  unCheckedTitle?: string;
  className?: string;
  registerProperty?: any;
  defaultChecked?: boolean;
  disabled?: boolean;
  isChecked?: boolean;
  onChange?: Function;
}

function WxSwitch({
  label,
  checkedTitle,
  unCheckedTitle,
  registerProperty,
  defaultChecked,
  disabled = false,
  isChecked,
  onChange,
  className,
}: ISwithProps) {
  return (
    <div
      className={`wx__switch_component wx__d-flex wx__justify-content-between wx__align-items-center ${
        className ? className : null
      }`}
    >
      {label &&
        (typeof label === "string" ? (
          <label className={`${disabled ? "disabled" : ""}`}>{label}</label>
        ) : (
          <>{label}</>
        ))}
      <div className="form-switch">
        <input
          disabled={disabled}
          className="form-check-input"
          type="checkbox"
          checked-value={checkedTitle}
          unchecked-value={unCheckedTitle}
          defaultChecked={defaultChecked}
          checked={isChecked}
          onChange={onChange}
          {...registerProperty}
        />
      </div>
    </div>
  );
}

export default WxSwitch;
