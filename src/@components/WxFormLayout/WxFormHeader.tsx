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

	const margin = noMargin ? "" : "mb-3";

	return (
		<div
			className={`d-flex align-items-center justify-content-between text_strong ${margin}`}
		>
			<div className="d-flex align-items-center">
				{noBack ? null : (
					<span
						className="material-icons-outlined me-3"
						role="button"
						onClick={() => navigate(backNavigationLink || -1)}
					>
						arrow_back
					</span>
				)}
				<h4 className="text_heading wx__h4__medium mb-0">{title}</h4>
			</div>
			{rightContent}
		</div>
	);
};

export default WxFormHeader;
