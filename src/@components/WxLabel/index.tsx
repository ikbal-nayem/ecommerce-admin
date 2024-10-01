import "./label.scss";

interface ILabelProps {
  children?: string;
  isRequired?: boolean;
  labelRight?: JSX.Element | JSX.Element[] | string;
}

function WxLabel({ children, isRequired, labelRight }: ILabelProps) {
  return (
    <div className="wx__label">
      <label className="text_subtitle">
        {children} {isRequired && <span>*</span>}
      </label>
      {labelRight && <div className="float-end">{labelRight}</div>}
    </div>
  );
}

export default WxLabel;
