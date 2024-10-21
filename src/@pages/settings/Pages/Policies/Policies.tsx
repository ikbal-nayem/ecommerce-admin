import WxMainMd from "@components/MainContentLayout/WxMainMd";
import { FormHeader } from "@components/FormLayout";
import { MASTER_META_KEY } from "config/constants";
import { IPolicySettings } from "@interfaces/Settings.interface";
import { SETTINGS } from "routes/path-name.route";
import { PolicySettingService } from "services/api/settings/Policy.service";
import Preloader from "services/utils/preloader.service";
import { useEffect, useState } from "react";
import "./Policies.scss";
import PolicyCard from "./PolicyCard";

const cardItems = [
	{
		title: "Refund Policy",
		metaKey: MASTER_META_KEY.POLICY_TEMPLATE_REFUND,
	},
	{
		title: "Privacy Policy",
		metaKey: MASTER_META_KEY.POLICY_TEMPLATE_PRIVACY,
	},
	{
		title: "Terms of Services",
		metaKey: MASTER_META_KEY.POLICY_TEMPLATE_TOS,
	},
	{
		title: "Shipping Policy",
		metaKey: MASTER_META_KEY.POLICY_TEMPLATE_SHIPPING,
	},
];

const Policies = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [policies, setPolicies] = useState<IPolicySettings[]>([]);

	useEffect(() => {
		PolicySettingService.getStorePolicies()
			.then((res) => setPolicies(res.body))
			.finally(() => setIsLoading(false));
	}, []);

	return (
		<WxMainMd className="setting_policies_page">
			<FormHeader title="Policies" backNavigationLink={SETTINGS} />
			{isLoading ? <Preloader absolutePosition /> : null}
			{cardItems.map((item) => (
				<PolicyCard key={item?.metaKey} item={item} policies={policies} />
			))}
		</WxMainMd>
	);
};

export default Policies;
