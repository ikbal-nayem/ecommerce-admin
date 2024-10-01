import React from "react";

type WxListProps = {
  children: JSX.Element | JSX.Element[]
}

const WxList = ({children}:WxListProps) => {
  return (
    <ul className="form_group form_group-flush">
      {children}
    </ul>
  );
};

export default WxList;
