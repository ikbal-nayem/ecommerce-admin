import WxTag from "@components/WxTag";
import { STATUS_CONSTANT } from "config/constants";
import { IOrderDetails } from "@interfaces/order.interface";
import { memo } from "react";
import { statusColorMapping } from "utils/colorMap";

type PaymentDetailsInfoProps = {
	orderDetails?: IOrderDetails;
	setIsDiscountOpen?: (val: boolean) => void;
	setIsShippingOpen?: (val: boolean) => void;
};

const PaymentDetailsInfo = ({
	orderDetails,
	setIsDiscountOpen,
	setIsShippingOpen,
}: PaymentDetailsInfoProps) => {
	return (
		<>
			<div className="wx__d-flex wx__align-items-center wx__gap-4 wx__mb-3">
				<h6 className="wx__text_h6 wx__text_semibold wx__m-0">Payment</h6>
				<div>
					<WxTag
						label={orderDetails?.paymentStatus}
						color={statusColorMapping(orderDetails?.paymentStatus)}
					/>
				</div>
			</div>
			<div className="wx__text_body wx__border-1 wx__border-bottom wx__mb-3">
				<div className="wx__d-flex wx__justify-content-between wx__mb-3">
					<span className="subtotal">Subtotal</span>
					<span className="subtotal">
						BDT {orderDetails?.orderSubTotal?.toLocaleString()}
					</span>
				</div>
				<div className="wx__d-flex wx__justify-content-between wx__mb-3">
					<div className="wx__d-flex wx__gap-5">
						<span
							className="wx__text-primary"
							role="button"
							onClick={() =>
								orderDetails?.paymentStatus !== STATUS_CONSTANT.paid
									? setIsDiscountOpen(true)
									: null
							}
						>
							{orderDetails?.paymentStatus === STATUS_CONSTANT.paid
								? "Discount"
								: orderDetails?.directDiscountAmount
								? "Edit discount"
								: "Add discount"}
						</span>
						{orderDetails?.directDiscountAmount ? (
							<span>
								Discounted &nbsp;
								{(
									(orderDetails?.directDiscountAmount /
										orderDetails?.orderSubTotal) *
									100
								).toFixed(2)}
								%
							</span>
						) : null}
					</div>
					{orderDetails?.directDiscountAmount ? (
						<span className="wx__text-muted">
							- BDT {orderDetails?.directDiscountAmount?.toLocaleString()}
						</span>
					) : (
						<span className="wx__text-muted">BDT 0.00</span>
					)}
				</div>
				<div className="wx__d-flex wx__justify-content-between wx__mb-3">
					<span>Coupon amount</span>
					<span className="wx__text-muted">
						BDT{" "}
						{orderDetails?.couponAmount
							? `- ${orderDetails?.couponAmount}`
							: "0.00"}
					</span>
				</div>
				<div className="wx__d-flex wx__justify-content-between wx__mb-3">
					<div className="wx__d-flex wx__gap-5">
						<span
							className="wx__text-primary"
							role="button"
							onClick={() =>
								orderDetails?.paymentStatus !== STATUS_CONSTANT.paid
									? setIsShippingOpen(true)
									: null
							}
						>
							{orderDetails?.paymentStatus === STATUS_CONSTANT.paid
								? "Shipping"
								: orderDetails?.deliveryChargeAmount
								? "Edit Shipping"
								: "Add Shipping"}
						</span>
						{orderDetails?.deliveryZoneId ? (
							<span>{orderDetails?.deliveryZoneName}</span>
						) : null}
					</div>
					<span className="wx__text-muted">
						BDT &nbsp;
						{orderDetails?.deliveryChargeAmount?.toLocaleString() || "0.00"}
					</span>
				</div>
				<div className="wx__d-flex wx__justify-content-between wx__mb-3">
					<span className="wx__text_strong">Total</span>
					<span className="wx__text_strong">
						BDT {orderDetails?.totalPayableAmount?.toLocaleString()}
					</span>
				</div>
			</div>

			{orderDetails?.invoice?.paidAmount ? (
				<div className="wx__text_body wx__border-1 wx__border-bottom wx__mb-3">
					<div className="wx__d-flex wx__justify-content-between wx__mb-3">
						<span>Paid amount</span>
						<span>
							BDT {orderDetails?.invoice?.paidAmount?.toLocaleString()}
						</span>
					</div>
					<div className="wx__d-flex wx__justify-content-between wx__mb-3">
						<span>Due amount</span>
						<span>
							BTD {orderDetails?.invoice?.dueAmount?.toLocaleString()}
						</span>
					</div>
				</div>
			) : null}
		</>
	);
};

export default memo(PaymentDetailsInfo);
