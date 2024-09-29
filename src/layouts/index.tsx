import Header from "layouts/Header/Header";
import Sidebar from "layouts/Sidebar/Sidebar";
import { FC, Fragment, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SecondarySidebar from "./SecondarySidebar";
import "./Layout.scss";
import {
	customizationRouteList,
	downgradeRouteList,
	portalRouteList,
} from "./nav-links";
import {
	DOWNGRADE,
	PORTAL,
	THEME_CUSTOMIZATION,
} from "routes/path-name.route";
import { useSelector } from "react-redux";
import { PRICING_PLAN_KEY } from "config/constants";
import { addHours } from "utils/splitDate";

const Layout: FC = () => {
	const [toggleMenuFlag, setToggleMenuFlag] = useState<boolean>(false);
	const [menuIconFlag, setMenuIconFlag] = useState<boolean>(false);
	const [isSecondarysidebar, setIsSecondarySidebar] = useState<boolean>(false);
	const [routeList, setRouteList] = useState([]);
	const { pathname } = useLocation();

	const { user_data, activePlan } = useSelector((data: any) => data.user);

	const isThemeCustomization = pathname.includes(THEME_CUSTOMIZATION);
	const isDowngrade = pathname.includes(DOWNGRADE);
	const isPortal = pathname.includes(PORTAL);

	useEffect(() => {
		if (isThemeCustomization) {
			setIsSecondarySidebar(true);
			setRouteList(customizationRouteList);
		} else if (isPortal) {
			setIsSecondarySidebar(true);
			setRouteList(portalRouteList);
		} else if (isDowngrade) {
			setIsSecondarySidebar(true);
			setRouteList(downgradeRouteList);
		} else setIsSecondarySidebar(false);
	}, [pathname]);

	const onClickFun = (value) => {
		if (value === undefined) setToggleMenuFlag(!toggleMenuFlag);
		else {
			setToggleMenuFlag(false);
			setMenuIconFlag(false);
		}
	};

	return (
		<Fragment>
			<div className="top_bar">
				<Header
					onClickFun={onClickFun}
					menuIconFlag={menuIconFlag}
					setMenuIconFlag={setMenuIconFlag}
				/>
			</div>
			<div className={`s-layout ${toggleMenuFlag ? "show__full_nav" : ""}`}>
				{isSecondarysidebar ? (
					<SecondarySidebar
						routeList={routeList}
						onClickFun={onClickFun}
						isDowngrade={isDowngrade}
					/>
				) : (
					<Sidebar onClickFun={onClickFun} />
				)}

				<main className="s-layout__content wx__w-100">
					<div className="wx__app_wrapper">
						<div className="wx__app_inner">
							<Outlet />
							{activePlan?.key === PRICING_PLAN_KEY.PPB_BASIC &&
								addHours(48, user_data?.store_created_date) < new Date() && (
									<div style={{ marginTop: "52px" }}></div>
								)}
						</div>
					</div>
					<div id="dropdown__wrapper__sec"></div>
				</main>
			</div>
		</Fragment>
	);
};

export default Layout;
