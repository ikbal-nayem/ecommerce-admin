import React from "react";

type ModalFooterProps = {
	children: JSX.Element | JSX.Element[] | string;
	className?: string;
};

const WxModalFooter = ({ children, className }: ModalFooterProps) => {
	return <div className={`wx__modal__footer ${className}`}>{children}</div>;
};

export default WxModalFooter;
