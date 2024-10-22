import { ImpulseSpinner, MetroSpinner } from 'react-spinners-kit';

interface IPreloaderProps {
	size?: number;
	color?: string;
	frontColor?: string;
	backColor?: string;
	absolutePosition?: boolean;
	className?: string;
	show?: boolean;
	loaderText?: string;
}

const Preloader = ({
	size = 30,
	color = '#a938cf',
	absolutePosition = false,
	className,
	show = true,
	loaderText,
}: IPreloaderProps) => {
	if (!show) return;

	return (
		<div
			className={`d-flex align-items-center justify-content-center ${className || ''}`}
			style={absolutePosition ? { position: 'relative' } : {}}
		>
			<div
				className='d-flex align-items-center'
				style={absolutePosition ? { position: 'absolute', zIndex: 1, top: 0 } : {}}
			>
				<strong>{loaderText}</strong>&nbsp;&nbsp;
				<MetroSpinner size={size} color={color} />
			</div>
		</div>
	);
};

export default Preloader;

export const ButtonLoader = ({
	size = 30,
	color = '#26a11c',
	frontColor = '#383838',
	backColor = '#8b8b8b',
	absolutePosition = false,
	className,
}: IPreloaderProps) => (
	<div
		className={`d-flex align-items-center justify-content-center ${className || ''}`}
		style={absolutePosition ? { position: 'relative' } : {}}
	>
		<div style={absolutePosition ? { position: 'absolute', zIndex: 1, top: 0 } : {}}>
			<ImpulseSpinner size={size} frontColor={frontColor} backColor={backColor} />
		</div>
	</div>
);
