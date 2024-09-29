import WxIcon from '@components/WxIcon/WxIcon';
import "./RatingProgressBar.scss";

interface IRatingProgressBar {
	star: number;
	progressWidth: number;
	review: number;
}

const RatingProgressBar = ({
	star,
	progressWidth,
	review,
}: IRatingProgressBar) => (
	<div className="wx__rating_progress wx__progress_5 wx__d-flex wx__align-items-center">
		<div className="wx__text_body wx__text_regular progress_left">
			<WxIcon className="small_icon" icon="star" variants="filled" />
			&nbsp;{star}
		</div>
		<div className="wx__bar_bg">
			<div className="wx__progress" style={{ width: `${progressWidth}%` }} />
		</div>
		<span className="wx__text_regular wx__text_small progress_right">
			{review} Reviews
		</span>
	</div>
);

export default RatingProgressBar;