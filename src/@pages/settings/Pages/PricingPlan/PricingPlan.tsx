import { ConfirmationModal } from "@components/ConfirmationModal/ConfirmationModal";
import WxMainFull from "@components/MainContentLayout/WxMainFull";
import { WxFormHeader } from "@components/WxFormLayout";
import WxRadio from "@components/WxRadio/WxRadio";
import { MASTER_META_KEY } from "config/constants";
import PricingListTable from "@pages/settings/Components/PricingPlanListTable/PricingPlanListTable";
import {
	DOWNGRADE_SITE_OPERATOR,
	PAYMENT,
	SETTINGS,
} from "routes/path-name.route";
import { AdminService } from "services/api/admin/Admin.service";
import { PaymentService } from "services/api/Payment.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./PricingPlan.scss";

const pricingPlanValue = [
	{
		id: 0,
		title: "Number of Products",
		property: "productCount",
	},
	{
		id: 1,
		title: "Product Image",
		property: "productImageCount",
	},
	{
		id: 2,
		title: "Product Variation",
		property: "hasProductVariant",
	},
	{
		id: 7,
		title: "Custom Domain",
		property: "hasCustomDomain",
	},
	{
		id: 4,
		title: "Apps",
		property: "level",
	},
	{
		id: 3,
		title: "Themes",
		property: "level",
	},
	{
		id: 10,
		title: "Payment",
		property: "paymentGateways",
	},
	{
		id: 8,
		title: "Store Operator",
		property: "storeOperatorCount",
	},
	{
		id: 9,
		title: "Traffic per month",
		property: "monthlyTrafficCount",
	},
	{
		id: 14,
		title: "Support",
		property: "support",
	},
	{
		id: 15,
		title: "POS",
		property: "isPosPayable",
	},
	{
		id: 16,
		title: "Manual order",
		property: "hasManualOrder",
	},
	{
		id: 13,
		title: "Courier Service",
		property: "hasCourierService",
	},
	{
		id: 12,
		title: "Facebook pixel",
		property: "hasFacebookPixel",
	},
	{
		id: 11,
		title: "Google analytics",
		property: "hasGoogleAnalytics",
	},
	{
		id: 17,
		title: "Wholesale",
		property: "isWholesaleEnabled",
	},
	{
		id: 18,
		title: "Report",
		property: "report",
	},
	{
		id: 19,
		title: "Marketing",
		property: "hasMarketing",
	},
	{
		id: 20,
		title: "WebX branding",
		property: "hasWebxBranding",
	},
];

const PricingPlan = () => {
	const [activeBilling, setActiveBilling] = useState<string>();
	const [pricingPlanes, setPricingPlanes] = useState<any>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isPurchesing, setIsPurchesing] = useState<boolean>(false);
	const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
	const selectedPlan = useRef(null);

	const { activePlan } = useSelector((data: any) => data?.user);

	const navigate = useNavigate();

	useEffect(() => {
		AdminService.getPricingPlane()
			.then((res) => {
				setPricingPlanes(res.body);
				setActiveBilling(res.body?.billingCycles?.[0].id);
			})
			.finally(() => setIsLoading(false));
	}, []);

	const handleModalClose = () => {
		selectedPlan.current = null;
		setIsConfirmOpen(false);
	};

	const onSelectPlan = (plan) => {
		selectedPlan.current = plan;
		setIsConfirmOpen(true);
	};

	const onConfirmSelect = () => {
		if (!selectedPlan.current) return;
		if (selectedPlan.current?.pricingPlan?.level < activePlan?.level) {
			const query = new URLSearchParams({ plan_id: selectedPlan.current?.id });
			return navigate(DOWNGRADE_SITE_OPERATOR + "?" + query.toString());
		}
		setIsPurchesing(true);
		const reqData = {
			merchantPurchaseLine: [
				{
					serviceMetaKey: MASTER_META_KEY.WEBX_SERVICES_PRICING_PLAN,
					itemId: selectedPlan.current?.id,
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

	if (isLoading) return <Preloader absolutePosition />;

	return (
		<WxMainFull className="pricing_plan_sec">
			<div className="w-100 d-flex wx__justify-content-between wx__align-items-center">
				<WxFormHeader title="Pricing Plan" backNavigationLink={SETTINGS} />
				<div className="__switch d-flex wx__align-items-center wx__text_heading wx__text_medium">
					{pricingPlanes?.billingCycles?.map((cycle) => (
						<WxRadio
							key={cycle?.id}
							id={cycle?.id}
							label={cycle?.cycleName}
							singleUse
							noMargin
							isChecked={activeBilling === cycle?.id}
							onChange={(e) => setActiveBilling(cycle?.id)}
						/>
					))}
				</div>
			</div>
			<div className="card">
				{pricingPlanes?.billingCycles?.length ? (
					<PricingListTable
						pricingPlanes={pricingPlanes}
						activeBilling={activeBilling}
						pricingValue={pricingPlanValue}
						onSelectPlan={onSelectPlan}
					/>
				) : null}
			</div>
			<ConfirmationModal
				onConfirm={onConfirmSelect}
				isOpen={isConfirmOpen}
				onClose={handleModalClose}
				isSubmitting={isPurchesing}
				title="Are you sure!"
				confirmType={
					selectedPlan.current?.pricingPlan?.level < activePlan?.level
						? "danger"
						: "primary"
				}
				onConfirmLabel={
					selectedPlan.current?.pricingPlan?.level < activePlan?.level
						? "Yes downgrade"
						: "Purchase"
				}
				body={
					<span>
						Do you want to purchase the{" "}
						{selectedPlan.current?.billingCycle?.cycleName} package of&nbsp;
						<b>{selectedPlan.current?.pricingPlan?.title}</b>?
						{selectedPlan.current?.pricingPlan?.level < activePlan?.level && (
							<p className="wx__mt-3">
								You may have to remove some data or images to buy this package.
							</p>
						)}
					</span>
				}
			/>
		</WxMainFull>
	);
};

export default PricingPlan;
