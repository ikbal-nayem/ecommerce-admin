import { DEFAULT_LINKS } from '@constants/common.constant';
import clsx from 'clsx';

interface IImg {
	src: string;
	alt: string;
	width?: string | number;
	height?: string | number;
	className?: string;
	onClick?: Function;
}

const Img = ({ src, alt, width, height, className, onClick }: IImg) => {
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
				currentTarget.src = DEFAULT_LINKS.blank_image;
			}}
			loading='lazy'
		/>
	);
};

export default Img;
