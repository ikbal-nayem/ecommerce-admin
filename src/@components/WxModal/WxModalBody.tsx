import React from "react";

type ModalBodyProps = {
  children: JSX.Element | JSX.Element[] | string;
};

const WxModalBody = ({ children }: ModalBodyProps) => {
  return <div className="wx__modal__body">{children}</div>;
};

export default WxModalBody;
