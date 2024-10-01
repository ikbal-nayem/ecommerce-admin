import React from "react";
import { useNavigate } from "react-router-dom";

type IFormHeaderProps = {
  navigationLink?: string;
  title: string;
  rightContent?: React.ReactNode | string;
};

const  WxFormHeader = ({
  navigationLink,
  title,
  rightContent,
}: IFormHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="d-flex wx__align-items-center wx__mb-3 justify-content-between">
      <div className="d-flex wx__align-items-center">
        {navigationLink ? (
          <span
            className="material-icons-outlined"
            role="button"
            onClick={() => navigate(navigationLink)}
          >
            arrow_back
          </span>
        ) : null}
        <h4 className="wx__text_h4 wx__text_medium wx__mb-0 wx__ms-3">
          {title}
        </h4>
      </div>
      {rightContent}
    </div>
  );
};

export default WxFormHeader;
