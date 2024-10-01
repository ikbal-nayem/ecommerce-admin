import WxMainXl from "@components/MainContentLayout/WxMainXl";
import WxButton from "@components/WxButton";
import { IAppDetails, IInstalledApp } from "@interfaces/app.interface";
import { APPS_LIST } from "routes/path-name.route";
import { AppsService } from "services/api/Apps.service";
import Preloader from "services/utils/preloader.service";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Apps.scss";
import InstallApp from "./components/InstallApps/InstallApps";
import SuggestedApp from "./components/SuggestedApps/Suggested";

const Apps = () => {
	const navigate = useNavigate();
	const [isInstalledLoading, setInstalledLoading] = useState<boolean>(true);
	const [isSuggestedLoading, setSuggestedLoading] = useState<boolean>(true);
	const [suggestedAppData, setSuggestedAppData] = useState<IAppDetails[]>();
	const [installedApp, setInstalledApp] = useState<IInstalledApp[]>();

	const { activePlan } = useSelector((data: any) => data.user);

	useEffect(() => {
		getInstalled();
		getSuggested();
	}, []);

	const getInstalled = () => {
		setInstalledLoading(true);
		AppsService.getInstalledApp()
			.then((res) => setInstalledApp(res.body))
			.finally(() => setInstalledLoading(false));
	};

	const getSuggested = () => {
		setSuggestedLoading(true);
		AppsService.get({
			body: { packageLevel: activePlan?.level },
			meta: {
				offset: 0,
				limit: 6,
			},
		})
			.then((res) => setSuggestedAppData(res?.body))
			.finally(() => setSuggestedLoading(false));
	};

	return (
		<WxMainXl className="wx__apps-page">
			<div className="d-flex wx__justify-content-between wx__align-items-center">
				<h4 className="wx__text_heading  mb-0">Apps</h4>
				<WxButton variant="fill">Visit Store</WxButton>
			</div>

			<div className="card wx__p-4 wx__mt-3 wx__install-app">
				<h6 className="wx__text_body wx__text_medium wx__subtitle-1 wx__mb-2">
					Installed Apps
				</h6>
				{isInstalledLoading ? (
					<Preloader />
				) : installedApp?.length ? (
					<InstallApp installAppsData={installedApp} />
				) : (
					<h6 className="wx__text-center wx__text-muted">
						No installed app found
					</h6>
				)}
			</div>

			<div className="card wx__p-4 wx__mt-3 wx__suggested_app">
				<div className="d-flex wx__justify-content-between wx__align-items-center">
					<h6 className="wx__text_body wx__text_medium wx__mb-2 wx__subtitle-1">
						Recommended For You
					</h6>
					<WxButton
						variant="fill"
						size="sm"
						className="rounded"
						onClick={() => navigate(APPS_LIST)}
					>
						Get More Apps
					</WxButton>
				</div>

				<div className="wx__suggested_product">
					{isSuggestedLoading ? (
						<Preloader />
					) : suggestedAppData?.length ? (
						<SuggestedApp
							appListData={suggestedAppData}
							installedApps={installedApp}
						/>
					) : (
						<h6 className="wx__text-center wx__text-muted">Nothing to show</h6>
					)}
				</div>
			</div>
		</WxMainXl>
	);
};

export default Apps;
