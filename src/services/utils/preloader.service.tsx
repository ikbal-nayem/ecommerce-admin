import { ImpulseSpinner, MetroSpinner } from "react-spinners-kit";

interface IPreloaderProps {
	size?: number;
	color?: string;
	frontColor?: string;
	backColor?: string;
	absolutePosition?: boolean;
	className?: string;
}

const Preloader = ({
	size = 30,
	color = "#26a11c",
	absolutePosition = false,
	className,
}: IPreloaderProps) => {
	return (
		<div
			className={`wx__d-flex wx__align-items-center wx__justify-content-center ${
				className || ""
			}`}
			style={absolutePosition ? { position: "relative" } : {}}
		>
			<div
				style={
					absolutePosition ? { position: "absolute", zIndex: 1, top: 0 } : {}
				}
			>
				<MetroSpinner size={size} color={color} />
			</div>
		</div>
	);
};

export default Preloader;

export const ButtonLoader = ({
	size = 30,
	color = "#26a11c",
	frontColor = "#383838",
	backColor = "#8b8b8b",
	absolutePosition = false,
	className,
}: IPreloaderProps) => (
	<div
		className={`wx__d-flex wx__align-items-center wx__justify-content-center ${
			className || ""
		}`}
		style={absolutePosition ? { position: "relative" } : {}}
	>
		<div
			style={
				absolutePosition ? { position: "absolute", zIndex: 1, top: 0 } : {}
			}
		>
			<ImpulseSpinner
				size={size}
				frontColor={frontColor}
				backColor={backColor}
			/>
		</div>
	</div>
);
