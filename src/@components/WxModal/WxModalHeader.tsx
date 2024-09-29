import React from "react";

type ModalHeaderProps = {
	title: string;
	closeIconAction?: Function;
	className?: string;
};

const WxModalHeader = ({
	title,
	closeIconAction,
	className,
}: ModalHeaderProps) => {
	return (
		<div className={`wx__modal__header ${className}`}>
			<h5 className="wx__text_h5 wx__text_semibold wx__mb-0">{title}</h5>
			{closeIconAction ? (
				<span
					className="material-icons-outlined"
					role="button"
					onClick={() => closeIconAction()}
				>
					close
				</span>
			) : null}
		</div>
	);
};

export default WxModalHeader;
