import WxMainLg from "@components/MainContentLayout/MainLg";
import Icon from "@components/Icon";
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
			<div className="card p-3 d-flex flex-row flex-wrap justify-content-center mt-3">
				<Link to={SETTINGS_GENERAL}>
					<div className="setting_single_item d-flex flex-row align-items-start">
						<Icon icon="space_dashboard" className="setting_link_icon" />
						<div className="right-sec">
							<h6 className="text_heading text_semibold mb-0">
								General
							</h6>
							<p className="text_small text_regular">
								View and update your store details
							</p>
						</div>
					</div>
				</Link>
				<Link to={SETTINGS_PAYMENT}>
					<div className="setting_single_item d-flex flex-row align-items-start">
						<Icon icon="payment" className="setting_link_icon" />
						<div className="right-sec">
							<h6 className="text_heading text_semibold mb-0">
								Payment
							</h6>
							<div className="text_small text_regular">
								View and update your store details
							</div>
						</div>
					</div>
				</Link>
				<Link to={SETTINGS_BILLING}>
					<div className="setting_single_item d-flex flex-row align-items-start">
						<Icon icon="travel_explore" className="setting_link_icon" />
						<div className="right-sec">
							<h6 className="text_heading text_semibold mb-0">
								Billing
							</h6>
							<div className="text_small text_regular">
								View and update your store details
							</div>
						</div>
					</div>
				</Link>

				<Link to={SETTINGS_DOMAIN}>
					<div className="setting_single_item d-flex flex-row align-items-start">
						<Icon icon="manage_accounts" className="setting_link_icon" />
						<div className="right-sec">
							<h6 className="text_heading text_semibold mb-0">
								Manage Domain
							</h6>
							<div className="text_small text_regular">
								View and update your store details
							</div>
						</div>
					</div>
				</Link>
				<Link to={SETTINGS_DELIVERY}>
					<div className="setting_single_item d-flex flex-row align-items-start">
						<Icon icon="local_shipping" className="setting_link_icon" />
						<div className="right-sec">
							<h6 className="text_heading text_semibold mb-0">
								Delivery
							</h6>
							<div className="text_small text_regular">
								View and update your store details
							</div>
						</div>
					</div>
				</Link>
				<Link to={SETTINGS_ORDER}>
					<div className="setting_single_item d-flex flex-row align-items-start">
						<Icon icon="receipt" className="setting_link_icon" />
						<div className="right-sec">
							<h6 className="text_heading text_semibold mb-0">
								Order
							</h6>
							<div className="text_small text_regular">
								View and update your store details
							</div>
						</div>
					</div>
				</Link>

				<Link to={SETTINGS_NOTIFICATION}>
					<div className="setting_single_item d-flex flex-row align-items-start">
						<Icon icon="notifications" className="setting_link_icon" />
						<div className="right-sec">
							<h6 className="text_heading text_semibold mb-0">
								Notification
							</h6>
							<div className="text_small text_regular">
								View and update your store details
							</div>
						</div>
					</div>
				</Link>
				<Link to={SETTINGS_CHECKOUT}>
					<div className="setting_single_item d-flex flex-row align-items-start">
						<Icon icon="shopping_cart" className="setting_link_icon" />
						<div className="right-sec">
							<h6 className="text_heading text_semibold mb-0">
								Checkout
							</h6>
							<div className="text_small text_regular">
								View and update your store details
							</div>
						</div>
					</div>
				</Link>
				<Link to={SETTINGS_SITE_OPERATOR}>
					<div className="setting_single_item d-flex flex-row align-items-start">
						<Icon icon="settings" className="setting_link_icon" />
						<div className="right-sec">
							<h6 className="text_heading text_semibold mb-0">
								Site Operator
							</h6>
							<div className="text_small text_regular">
								View and update your store details
							</div>
						</div>
					</div>
				</Link>
				<Link to={SETTINGS_ROLES}>
					<div className="setting_single_item d-flex flex-row align-items-start">
						<Icon icon="how_to_reg" className="setting_link_icon" />
						<div className="right-sec">
							<h6 className="text_heading text_semibold mb-0">
								Roles
							</h6>
							<div className="text_small text_regular">
								View and update your store details
							</div>
						</div>
					</div>
				</Link>
				<Link to={SETTINGS_POLICIES}>
					<div className="setting_single_item d-flex flex-row align-items-start">
						<Icon icon="gavel" className="setting_link_icon" />
						<div className="right-sec">
							<h6 className="text_heading text_semibold mb-0">
								Policies
							</h6>
							<div className="text_small text_regular">
								View and update your store details
							</div>
						</div>
					</div>
				</Link>
				<Link to={SETTINGS_PRICING_PLAN}>
					<div className="setting_single_item d-flex flex-row align-items-start">
						<Icon
							icon="account_balance_wallet"
							className="setting_link_icon"
						/>
						<div className="right-sec">
							<h6 className="text_heading text_semibold mb-0">
								Pricing Plan
							</h6>
							<div className="text_small text_regular">
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
