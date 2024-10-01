import "./WxIcon.scss";

interface IWxIcon {
  icon: string;
  variants?: "outlined" | "filled" | "round" | "sharp" | "two-tone";
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "disabled";
  onClick?: any;
  className?: string;
  id?: string;
  role?: string;
  disabled?: boolean;
  hoverTitle?: string;
  style?: any;
  size?: number;
}

const WxIcon = ({
  icon,
  variants = "filled",
  color,
  onClick,
  className,
  id,
  role,
  disabled,
  hoverTitle,
  style,
  size,
}: IWxIcon) => (
  <span
    title={hoverTitle}
    onClick={onClick}
    className={`noselect ${
      variants === "filled" ? "material-icons" : `material-icons-${variants}`
    } wx__icon ${color ? "text-" + color : ""} ${
      disabled ? "wx__icon_disabled" : ""
    } ${className ? className : ""}`}
    id={id ? id : ""}
    role={role ? role : ""}
    style={{ fontSize: size || "1.1rem", ...style }}
  >
    {icon}
  </span>
);

export default WxIcon;
