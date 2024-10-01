import WxIcon from "@components/WxIcon/WxIcon";
import { IOrderDetails } from "@interfaces/order.interface";
import { memo } from "react";
import { generateDateFormat } from "utils/splitDate";

type OrderPlacedInfoProps = {
	orderDetails: IOrderDetails;
};

const OrderPlacedInfo = ({ orderDetails }: OrderPlacedInfoProps) => {
	return (
		<div className="card p-3">
			<section className="mb-4">
				<span className="text_subtitle text_semibold">
					Order Placed on
				</span>
				<br />
				<span className="text_body text_regular">
					{generateDateFormat(
						orderDetails?.orderDate,
						"%MM% %date%, %yyyy% at %hour%:%minute% %ampm%"
					)}
				</span>
			</section>
			<section>
				<span className="text_subtitle text_semibold">
					Order Placed from
				</span>
				<br />
				<div className="text_body text_regular d-flex align-items-center gap-2">
					<WxIcon variants="outlined" icon="storefront" />
					<span>{orderDetails?.saleChannel}</span>
				</div>
			</section>
		</div>
	);
};

export default memo(OrderPlacedInfo);
