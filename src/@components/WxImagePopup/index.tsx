import WxButton from "@components/WxButton";
import WxIcon from "@components/WxIcon/WxIcon";
import { useState } from "react";
import { imageURLGenerate } from "utils/utils";
import "./WxImagePopup.scss";

interface IWxImagePopup {
	srcKey: string;
	imageList: any[];
}

const WxImagePopup = ({ srcKey, imageList }: IWxImagePopup) => {
	const [imagePopup, setImagePopup] = useState<number>(-1);

	const setImagePopupFun = (value) => {
		if (imagePopup + value < 0) setImagePopup(imageList.length - 1);
		else if (imagePopup + value > imageList.length - 1) setImagePopup(0);
		else setImagePopup(imagePopup + value);
	};

	return (
		<section className="wx__image_popup">
			<div className="row">
				{imageList?.map((item, index) => (
					<div
						className="col-lg-4 col-md-6 col-sm-12 wx__mb-3 image_gallery"
						key={index}
					>
						<img
							className="w-100"
							src={imageURLGenerate(item?.[srcKey])}
							alt="app screenshot"
							onClick={() => setImagePopup(index)}
						/>
					</div>
				))}
			</div>
			{imagePopup < 0 ? null : (
				<div className="wx__popup_container">
					<div className="popup_header">
						<WxButton
							variant="none"
							size="lg"
							onClick={() => setImagePopup(-1)}
						>
							<WxIcon variants="round" icon="close" className="close_icon" />
						</WxButton>
					</div>
					<div className="popup_content">
						<WxButton
							variant="none"
							size="lg"
							className="arrow__left"
							onClick={() => setImagePopupFun(-1)}
						>
							<WxIcon
								variants="round"
								icon="arrow_back_ios"
								className="arrow_icon"
							/>
						</WxButton>
						<div className="popup_gallery_content d-flex wx__justify-content-center wx__align-items-center">
							<img src={imageURLGenerate(imageList[imagePopup][srcKey])} />
						</div>
						<WxButton
							className="arrow__right"
							variant="none"
							size="lg"
							onClick={() => setImagePopupFun(1)}
						>
							<WxIcon
								variants="round"
								icon="arrow_forward_ios"
								className="arrow_icon"
							/>
						</WxButton>
						<button
							className="wx__close_sec"
							onClick={() => setImagePopup(-1)}
						/>
					</div>
				</div>
			)}
		</section>
	);
};

export default WxImagePopup;
