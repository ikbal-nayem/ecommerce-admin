import WxImg from '@components/WxImg/Img';
import clsx from 'clsx';
import './Thumbnail.scss';

interface IProps {
	src?: string;
	name?: String;
	width?: number;
	height?: number;
	noBorder?: boolean;
	className?: string;
	rounded?: boolean;
}

const Thumbnail = ({ src, name, width, height, noBorder = false, className, rounded }: IProps) => {
	var matches = name?.match(/\b(\w)/g);
	var acronym = matches?.join('')?.toUpperCase()?.slice(0, 2);

	return (
		<div className={clsx('thumbnail', { 'rounded-circle': rounded, no_border: noBorder }, className)}>
			{!!src ? <WxImg width={width} height={height} src={src} alt='img' /> : <span>{acronym}</span>}
		</div>
	);
};

export default Thumbnail;
