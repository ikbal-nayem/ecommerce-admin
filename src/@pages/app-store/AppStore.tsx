import { WxFormHeader } from "@components/WxFormLayout";
import { ENV } from "config/ENV.config";
import Preloader from "services/utils/preloader.service";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const AppStore = () => {
	const [iframeHeight, setIframeHeight] = useState(window.innerHeight - 150);
	const [isLoading, setIsLoading] = useState(true);
	const { appId } = useParams();
	const { accessToken } = useSelector((state: any) => state.user);

	// const getIframeHeight = (event) => {
	// 	setIframeHeight(window.innerHeight - 200);
	// 	// const { contentWindow } = event.target;
	// 	// const height = contentWindow.document.body.scrollHeight;
	// 	// setIframeHeight(height);
	// };

	return (
		<>
			<WxFormHeader title="App Configuration" />
			<div className="wx__mt-3 wx__h-100">
				{isLoading ? <Preloader absolutePosition /> : null}
				<iframe
					id="app-settings-iframe"
					onLoad={() => setIsLoading(false)}
					// onLoad={getIframeHeight}
					src={`${ENV.AppURL}?appId=${appId}&token=${accessToken}&routing=settigns`}
					frameBorder="0"
					width="100%"
					height={iframeHeight}
					allowFullScreen
				/>
			</div>
		</>
	);
};

export default AppStore;
