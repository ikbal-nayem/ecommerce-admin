import { imageURLGenerate } from "utils/utils";

interface IWxImg {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  onClick?: Function;
}

const WxImg = ({ src, alt, width, height, className, onClick }: IWxImg) => {
  const forBrokenImg = imageURLGenerate("/webx/NotFoundImage.jpeg");
  return (
		<img
			src={src}
			alt={alt}
			width={width}
			height={height}
			className={className ? className : ""}
			onClick={() => onClick}
			onError={({ currentTarget }) => {
				currentTarget.onerror = null; // prevents looping
				currentTarget.src = forBrokenImg;
			}}
		/>
	);
};

export default WxImg;
