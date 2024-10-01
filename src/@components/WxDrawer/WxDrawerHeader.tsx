import React from "react";

type DrawerHeaderProps = {
  title: string;
  closeIconAction?: Function;
  backIconAction?: Function;
  // children: JSX.Element | JSX.Element[] | string;
};

const WxDrawerHeader = ({
  title,
  closeIconAction,
  backIconAction,
}: DrawerHeaderProps) => {
  return (
    <div className="wx__side_drawer__header">
      <div className="d-flex align-items-center">
        {backIconAction ? (
          <span
            className="material-icons-outlined me-2"
            role="button"
            onClick={() => backIconAction()}
          >
            arrow_back
          </span>
        ) : null}
        <h5 className="text_h5 text_semibold mb-0">{title}</h5>
      </div>
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

export default WxDrawerHeader;
