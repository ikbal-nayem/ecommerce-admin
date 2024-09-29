import WxIcon from "@components/WxIcon/WxIcon";
import WxTag from "@components/WxTag";
import WxThumbnail from "@components/WxThumbnail/WxThumbnail";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { statusColorMapping } from "utils/colorMap";
import { imageURLGenerate } from "utils/utils";
import "./ProductCart.scss";

interface ProductRefundCartProps {
	orderStatus?: string;
	products?: any[];
	refundItems?: any[];
	handleIncrease?: (index: number) => void;
	handleDecrease?: (index: number) => void;
}

const ProductRefundCart = ({
	orderStatus,
	products,
	refundItems,
	handleIncrease,
	handleDecrease,
}: ProductRefundCartProps) => {
	const { store_currency_code } = useSelector(
		(data: any) => data?.user?.user_data
	);

	return (
		<>
			<div className="wx__d-flex wx__align-items-center wx__gap-4 wx__p-3">
				<h6 className="wx__text_h6 wx__text_semibold wx__m-0">Products</h6>
				{orderStatus ? (
					<div>
						<WxTag
							label={orderStatus}
							color={statusColorMapping(orderStatus)}
						/>
					</div>
				) : null}
				{/* <WxIcon
					variants="round"
					className="wx__ms-auto"
					role="button"
					icon="more_vert"
				/> */}
			</div>
			<div className="wx__responsive_table wx__table_noPopup">
				<table className="wx__table wx__refund_table">
					<thead className="wx__thead">
						<tr className="wx__tr">
							<th className="wx__th">Product</th>
							<th className="wx__th">Unit</th>
							<th className="wx__th wx__text-end">Total</th>
						</tr>
					</thead>
					<tbody className="wx__tbody">
						{products?.map((product: any, idx: number) => (
							<tr className="wx__tr" key={product?.variantId || product?.id}>
								<td className="wx__td product">
									<div className="wx__d-flex">
										<WxThumbnail
											name="Image"
											src={imageURLGenerate(product?.thumbnail)}
										/>
										<div className="wx__flex-column wx__ms-3 text-overflow-hidden">
											<span className="wx__text_body wx__text_strong wx__text-primary ">
												{product?.title}
											</span>
											<br />
											{VariantsView(product?.options)}
											<small className="wx__text_small wx__text-muted">
												Unit Price ৳
												{product?.sellingPrice || product?.regularPrice}
											</small>
										</div>
									</div>
								</td>
								<td className="wx__td" width={108}>
									<div className="unit">
										<WxIcon icon="remove" onClick={() => handleDecrease(idx)} />
										{refundItems?.[idx]?.quantity}/{product?.quantity}
										<WxIcon icon="add" onClick={() => handleIncrease(idx)} />
									</div>
								</td>
								<td className="wx__td" align="right">
									{store_currency_code}&nbsp;{product?.subTotal}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
};

const VariantsView = (options: { key: string; value: string }[]) =>
	options?.map((v) => (
		<Fragment key={v.key}>
			<small className="wx__text_small wx__text-muted">
				{v.key} - {v.value}
			</small>
			<br />
		</Fragment>
	));

export default ProductRefundCart;
