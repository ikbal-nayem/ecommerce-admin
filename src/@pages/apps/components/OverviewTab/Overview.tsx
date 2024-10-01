import WxImagePopup from '@components/WxImagePopup';
import './Overview.scss';

interface IOverview {
  description: string;
  screenshot:any;
}

const Overview = ({ description, screenshot }: IOverview) => {
  return (
		<div className="wx__overview">
			<p className="text_body text_regular">{description}</p>
			{screenshot ? (
				<div className="row pt-4">
					<h5 className="text_semibold">App Screenshots</h5>
					<WxImagePopup srcKey="previewUrl" imageList={screenshot} />
				</div>
			) : null}
		</div>
	);
};

export default Overview;
