import WxButton from "@components/Button";
import WxIcon from "@components/Icon";
import { MASTER_META_KEY } from "config/constants";
import {
	DASHBOARD,
	DOWNGRADE_APPS,
	DOWNGRADE_PRODUCT_IMAGES,
	DOWNGRADE_PRODUCT_VARIANTS,
	DOWNGRADE_SITE_OPERATOR,
	DOWNGRADE_THEMES,
	PAYMENT,
} from "routes/path-name.route";
import { downgrade$ } from "@rxjs/downgrade.rx";
import { IDowngradeStatus } from "@rxjs/interfaces.rx";
import { PaymentService } from "services/api/Payment.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import {
	Link,
	useLocation,
	useNavigate,
	useSearchParams,
} from "react-router-dom";
import { statusColorMapping } from "utils/colorMap";
import { searchParamsToObject } from "utils/makeObject";
import "./SecondarySidebar.scss";

type ISecondarySidebar = {
	isDowngrade?: boolean;
	onClickFun: Function;
	routeList: any[];
};

const SecondarySidebar = ({
	onClickFun,
	routeList,
	isDowngrade,
}: ISecondarySidebar) => {
	const [downgradeStatus, setDowngradeStatus] = useState<IDowngradeStatus>(
		downgrade$.initState
	);
	// const [themeSection, setThemeSection] = useState<any>();
	const [isPurchesing, setIsPurchesing] = useState<boolean>(false);
	const { pathname } = useLocation();
	// const isThemeCustomization = pathname.includes(THEME_CUSTOMIZATION);
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const sParams: any = searchParamsToObject(searchParams);
	const paramStr = new URLSearchParams(sParams);

	// useEffect(() => {
	// 	if (!isThemeCustomization) return;
	// 	const subscription = themeConfig$.subscribe(setThemeSection);
	// 	themeConfig$.get();
	// 	return () => subscription.unsubscribe();
	// }, [isThemeCustomization]);

	useEffect(() => {
		if (!isDowngrade) return;
		const subscription = downgrade$.subscribe(setDowngradeStatus);
		downgrade$.setInfo(sParams.plan_id);
		return () => subscription.unsubscribe();
	}, []);

	const isDone = (path: string) => {
		switch (path) {
			case DOWNGRADE_SITE_OPERATOR:
				return downgradeStatus?.checks?.isStoreOperatorCheckPassed;
			case DOWNGRADE_PRODUCT_IMAGES:
				return downgradeStatus?.checks?.isProductImageCheckPassed;
			case DOWNGRADE_PRODUCT_VARIANTS:
				return downgradeStatus?.checks?.isProductVariationCheckPassed;
			case DOWNGRADE_THEMES:
				return downgradeStatus?.checks?.isThemeCheckPassed;
			case DOWNGRADE_APPS:
				return downgradeStatus?.checks?.isAppCheckPassed;
			default:
				return false;
		}
	};

	const onDowngrade = () => {
		setIsPurchesing(true);
		const reqData = {
			merchantPurchaseLine: [
				{
					serviceMetaKey: MASTER_META_KEY.WEBX_SERVICES_PRICING_PLAN,
					itemId: sParams.plan_id,
				},
			],
		};
		PaymentService.merchantPurchasePlan(reqData)
			.then((resp) => {
				ToastService.success(resp.message);
				navigate(PAYMENT + "?invoiceId=" + resp.body.invoiceId);
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsPurchesing(false));
	};

	return (
		<div className="customizer-menu-section">
			<div
				className="customize-menu-wrapper"
				onClick={() => onClickFun(false)}
			/>

			<div className="menu-top">
				<li>
					<Link to={DASHBOARD} onClick={() => onClickFun(false)}>
						<WxIcon icon="logout" />
						<span className="menu__text">Exit</span>
					</Link>
				</li>
			</div>
			<ul className="customizer-menu">
				{isDowngrade ? (
					<li className="switch-package">
						<span
							style={{
								backgroundColor: statusColorMapping(
									downgradeStatus?.plan?.title,
									"code"
								),
							}}
						>
							{downgradeStatus.isLoading ? (
								<Preloader size={21} />
							) : (
								downgradeStatus?.plan?.title
							)}
						</span>
					</li>
				) : null}
				{routeList?.map((item: any, index: number) => (
					<li key={index}>
						<Link
							to={item.link + "?" + paramStr}
							onClick={() => onClickFun(false)}
							className={pathname.includes(item.link) ? "selected" : ""}
						>
							<WxIcon icon={item?.icon} />
							<span className="menu__text">{item.label}</span>
						</Link>
						{isDowngrade ? (
							<div className="right-icon">
								{isDone(item?.link) ? (
									<WxIcon icon="done" color="success" />
								) : (
									<WxIcon icon="info" color="warning" variants="outlined" />
								)}
							</div>
						) : null}
					</li>
				))}

				{/* theme section customization */}
				{/* {themeSection?.isLoading && <Preloader />}
				{isThemeCustomization && <WxHr />}
				{themeSection?.sections?.map((item: any, index: number) => (
					<li key={index}>
						<Link
							to={THEME_CUSTOMIZATION_S({ section_key: item?.key })}
							onClick={() => onClickFun(false)}
							className={pathname.includes(item.link) ? "selected" : ""}
						>
							<WxIcon icon={item?.icon} />
							<span className="menu__text">{item.label}</span>
						</Link>
					</li>
				))} */}

				{isDowngrade ? (
					<div className="bottom-nav-item show-mobile-view-sm">
						<WxButton
							color="primary"
							variant="fill"
							w={100}
							disabled={!downgradeStatus?.isOverallPassed || isPurchesing}
							onClick={onDowngrade}
						>
							{isPurchesing ? <Preloader /> : "Downgrade"}
						</WxButton>
					</div>
				) : null}
			</ul>
			{isDowngrade ? (
				<div className="bottom-nav-item hide-mobile-view">
					<WxButton
						color="primary"
						variant="fill"
						w={100}
						disabled={!downgradeStatus?.isOverallPassed || isPurchesing}
						onClick={onDowngrade}
					>
						{isPurchesing ? <Preloader /> : "Downgrade"}
					</WxButton>
				</div>
			) : null}
		</div>
	);
};
export default SecondarySidebar;
