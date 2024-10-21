import React from "react";
import { useNavigate } from "react-router-dom";

type IFormHeaderProps = {
  navigationLink?: string;
  title: string;
  rightContent?: React.ReactNode | string;
};

const  FormHeader = ({
  navigationLink,
  title,
  rightContent,
}: IFormHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-center mb-3 justify-content-between">
      <div className="d-flex align-items-center">
        {navigationLink ? (
          <span
            className="material-icons-outlined"
            role="button"
            onClick={() => navigate(navigationLink)}
          >
            arrow_back
          </span>
        ) : null}
        <h4 className="text_h4 text_medium mb-0 ms-3">
          {title}
        </h4>
      </div>
      {rightContent}
    </div>
  );
};

export default FormHeader;
