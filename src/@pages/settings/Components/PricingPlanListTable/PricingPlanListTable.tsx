import WxButton from "@components/WxButton";
import WxIcon from "@components/WxIcon/WxIcon";
import { MASTER_META_KEY } from "config/constants";
import "./PricingPlanTable.scss";

interface IPricingPlanTable {
	pricingPlanes: any;
	activeBilling: any;
	pricingValue: any[];
	onSelectPlan: (plan: any) => void;
}

const makePaymentGateways = (getwayList: any[]) => {
	const gl = [];
	const cod = getwayList.find(
		(val) => val.metaKey === MASTER_META_KEY.PAYMENT_GATEWAY_TYPE_COD
	);
	cod && gl.push(cod?.title);
	getwayList?.length > 1 && gl.push("Online Payment");
	return gl.join(", ");
};

const PricingPlanListTable = ({
	pricingPlanes,
	activeBilling,
	pricingValue,
	onSelectPlan,
}: IPricingPlanTable) => {
	return (
		<div className="wx__responsive_table">
			<table className="wx__table pricing_plan_table">
				<thead className="wx__thead">
					<tr className="wx__tr">
						<th className="wx__th"></th>
						{pricingPlanes?.plan?.[activeBilling]?.map((plan, index) => (
							<th
								key={index}
								className={`wx__th  ${
									plan?.pricingPlan?.isPopular ? "th__active" : ""
								}`}
							>
								<div className="d-flex flex-column justify-content-center align-items-center">
									{plan?.pricingPlan?.isPopular && (
										<p className="w-100 text_caption">Most Popular</p>
									)}
									<h4 className="text_heading text_regular mb-3 mt-3">
										{plan?.pricingPlan?.title}
									</h4>
									<h2 className="text_medium text_strong mb-0">
										৳{" "}
										{Math.round(
											(plan?.price / plan?.billingCycle?.cycleDays) * 30
										)}
										<span className="per_m">/month</span>
									</h2>
									{/* <p className="text_small text_regular">
										{plan?.pricingPlan?.summary}
									</p> */}
									<WxButton
										variant="outline"
										onClick={() => onSelectPlan(plan)}
										className="mt-3 mb-3"
									>
										Choose plan
									</WxButton>
								</div>
							</th>
						))}
					</tr>
				</thead>
				<tbody className="wx__tbody">
					{pricingValue?.map((operator: any) => (
						<tr className="wx__tr" key={operator?.id}>
							<td className="wx__td text_body text_strong">
								{operator?.title}
							</td>
							{priceingCell(pricingPlanes?.plan?.[activeBilling], operator)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

const priceingCell = (pricing, operator) =>
	pricing.map((plan) => {
		const value = plan?.pricingPlan?.[operator.property];
		let renderItem = value;
		if (typeof value === "boolean")
			if (
				operator.property === "isWholesaleEnabled" ||
				operator.property === "isPosPayable" ||
				operator.property === "hasMarketing"
			)
				renderItem = "Coming soon";
			else
				renderItem = value ? <WxIcon icon="done" /> : <WxIcon icon="close" />;
		else if (typeof value === "object")
			renderItem = value?.length
				? operator.property === "paymentGateways"
					? makePaymentGateways(value)
					: value?.map((ii) => ii?.title).join(", ")
				: value.title;
		else if (Number(value)) {
			if (operator.property === "level") {
				if (value <= 77) renderItem = "Basic";
				else if (value <= 88) renderItem = "Basic & Essential";
				else if (value <= 99) renderItem = "All";
			} else renderItem = value > 0 ? value : "Unlimited";
		}

		return (
			<td
				className={`wx__td text_body text_medium pricing_table_cell ${
					plan?.pricingPlan?.isPopular ? "td_active" : ""
				}`}
				key={plan?.id}
			>
				{renderItem}
			</td>
		);
	});

export default PricingPlanListTable;
