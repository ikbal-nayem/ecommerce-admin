import { ConfirmationModal } from "@components/ConfirmationModal/ConfirmationModal";
import WxButton from "@components/WxButton";
import WxDropdown from "@components/WxDropdown/WxDropdown";
import WxHr from "@components/WxHr";
import WxIcon from "@components/WxIcon/WxIcon";
import WxImg from "@components/WxImg/WxImg";
import WxTag from "@components/WxTag";
import { PRICING_PLAN_KEY } from "config/constants";
import { ENV } from "config/ENV.config";
import {
	PORTAL_OVERVIEW,
	SETTINGS_PRICING_PLAN,
} from "routes/path-name.route";
import { AuthService } from "services/api/Auth.service";
import { PaymentService } from "services/api/Payment.service";
import { LocalStorageService } from "services/utils/localStorage.service";
import { ButtonLoader } from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { ReactComponent as HeaderLogo } from "assets/svg/header-logo.svg";
import { useAuth } from "context/auth";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { statusColorMapping } from "utils/colorMap";
import { addHours } from "utils/splitDate";
import { imageURLGenerate } from "utils/utils";
import "./Header.scss";

const Header = ({ onClickFun, menuIconFlag, setMenuIconFlag }) => {
	const [menu, setMenu] = useState<boolean>(false);
	const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
	const [isBuying, setIsBuying] = useState<boolean>(false);
	const [count, setCount] = useState<number>(5);
	const { user_data, activePlan } = useSelector((data: any) => data.user);
	const { logout } = useAuth();
	const accessToken = LocalStorageService.get("accessToken");

	const signOut = () => {
		AuthService.logout({ token: accessToken })
			.then((res: any) => {
				logout();
			})
			.catch((err) => ToastService.error(err?.message));
	};

	useEffect(() => {
		setMenu(false);
	}, []);

	const onClickMenuBar = () => {
		onClickFun();
		setMenuIconFlag(!menuIconFlag);
	};

	const onBuyStandardTrial = () => {
		setIsConfirmOpen(true);
		setInterval(() => setCount((pre) => (pre -= 1)), 1000);
		setTimeout(() => logout(), count * 1000);
	};

	const onConfirmBuy = () => {
		setIsBuying(true);
		PaymentService.merchantPurchaseStartTrial()
			.then((resp) => {
				ToastService.success(resp?.message);
				onBuyStandardTrial();
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsBuying(false));
	};

	return (
		<div className="wx__header wx__d-flex wx__justify-content-between wx__align-items-center">
			<div className="menu_icon wx__me-2" onClick={onClickMenuBar}>
				{menuIconFlag ? <WxIcon icon="close" /> : <WxIcon icon="menu" />}
			</div>
			<div className="wx__header__logo wx__d-flex wx__align-items-center">
				<Link to="/dashboard">
					<HeaderLogo />
					<span className="header_store_name wx__text_body wx__text_medium wx__ms-2">
						<strong className="wx__me-2">
							{user_data?.store_name || "WebX Global"}
						</strong>
						<WxTag
							label={activePlan?.title}
							color={statusColorMapping(activePlan?.title)}
						/>
					</span>
				</Link>
				{activePlan?.key === PRICING_PLAN_KEY.PPB_BASIC &&
					addHours(48, user_data?.store_created_date) < new Date() && (
						<div className="try-now-sec wx__d-flex wx__align-items-center wx__gap-2 wx__ms-5">
							<span className="wx__text-muted">
								Try{" "}
								<Link to={SETTINGS_PRICING_PLAN}>
									<b>standard</b>
								</Link>{" "}
								for 30 days
							</span>
							<WxButton
								variant="fill"
								size="sm"
								className="wx__ms-2"
								style={{ borderRadius: 20 }}
								onClick={onConfirmBuy}
								disabled={isBuying}
							>
								{isBuying ? <ButtonLoader /> : "Try now"}
							</WxButton>
						</div>
					)}
			</div>
			<div className="wx__header__right__part d-flex align-items-center">
				<div className="wx__avatar__img" onClick={() => setMenu(!menu)}>
					{user_data?.profile_img ? (
						<WxImg src={imageURLGenerate(user_data.profile_img)} alt="" />
					) : (
						<WxIcon icon="account_circle" size={30} />
					)}
				</div>
				<div>
					<span
						role="button"
						className="wx__text_semibold topbar_user_name"
						onClick={() => setMenu(!menu)}
					>
						{user_data?.first_name
							? user_data?.first_name + " " + user_data?.last_name
							: user_data?.email || user_data?.role_name || "My Account"}
					</span>

					<WxDropdown id="triggerPlace" isOpen={menu} setIsOpen={setMenu}>
						<ul>
							<li>
								<Link to="account-setting" className="wx__text_body">
									<WxIcon icon="person" variants="outlined" size={20} /> Manage
									Profile
								</Link>
							</li>
							<li>
								<a
									href={ENV.LandingPageURL + "learning-center"}
									target="_blank"
									className="wx__text_body"
								>
									<WxIcon icon="menu_book" variants="outlined" size={20} />{" "}
									Learning Center
								</a>
							</li>
							<li>
								<Link to={PORTAL_OVERVIEW} className="wx__text_body">
									<WxIcon icon="group_work" variants="outlined" size={20} />{" "}
									Partner Portal
								</Link>
							</li>
							<li>
								<WxHr />
							</li>
							<li>
								<a className="wx__text_body" onClick={() => signOut()}>
									<WxIcon
										icon="wifi_protected_setup"
										variants="outlined"
										size={20}
									/>{" "}
									Switch Store
								</a>
							</li>
						</ul>
					</WxDropdown>
				</div>
			</div>
			<ConfirmationModal
				onConfirm={logout}
				isOpen={isConfirmOpen}
				title="Successful!"
				onConfirmLabel="Logout now"
				confirmType="primary"
				body={
					<p>
						You are now in <b>standard</b> plan for 30 days.
						<br />
						<span>
							Logging out in <b>{count}</b> seconds
						</span>
					</p>
				}
			/>
		</div>
	);
};

export default Header;
