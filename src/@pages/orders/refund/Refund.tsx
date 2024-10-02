import WxMainLg from "@components/MainContentLayout/MainLg";
import WxButton from "@components/Button";
import { WxFormHeader } from "@components/WxFormLayout";
import TextInput from "@components/TextInput";
import { IProductVariant } from "@interfaces/product.interface";
import { ORDER_DETAILS } from "routes/path-name.route";
import { OrderService } from "services/api/Order.service";
import { ButtonLoader } from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { ReactComponent as TKSign } from "assets/svg/taka.svg";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import ProductRefundCart from "../components/product-cart/ProductRefundCart";

interface IRefandableInfo {
	amount?: number;
	quantity?: number;
}
const defaultRefandableInfo: IRefandableInfo = {
	amount: 0,
	quantity: 0,
};

const OrderRefund = () => {
	const { order_id } = useParams();
	const [loading, setLoading] = useState<boolean>(true);
	const [productList, setProductList] = useState<IProductVariant[]>([]);
	const [refundItems, setRefundItems] = useState<IProductVariant[]>([]);
	const [refundableInfo, setRefundableInfo] = useState<IRefandableInfo>(
		defaultRefandableInfo
	);
	const [isSubmiting, setIsSubmiting] = useState(false);
	const [customerId, setCustomerId] = useState<string>("");
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<any>({
		defaultValues: {
			refundAmount: 0,
		},
	});
	useEffect(() => {
		if (refundItems.length) {
			let refundQuantity = 0;
			let refundAmount = 0;
			refundItems.map((item: IProductVariant) => {
				refundQuantity += item.quantity;
				refundAmount += item.sellingPrice * item.quantity;
			});
			setRefundableInfo({
				quantity: refundQuantity,
				amount: refundAmount,
			});
		}
	}, [refundItems]);

	useEffect(() => {
		if (loading) getOrderDetails();
	}, [loading]);

	const getOrderDetails = () => {
		if (!order_id) return;
		OrderService.getDetails({ body: { id: order_id } })
			.then((res) => {
				setProductList(res.body?.orderLineList);
				const refundList = res.body?.orderLineList?.map((item) => ({
					...item,
					quantity: 0,
				}));
				setCustomerId(res.body.customerId);
				setRefundItems(refundList);
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setLoading(false));
	};

	const onIncrease = (index: number) => {
		const newRefundItems = [...refundItems];
		if (newRefundItems[index].quantity < productList[index].quantity)
			newRefundItems[index].quantity += 1;
		setRefundItems(newRefundItems);
	};
	const onDecrease = (index: number) => {
		const newRefundItems = [...refundItems];
		if (newRefundItems[index].quantity > 0) newRefundItems[index].quantity -= 1;
		setRefundItems(newRefundItems);
	};

	const onSubmit = (data: any) => {
		if (refundableInfo.quantity <= 0) {
			ToastService.warning("Refund quantity must be greater then 0!");
			return;
		}
		if (refundableInfo.amount <= 0) {
			ToastService.warning("Refund amount must be greater then 0!");
			return;
		}
		setIsSubmiting(true);
		const items = refundItems.map((item: any) => ({
			id: item.id,
			productId: item.productId,
			productVariantCombinationId: item.productVariantCombinationId,
			quantity: item.quantity,
			orderDescription: null,
			productLotId: item.productLotId,
			orderStatusId: null,
			paymentStatusId: null,
		}));
		const requestData = {
			customerId: customerId,
			id: order_id,
			customerSessionId: null,
			orderLineList: items,
			refundAmount: data.refundAmount,
			refundReason: data.reason,
		};

		OrderService.refundStore(requestData)
			.then((res) => {
				ToastService.success(res.message);
				navigate(ORDER_DETAILS({ order_id }));
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsSubmiting(false));
	};

	return (
		<WxMainLg>
			<WxFormHeader
				title="Refund"
				backNavigationLink={ORDER_DETAILS({ order_id })}
			/>
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<div className="row">
					<div className="col-lg-8 col-md-7 col-sm-12">
						<div className="card p-3">
							<ProductRefundCart
								products={productList}
								refundItems={refundItems}
								handleIncrease={onIncrease}
								handleDecrease={onDecrease}
							/>
							<p className="m-3 text_small wx_text_regular text-muted">
								Refunded items will be removed from the order
							</p>
						</div>
						<div className="card mt-3 p-3">
							<h6 className="text_h6 text_semibold">Refund Reason</h6>
							<TextInput
								helpText="Only you and your staff can see ths reason"
								noMargin
								registerProperty={{ ...register("reason") }}
							/>
						</div>
					</div>
					<div className="col-lg-4 col-md-5 col-sm-12">
						<div className="card p-3">
							<h6 className="text_h6 text_semibold">Summary</h6>
							<span className="text_body text_italic">
								{refundableInfo.quantity} Items will be refunded.
							</span>
						</div>
						<div className="card p-3 mt-3">
							<h6 className="text_h6 text_semibold">Refund Amount</h6>
							<TextInput
								type="number"
								startIcon={<TKSign />}
								placeholder="00.00"
								min={0}
								helpText={`BDT ${refundableInfo.amount} is avialable for refund`}
								registerProperty={{
									...register("refundAmount", {
										required: "Refund amount is required!",
										min: { value: 1, message: "Please provide a return amout" },
										valueAsNumber: true,
									}),
								}}
								onFocus={(e) => e.target.select()}
								color={errors?.refundAmount ? "danger" : "secondary"}
								errorMessage={errors.refundAmount?.message}
							/>
							<WxButton
								color="primary"
								variant="fill"
								type="submit"
								disabled={isSubmiting}
							>
								Refund {isSubmiting && <ButtonLoader />}
							</WxButton>
						</div>
					</div>
				</div>
			</form>
		</WxMainLg>
	);
};

export default OrderRefund;
