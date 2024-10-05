import ClassNames from "classnames";
import React from "react";

type Sizes = "sm" | "lg" | "default";
type Colors = "primary" | "secondary" | "danger";
type Variants = "fill" | "outline" | "none";
type Types = "button" | "reset" | "submit";
type W = 25 | 50 | 75 | 100;

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: Colors;
  size?: Sizes;
  variant?: Variants;
  className?: string;
  children: any;
  style?: object;
  w?: W;
  type?: Types;
}

const Button = ({
  color = "primary",
  size = "default",
  variant = "none",
  className,
  style,
  children,
  w,
  type = "button",
  ...rest
}: IButtonProps) => {
  return (
    <button
      className={ClassNames(
        `d-flex justify-content-center align-items-center`,
        `${w ? "w-" + w : ""}`,
        `${size === "default" ? "wx__btn" : `wx__btn_${size}`}`,
        `${
          variant === "none"
            ? `wx__btn_${color}_outline_none`
            : variant === "outline"
            ? `wx__btn_${color}_outline`
            : `wx__btn_${color}`
        }`,
        className
      )}
      style={style}
      type={type}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
