import React from "react";

type IFormContentProps = {
  children?: JSX.Element | JSX.Element[];
};

const WxFormContent = ({ children }: IFormContentProps) => {
  return <div className="wx__form_container_content mt-4">{children}</div>;
};

export default WxFormContent;
