import WxImagePopup from "@components/WxImagePopup";
import { IFilePayload } from "@interfaces/common.interface";
import "./Overview.scss";

interface IOverview {
	description: any;
	screenshot?: IFilePayload[];
}

const Overview = ({ description, screenshot }: IOverview) => {
	return (
		<div className="wx__overview">
			<p className="wx__text_body wx__text_regular">{description}</p>

			{screenshot ? (
				<>
					<h5 className="wx__text_semibold wx__my-4">App Screenshots</h5>
					<WxImagePopup srcKey="previewUrl" imageList={screenshot} />
				</>
			) : null}
		</div>
	);
};

export default Overview;
