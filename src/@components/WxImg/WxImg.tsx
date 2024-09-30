import clsx from 'clsx';
import { imageURLGenerate } from 'utils/utils';

interface IImg {
	src: string;
	alt: string;
	width?: string | number;
	height?: string | number;
	className?: string;
	onClick?: Function;
}

const WxImg = ({ src, alt, width, height, className, onClick }: IImg) => {
	const forBrokenImg = imageURLGenerate('/webx/NotFoundImage.jpeg');
	return (
		<img
			src={src}
			alt={alt}
			width={width}
			height={height}
			className={clsx(className)}
			onClick={() => onClick}
			onError={({ currentTarget }) => {
				currentTarget.onerror = null; // prevents looping
				currentTarget.src = forBrokenImg;
			}}
		/>
	);
};

export default WxImg;
