import WxIcon from "@components/Icon";
import { STATUS_CONSTANT } from "config/constants";
import { IAppPricing } from "@interfaces/app.interface";
import "./PlanPricing.scss";

interface IPlanPricingProps {
	PlanPricingData: IAppPricing[];
}

const PlanPricing = ({ PlanPricingData }: IPlanPricingProps) => (
	<div className="wx__pricing row ">
		{PlanPricingData?.map((item, index) => (
			<div
				className="wx__single_pricing col-lg-4 col-md-6 col-sm-12 mb-2"
				key={index}
			>
				<div className="card p-3">
					<WxIcon icon="workspace_premium" hoverTitle={item?.title} size={30} />
					<p className="text_small text_regular my-2">
						{item?.title}
					</p>
					<div className="mb-2">
						<h6 className="text_heading text_medium m-0">
							{item?.currencyCode} {item?.recurringAmount}&nbsp;
							{item?.billingCycleName === STATUS_CONSTANT.free
								? null
								: item?.billingCycleName}
						</h6>
						<small className="text-muted text_small">
							(Purchase amount {item?.currencyCode} {item?.firstPayAmount})
						</small>
					</div>
					<p>{item?.packageDesc}</p>
				</div>
			</div>
		))}
	</div>
);

export default PlanPricing;
