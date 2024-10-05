import WxNotFound from "@components/NotFound/NotFound";
import {Button} from "@components/Button";
import { WxFormHeader } from "@components/WxFormLayout";
import WxIcon from "@components/Icon";
import WxTabs from "@components/WxTabs/WxTabs";
import WxThumbnail from "@components/Thumbnail";
import { IAppDetails, IAppInfo, IAppPricing } from "@interfaces/app.interface";
import {
	APPS,
	APPS_LIST,
	APP_FQA,
	APP_OVERVIEW,
	APP_REVIEW,
	APP_STORE,
	SETTINGS_PRICING_PLAN,
} from "routes/path-name.route";
import {
	AppsBillingService,
	AppsReleaseService,
	AppsService,
} from "services/api/Apps.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import starIcon from "assets/images/apps_img/star.png";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
	Link,
	Route,
	Routes,
	useLocation,
	useNavigate,
	useParams,
} from "react-router-dom";
import { imageURLGenerate } from "utils/utils";
import FAQTab from "../Faq/FAQTab";
import TabOverview from "../OverviewTab/Overview";
import PlanPricing from "../PlanPricing/PlanPricing";
import TabReview from "../ReviewTab/Review";
import "./AppDetails.scss";
import AppInfoAndSupport from "./AppInfoAndSupport";

const tabsData = [
	{ id: 1, label: "Overview" },
	{ id: 2, label: "Review" },
	{ id: 3, label: "FAQ" },
];

const AppsDetails = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isInstalling, setIsInstalling] = useState<boolean>(false);
	const [isInstalled, setIsInstalled] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);
	const [appDetails, setAppDetails] = useState<IAppDetails>();
	const [appInfo, setAppinfo] = useState<IAppInfo>();
	const [appPricing, setAppPricing] = useState<IAppPricing[]>();
	const navigate = useNavigate();
	const location = useLocation();

	const { activePlan } = useSelector((data: any) => data.user);

	let { id } = useParams();
	const routeList = [APP_OVERVIEW({ id }), APP_REVIEW({ id }), APP_FQA({ id })];

	const [activeTab, setActiveTab] = useState<number>(
		routeList.indexOf(location.pathname)
	);

	useEffect(() => {
		setActiveTab(routeList.indexOf(location.pathname));
	}, [location.pathname]);

	useEffect(() => {
		navigate(routeList[activeTab]);
	}, [activeTab]);

	useEffect(() => {
		if (id) {
			setIsLoading(true);
			setIsError(false);
			const checkIsInstalledReq = AppsService.checkIsInstalled(id);
			const appDetailsReq = AppsService.getAppById(id);
			const appInfoReq = AppsReleaseService.getById(id);
			const appPricingReq = AppsBillingService.get({
				body: { appId: id },
				meta: { offset: 0, limit: 3 },
			});
			Promise.all([
				checkIsInstalledReq,
				appDetailsReq,
				appInfoReq,
				appPricingReq,
			])
				.then(([checkIsInstalledReq, appDetails, appInfo, appPricing]) => {
					setIsInstalled(checkIsInstalledReq.body?.isInstalled);
					setAppDetails(appDetails.body);
					setAppinfo(appInfo.body);
					setAppPricing(appPricing.body);
				})
				.catch((err) => setIsError(true))
				.finally(() => setIsLoading(false));
		}
	}, [id]);

	const onInstallOrUninstall = () => {
		setIsInstalling(true);
		const req = isInstalled ? AppsService.uninstall : AppsService.install;
		req({ body: { appId: id } })
			.then((resp) => {
				ToastService.success(resp.message);
				setIsInstalled(resp?.body?.isInstalled);
				resp?.body?.isInstalled && navigate(APP_STORE({ appId: id }));
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsInstalling(false));
	};

	if (isError)
		return (
			<WxNotFound
				title="Oops !"
				description="Something went wrong while getting the app details. Please try again later."
			/>
		);

	const isLowerLevel = activePlan?.appLevel < appDetails?.packageLevel;

	return (
		<div className="wx__app_details_page">
			<WxFormHeader title="App Details" backNavigationLink={APPS_LIST} />
			<div className="card p-4 wx__details_top">
				{isLoading ? (
					<Preloader />
				) : (
					<div className="row">
						<div className="col-lg-5 col-md-12 col-sm-12 wx__details_top_left d-flex align-items-center">
							<div>
								<WxThumbnail
									src={imageURLGenerate(appDetails?.appIconPath)}
									noBorder
								/>
								<h2 className="mb-0 text_heading text_meduam">
									{appDetails?.appTitle}
								</h2>
								<p className="wx__tag_line">
									{appDetails?.tags ||
										"Find millions of dropship items to sell online"}
								</p>
								<p className="wx__user_review h6 pt-3 pb-3">
									<img className="icon_star" src={starIcon} alt="icon" />
									{appDetails?.avgRating}/5&nbsp;
									<span>({appDetails?.totalReview} Review)</span>
								</p>
								<div className="d-flex align-items-center mb-2 gap-2">
									{isInstalled ? (
										<Button
											variant="outline"
											color="danger"
											onClick={onInstallOrUninstall}
											disabled={isInstalling}
										>
											{isInstalling ? <Preloader /> : "Uninstall"}
										</Button>
									) : (
										<Button
											variant="fill"
											color="primary"
											onClick={onInstallOrUninstall}
											disabled={isInstalling || isLowerLevel}
										>
											{isInstalling ? <Preloader /> : "Install"}
										</Button>
									)}
									{isInstalled && (
										<Button
											variant="outline"
											color="primary"
											className="p-2"
											onClick={() => navigate(APP_STORE({ appId: id }))}
											disabled={isLowerLevel}
										>
											<WxIcon icon="settings" size={20} />
										</Button>
									)}
								</div>
								{!isInstalled && isLowerLevel ? (
									<small>
										<Link
											to={SETTINGS_PRICING_PLAN}
											className="text-decoration-none text-warning d-flex align-items-center gap-1"
										>
											<WxIcon
												icon="info"
												variants="outlined"
												color="warning"
												size={15}
											/>
											Please upgrade your plan to install the app.
										</Link>
									</small>
								) : (
									<div className="wx__validity_period">
										{appPricing?.length === 1 &&
										appPricing?.[0]?.firstPayAmount === 0 &&
										appPricing?.[0]?.recurringAmount === 0 ? (
											<p>Always Free</p>
										) : appPricing?.length &&
										  appPricing.some((item) => item.firstPayAmount === 0) ? (
											<p>Free Plan Available</p>
										) : (
											<p>
												** From {appPricing?.[0]?.currencyCode}&nbsp;
												{appPricing?.[0]?.recurringAmount}/
												{appPricing?.[0]?.billingCycleName}. Additional charges
												may apply.
											</p>
										)}
									</div>
								)}
							</div>
						</div>
						<div className="col-lg-7 col-md-12 col-sm-12 wx__details_top_right d-flex align-items-center justify-content-center">
							<div className="video_sec">
								<iframe
									src={appDetails?.videoLink}
									title={appDetails?.appTitle}
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								></iframe>
							</div>
						</div>
					</div>
				)}
			</div>
			<div className="row wx__details_mid">
				<div className="col-md-8 col-sm-12 mt-3 ">
					<div className="card wx__details_mid_left p-4">
						<WxTabs
							option={tabsData}
							labelKey="label"
							currentIndex={activeTab}
							setCurrentIndex={setActiveTab}
						/>
						<div className="pt-4">
							<Routes>
								<Route
									path="/overview"
									element={
										<TabOverview
											description={appDetails?.longDesc}
											screenshot={appDetails?.screenshots}
										/>
									}
								/>
								<Route path="/review" element={<TabReview appId={id} />} />
								<Route path="/faq" element={<FAQTab appId={id} />} />
							</Routes>
						</div>
					</div>
				</div>

				<div className="col-md-4 col-sm-12">
					<AppInfoAndSupport appInfo={appInfo} />
				</div>
			</div>

			{appPricing?.length ? (
				<div className="wx__plan_pricing mt-3 p-4 card">
					<h5 className="text_semibold mb-2">Plan & Pricing</h5>
					{/* <p className="text_body text_regular mb-4">
						This app offers a 30-day free trial
					</p> */}
					<PlanPricing PlanPricingData={appPricing} />
				</div>
			) : null}
		</div>
	);
};

export default AppsDetails;
