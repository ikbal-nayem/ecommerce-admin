import React from "react";

type DrawerFooterProps = {
  children: JSX.Element | JSX.Element[] | string;
};

const DrawerFooter = ({ children }: DrawerFooterProps) => {
  return <div className="wx__side_drawer__footer">{children}</div>;
};

export default DrawerFooter;
