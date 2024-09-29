import "./Tag.scss";

type colors =
	| "default"
	| "primary"
	| "secondary"
	| "success"
	| "danger"
	| "warning"
	| "info";

type Types = "button" | "reset" | "submit";

interface ITagProps {
	color?: colors | string;
	label: string;
	type?: Types;
	className?: string;
	style?: object;
	onClick?: () => void;
}

const WxTag = ({
	label,
	className,
	color = "default",
	type = "button",
	style,
	onClick,
}: ITagProps) => {
	return (
		<button
			className={`wx__btn_tags wx__tag ${color === "default" ? "" : color} ${
				className ? className : ""
			}`}
			type={type}
			style={style}
			onClick={onClick}
		>
			{label}
		</button>
	);
};

export default WxTag;
