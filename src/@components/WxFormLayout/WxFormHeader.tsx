import React from "react";
import { useNavigate } from "react-router-dom";

type IFormHeaderProps = {
	backNavigationLink?: any;
	title: string;
	rightContent?: React.ReactNode | string;
	noBack?: boolean;
	noMargin?: boolean;
};

const WxFormHeader = ({
	backNavigationLink,
	title,
	rightContent,
	noBack,
	noMargin = false,
}: IFormHeaderProps) => {
	const navigate = useNavigate();

	const margin = noMargin ? "" : "wx__mb-3";

	return (
		<div
			className={`d-flex wx__align-items-center justify-content-between wx__text_strong ${margin}`}
		>
			<div className="d-flex wx__align-items-center">
				{noBack ? null : (
					<span
						className="material-icons-outlined wx__me-3"
						role="button"
						onClick={() => navigate(backNavigationLink || -1)}
					>
						arrow_back
					</span>
				)}
				<h4 className="wx__text_heading wx__h4__medium wx__mb-0">{title}</h4>
			</div>
			{rightContent}
		</div>
	);
};

export default WxFormHeader;
