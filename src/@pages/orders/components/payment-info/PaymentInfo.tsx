import { IDeliveryZoneItem } from "@interfaces/Settings.interface";
import { DeliverySettingService } from "services/api/settings/Delivery.service";
import { useEffect, useState } from "react";
import Discount from "../discount/Discount";
import ShippingModal from "../shipping/Shipping";

type IPaymentInfo = {
	selectedProduct?: any[];
	setValue?: any;
	watch?: any;
	getValues?: any;
};

const PaymentInfo = ({
	selectedProduct,
	watch,
	setValue,
	getValues,
}: IPaymentInfo) => {
	const [isDiscountOpen, setIsDiscountOpen] = useState<boolean>(false);
	const [isShippingOpen, setIsShippingOpen] = useState<boolean>(false);
	const [zoneList, setZoneList] = useState<IDeliveryZoneItem[]>([]);
	const [selectedZone, setSelectedZone] = useState<IDeliveryZoneItem>();

	useEffect(() => {
		DeliverySettingService.getList().then((res) => {
			setZoneList(res.body);
			setSelectedZone(res.body?.[0]);
		});
	}, []);

	useEffect(() => {
		calculateTotal();
	}, [selectedProduct]);

	const calculateTotal = () => {
		let _subtotal = 0;
		selectedProduct?.forEach((item) => {
			_subtotal += item.subTotal;
		});
		const [discountAmount, deliveryChargeAmount] = getValues([
			"directDiscountAmount",
			"deliveryChargeAmount",
		]);
		let newTotal = _subtotal;
		newTotal = newTotal - (discountAmount || 0) + (deliveryChargeAmount || 0);
		setValue("orderSubTotal", _subtotal);
		setValue("totalPayableAmount", newTotal || 0);
	};

	const onDiscount = (discountValue: number) => {
		setValue("directDiscountAmount", discountValue);
		calculateTotal();
	};

	const onShipping = (deliveryZone: IDeliveryZoneItem) => {
		setValue("deliveryChargeId", deliveryZone?.id);
		setValue("deliveryChargeAmount", deliveryZone?.deliveryChargeAmount);
		setValue("deliveryZoneName", deliveryZone?.name);
		setSelectedZone(deliveryZone);
		calculateTotal();
	};

	const [
		orderSubtotal,
		discountAmount,
		deliveryChargeAmount,
		deliveryZoneName,
		orderTotal,
	] = watch([
		"orderSubTotal",
		"directDiscountAmount",
		"deliveryChargeAmount",
		"deliveryZoneName",
		"totalPayableAmount",
	]);

	return (
		<>
			<div className="card wx__p-3">
				<h6 className="wx__text_h6 wx__text_semibold">Payment</h6>
				<div className="wx__text_body">
					<div className="wx__text_regular wx__text_body d-flex wx__justify-content-between wx__mb-3">
						<span>Subtotal</span>
						<span>BDT {orderSubtotal?.toLocaleString() || 0}</span>
					</div>
					<div className="d-flex wx__justify-content-between wx__mb-3">
						<div className="d-flex gap-5">
							<span
								className="wx__text-primary"
								role="button"
								onClick={() => setIsDiscountOpen(true)}
							>
								{discountAmount ? "Edit discount" : "Add discount"}
							</span>
							{discountAmount ? (
								<span>
									Percentage -{" "}
									{((discountAmount / orderSubtotal) * 100).toFixed(2)}%
								</span>
							) : null}
						</div>
						{discountAmount ? (
							<span className="wx__text-muted"> - BDT {discountAmount}</span>
						) : (
							<span className="wx__text-muted">BDT 00.00</span>
						)}
					</div>
					<div className="d-flex wx__justify-content-between wx__mb-3">
						<div className="d-flex gap-5">
							<span
								className="wx__text-primary"
								role="button"
								onClick={() => setIsShippingOpen(true)}
							>
								{deliveryChargeAmount ? "Edit Shipping" : "Add Shipping"}
							</span>
							{deliveryChargeAmount ? <span>{deliveryZoneName}</span> : null}
						</div>
						<span className="wx__text-muted">
							BDT {deliveryChargeAmount?.toLocaleString() || "0.00"}
						</span>
					</div>
					<div className="d-flex wx__justify-content-between wx__mb-3">
						<span className="wx__text_strong">Total</span>
						<span className="wx__text_strong">
							BDT {orderTotal?.toLocaleString() || "0.00"}
						</span>
					</div>
				</div>
			</div>
			<Discount
				isDiscountOpen={isDiscountOpen}
				subTotal={orderSubtotal}
				handleDiscountClose={() => setIsDiscountOpen(false)}
				onDiscount={onDiscount}
			/>
			<ShippingModal
				isShippingOpen={isShippingOpen}
				handleShippingClose={() => setIsShippingOpen(false)}
				onShipping={onShipping}
				zoneList={zoneList}
				selectedZone={selectedZone}
			/>
		</>
	);
};

export default PaymentInfo;
