import WxImg from '@components/WxImg/WxImg';
import { DEFAULT_LINKS } from '@constants/common.constant';
import clsx from 'clsx';
import './Thumbnail.scss';

interface IProps {
	src?: string;
	name?: String;
	width?: number;
	height?: number;
	priority?: 'name' | 'image';
	noBorder?: boolean;
	className?: string;
}

const Thumbnail = ({ src, name, width, height, priority = 'image', noBorder = false, className }: IProps) => {
	var matches = name?.match(/\b(\w)/g);
	var acronym = matches?.join('').toUpperCase();

	return (
		<div className={clsx('thumbnail', { no_border: noBorder }, className)}>
			{priority === 'name' && name ? (
				<span>{acronym}</span>
			) : (
				priority === 'image' && (
					<WxImg width={width} height={height} src={src || DEFAULT_LINKS.blank_image} alt='img' />
				)
			)}
		</div>
	);
};

export default Thumbnail;
