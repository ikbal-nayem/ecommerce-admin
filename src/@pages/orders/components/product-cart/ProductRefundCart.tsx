import WxIcon from "@components/Icon";
import WxTag from "@components/WxTag";
import WxThumbnail from "@components/WxThumbnail";
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
			<div className="d-flex align-items-center gap-4 p-3">
				<h6 className="text_h6 text_semibold m-0">Products</h6>
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
					className="ms-auto"
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
							<th className="wx__th text-end">Total</th>
						</tr>
					</thead>
					<tbody className="wx__tbody">
						{products?.map((product: any, idx: number) => (
							<tr className="wx__tr" key={product?.variantId || product?.id}>
								<td className="wx__td product">
									<div className="d-flex">
										<WxThumbnail
											name="Image"
											src={imageURLGenerate(product?.thumbnail)}
										/>
										<div className="flex-column ms-3 text-overflow-hidden">
											<span className="text_body text_strong text-primary ">
												{product?.title}
											</span>
											<br />
											{VariantsView(product?.options)}
											<small className="text_small text-muted">
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
			<small className="text_small text-muted">
				{v.key} - {v.value}
			</small>
			<br />
		</Fragment>
	));

export default ProductRefundCart;
