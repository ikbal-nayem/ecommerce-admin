import WxMainLg from "@components/MainContentLayout/WxMainLg";
import WxIcon from "@components/WxIcon/WxIcon";
import {
	SETTINGS_BILLING,
	SETTINGS_CHECKOUT,
	SETTINGS_DELIVERY,
	SETTINGS_DOMAIN,
	SETTINGS_GENERAL,
	SETTINGS_NOTIFICATION,
	SETTINGS_ORDER,
	SETTINGS_PAYMENT,
	SETTINGS_POLICIES,
	SETTINGS_PRICING_PLAN,
	SETTINGS_ROLES,
	SETTINGS_SITE_OPERATOR,
} from "routes/path-name.route";
import { Link } from "react-router-dom";
import "./Settings.scss";

const Setting = () => {
	return (
		<WxMainLg className="setting_page_section">
			<h4 className="wx__h4__medium mb-0">Settings</h4>
			<div className="wx__card wx__p-3 wx__d-flex wx__flex-row wx__flex-wrap wx__justify-content-center wx__mt-3">
				<Link to={SETTINGS_GENERAL}>
					<div className="setting_single_item wx__d-flex wx__flex-row wx__align-items-start">
						<WxIcon icon="space_dashboard" className="setting_link_icon" />
						<div className="right-sec">
							<h6 className="wx__text_heading wx__text_semibold wx__mb-0">
								General
							</h6>
							<p className="wx__text_small wx__text_regular">
								View and update your store details
							</p>
						</div>
					</div>
				</Link>
				<Link to={SETTINGS_PAYMENT}>
					<div className="setting_single_item wx__d-flex wx__flex-row wx__align-items-start">
						<WxIcon icon="payment" className="setting_link_icon" />
						<div className="right-sec">
							<h6 className="wx__text_heading wx__text_semibold wx__mb-0">
								Payment
							</h6>
							<div className="wx__text_small wx__text_regular">
								View and update your store details
							</div>
						</div>
					</div>
				</Link>
				<Link to={SETTINGS_BILLING}>
					<div className="setting_single_item wx__d-flex wx__flex-row wx__align-items-start">
						<WxIcon icon="travel_explore" className="setting_link_icon" />
						<div className="right-sec">
							<h6 className="wx__text_heading wx__text_semibold wx__mb-0">
								Billing
							</h6>
							<div className="wx__text_small wx__text_regular">
								View and update your store details
							</div>
						</div>
					</div>
				</Link>

				<Link to={SETTINGS_DOMAIN}>
					<div className="setting_single_item wx__d-flex wx__flex-row wx__align-items-start">
						<WxIcon icon="manage_accounts" className="setting_link_icon" />
						<div className="right-sec">
							<h6 className="wx__text_heading wx__text_semibold wx__mb-0">
								Manage Domain
							</h6>
							<div className="wx__text_small wx__text_regular">
								View and update your store details
							</div>
						</div>
					</div>
				</Link>
				<Link to={SETTINGS_DELIVERY}>
					<div className="setting_single_item wx__d-flex wx__flex-row wx__align-items-start">
						<WxIcon icon="local_shipping" className="setting_link_icon" />
						<div className="right-sec">
							<h6 className="wx__text_heading wx__text_semibold wx__mb-0">
								Delivery
							</h6>
							<div className="wx__text_small wx__text_regular">
								View and update your store details
							</div>
						</div>
					</div>
				</Link>
				<Link to={SETTINGS_ORDER}>
					<div className="setting_single_item wx__d-flex wx__flex-row wx__align-items-start">
						<WxIcon icon="receipt" className="setting_link_icon" />
						<div className="right-sec">
							<h6 className="wx__text_heading wx__text_semibold wx__mb-0">
								Order
							</h6>
							<div className="wx__text_small wx__text_regular">
								View and update your store details
							</div>
						</div>
					</div>
				</Link>

				<Link to={SETTINGS_NOTIFICATION}>
					<div className="setting_single_item wx__d-flex wx__flex-row wx__align-items-start">
						<WxIcon icon="notifications" className="setting_link_icon" />
						<div className="right-sec">
							<h6 className="wx__text_heading wx__text_semibold wx__mb-0">
								Notification
							</h6>
							<div className="wx__text_small wx__text_regular">
								View and update your store details
							</div>
						</div>
					</div>
				</Link>
				<Link to={SETTINGS_CHECKOUT}>
					<div className="setting_single_item wx__d-flex wx__flex-row wx__align-items-start">
						<WxIcon icon="shopping_cart" className="setting_link_icon" />
						<div className="right-sec">
							<h6 className="wx__text_heading wx__text_semibold wx__mb-0">
								Checkout
							</h6>
							<div className="wx__text_small wx__text_regular">
								View and update your store details
							</div>
						</div>
					</div>
				</Link>
				<Link to={SETTINGS_SITE_OPERATOR}>
					<div className="setting_single_item wx__d-flex wx__flex-row wx__align-items-start">
						<WxIcon icon="settings" className="setting_link_icon" />
						<div className="right-sec">
							<h6 className="wx__text_heading wx__text_semibold wx__mb-0">
								Site Operator
							</h6>
							<div className="wx__text_small wx__text_regular">
								View and update your store details
							</div>
						</div>
					</div>
				</Link>
				<Link to={SETTINGS_ROLES}>
					<div className="setting_single_item wx__d-flex wx__flex-row wx__align-items-start">
						<WxIcon icon="how_to_reg" className="setting_link_icon" />
						<div className="right-sec">
							<h6 className="wx__text_heading wx__text_semibold wx__mb-0">
								Roles
							</h6>
							<div className="wx__text_small wx__text_regular">
								View and update your store details
							</div>
						</div>
					</div>
				</Link>
				<Link to={SETTINGS_POLICIES}>
					<div className="setting_single_item wx__d-flex wx__flex-row wx__align-items-start">
						<WxIcon icon="gavel" className="setting_link_icon" />
						<div className="right-sec">
							<h6 className="wx__text_heading wx__text_semibold wx__mb-0">
								Policies
							</h6>
							<div className="wx__text_small wx__text_regular">
								View and update your store details
							</div>
						</div>
					</div>
				</Link>
				<Link to={SETTINGS_PRICING_PLAN}>
					<div className="setting_single_item wx__d-flex wx__flex-row wx__align-items-start">
						<WxIcon
							icon="account_balance_wallet"
							className="setting_link_icon"
						/>
						<div className="right-sec">
							<h6 className="wx__text_heading wx__text_semibold wx__mb-0">
								Pricing Plan
							</h6>
							<div className="wx__text_small wx__text_regular">
								View and update your store details
							</div>
						</div>
					</div>
				</Link>
			</div>
		</WxMainLg>
	);
};

export default Setting;
