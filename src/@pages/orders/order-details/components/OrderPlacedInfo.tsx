import WxIcon from "@components/WxIcon/WxIcon";
import { IOrderDetails } from "@interfaces/order.interface";
import { memo } from "react";
import { generateDateFormat } from "utils/splitDate";

type OrderPlacedInfoProps = {
	orderDetails: IOrderDetails;
};

const OrderPlacedInfo = ({ orderDetails }: OrderPlacedInfoProps) => {
	return (
		<div className="card wx__p-3">
			<section className="wx__mb-4">
				<span className="wx__text_subtitle wx__text_semibold">
					Order Placed on
				</span>
				<br />
				<span className="wx__text_body wx__text_regular">
					{generateDateFormat(
						orderDetails?.orderDate,
						"%MM% %date%, %yyyy% at %hour%:%minute% %ampm%"
					)}
				</span>
			</section>
			<section>
				<span className="wx__text_subtitle wx__text_semibold">
					Order Placed from
				</span>
				<br />
				<div className="wx__text_body wx__text_regular d-flex wx__align-items-center gap-2">
					<WxIcon variants="outlined" icon="storefront" />
					<span>{orderDetails?.saleChannel}</span>
				</div>
			</section>
		</div>
	);
};

export default memo(OrderPlacedInfo);
