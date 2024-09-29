import React from "react";
import "./Drawer.scss";

type DrawerProps = {
	children: JSX.Element | JSX.Element[] | string;
	show: boolean;
	handleClose?: Function;
};

export default ({ children, show, handleClose }: DrawerProps) => {
	if (!show) return null;
	let backdrop = null;
	backdrop = handleClose ? (
		<div className="wx__side_drawer_backdrop" onClick={() => handleClose()} />
	) : (
		<div className="wx__side_drawer_backdrop" />
	);

	return (
		<>
			<div className="wx__side_drawer">{children}</div>
			{backdrop}
		</>
	);
};
