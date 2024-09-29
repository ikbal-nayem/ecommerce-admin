import WxIcon from "@components/WxIcon/WxIcon";

type IAlertProps = {
	children: any;
	type?: "info" | "warning" | "danger" | "success";
	className?: string;
	noMargin?: boolean;
};

const WxAlert = ({
	children,
	className,
	type = "warning",
	noMargin = false,
}: IAlertProps) => {
	return (
		<div
			className={`wx__d-flex wx__align-items-center wx__gap-2 wx__alert wx__alert-${type} ${
				noMargin ? "wx__m-0" : ""
			} ${className}`}
		>
			<WxIcon icon="info" color={type} size={25} />
			<span>{children}</span>
		</div>
	);
};

export default WxAlert;
