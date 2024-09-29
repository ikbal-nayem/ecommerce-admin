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
      <div className="wx__d-flex wx__align-items-center">
        {backIconAction ? (
          <span
            className="material-icons-outlined wx__me-2"
            role="button"
            onClick={() => backIconAction()}
          >
            arrow_back
          </span>
        ) : null}
        <h5 className="wx__text_h5 wx__text_semibold wx__mb-0">{title}</h5>
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
