import WxDropdown from "@components/WxDropdown/WxDropdown";
import WxIcon from "@components/WxIcon/WxIcon";
import WxTag from "@components/WxTag";
import WxThumbnail from "@components/WxThumbnail/WxThumbnail";
import { IInstalledApp } from "@interfaces/app.interface";
import { APP_OVERVIEW, APP_STORE } from "routes/path-name.route";
import { useState } from "react";
import { Link } from "react-router-dom";
import { imageURLGenerate } from "utils/utils";
import "./InstallApps.scss";
interface IIinstallAppsProps {
	installAppsData: IInstalledApp[];
}

const InstallApp = ({ installAppsData }: IIinstallAppsProps) => {
	const [selectedIndex, setSelectedIndex] = useState<number>(0);
	const [showPopup, setShowPopup] = useState<boolean>(false);

	const onShowPopup = (index: number) => {
		if (selectedIndex === index) {
			setSelectedIndex(0);
			setShowPopup(!showPopup);
			return;
		}
		setSelectedIndex(index);
		setShowPopup(!showPopup);
	};

	return (
		<div className="install-app-conponent">
			{installAppsData?.map((item, index) => (
				<div key={index} className="wx__single-app">
					<Link to={APP_STORE({ appId: item?.appId })}>
						<div className="wx__left d-flex align-items-center gap-3">
							<WxThumbnail
								src={imageURLGenerate(item?.appRegisterDTO?.appIconPath)}
								noBorder
							/>
							<span className="text_subtitle text_semibold">
								{item?.appRegisterDTO?.appTitle} <br />
								<small className="text-muted">
									{item?.appRegisterDTO?.shortDesc}
								</small>
							</span>
							{!item?.isActive ? (
								<WxTag label="Inactive" className="ms-3" />
							) : null}
						</div>
					</Link>
					<div className="ms-auto me-2">
						<WxIcon
							onClick={() => onShowPopup(index)}
							id="triggerId"
							icon="more_vert"
						/>
						{selectedIndex === index && (
							<WxDropdown isOpen={showPopup} setIsOpen={setShowPopup}>
								<ul>
									<li className="text_subtitle">
										<Link
											to={APP_OVERVIEW({ id: item?.appId })}
											className="text_body"
										>
											<WxIcon icon="preview" />
											Preview
										</Link>
									</li>
									<li className="text_subtitle">
										<Link
											to={APP_STORE({ appId: item?.appId })}
											className="text_body"
										>
											<WxIcon icon="settings" />
											Configure
										</Link>
									</li>
								</ul>
							</WxDropdown>
						)}
					</div>
				</div>
			))}
		</div>
	);
};

export default InstallApp;
