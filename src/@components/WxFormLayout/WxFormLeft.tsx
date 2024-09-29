import React from "react";

type IFormLeftProps = {
  children?: JSX.Element | JSX.Element[];
};

const WxFormLeft = ({ children }: IFormLeftProps) => {
  return <div className="content_left">{children}</div>;
};

export default WxFormLeft;
