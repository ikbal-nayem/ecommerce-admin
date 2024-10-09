import React from "react";
import "./Modal.scss";

type ModalSizeType = "sm" | "md" | "lg";

type ModalProps = {
	children: JSX.Element | JSX.Element[] | string;
	show: boolean;
	handleClose?: Function;
	size?: ModalSizeType;
	isScrollable?: boolean;
};

export default class WxModal extends React.Component<ModalProps> {
  render() {
    if (!this.props.show) return null;

    let backdrop = null;
    backdrop = this.props.handleClose ? (
			<div
				className="wx__modal_backdrop"
				onClick={() => this.props.handleClose()}
			/>
		) : (
			<div className="wx__modal_backdrop " />
		);

    let size = this.props.size || "md";

    return (
      <>
        <div className={`wx__modal wx__modal_${size} `}>
          {this.props.children}
        </div>
        {backdrop}
      </>
    );
  }
}
