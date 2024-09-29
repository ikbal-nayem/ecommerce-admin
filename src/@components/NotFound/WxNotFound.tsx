import WxButton from "@components/WxButton";
import { ReactComponent as NotFoundSVG } from "assets/svg/not_found.svg";
import { Link } from "react-router-dom";
import "./WxNotFound.scss";

interface INotFoundProps {
	title?: string;
	description?: string | JSX.Element;
	btn_text?: string;
	btn_link?: string;
}

const WxNotFound = ({
	title,
	description,
	btn_text,
	btn_link,
}: INotFoundProps) => {
	return (
		<div className="wx__w-100">
			{/* <div className="wx__d-flex wx__justify-content-center"> */}
			<div className="wx__card wx__not_found_component">
				<NotFoundSVG />
				<h2 className="wx__text_regular wx__text_h3">{title}</h2>
				<p className="wx__text_body wx__text_regular">{description}</p>
				{btn_link ? (
					<Link to={btn_link || ""}>
						<WxButton variant="fill">{btn_text}</WxButton>
					</Link>
				) : null}
			</div>
			{/* </div> */}
		</div>
	);
};

export default WxNotFound;
