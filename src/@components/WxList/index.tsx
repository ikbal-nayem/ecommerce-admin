import React from "react";

type WxListProps = {
  children: JSX.Element | JSX.Element[]
}

const WxList = ({children}:WxListProps) => {
  return (
    <ul className="wx__list-group wx__list-group-flush">
      {children}
    </ul>
  );
};

export default WxList;
