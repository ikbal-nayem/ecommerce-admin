import "./ProductCart.scss";
import WxIcon from "@components/Icon";
import TextInput from "@components/TextInput";
import WxThumbnail from "@components/Thumbnail";
import { IProductVariant } from "@interfaces/product.interface";
import { imageURLGenerate } from "utils/utils";
import { Fragment } from "react";
import { useSelector } from "react-redux";

interface ProductCart {
	selectedProduct?: any[];
	removeFromCart?: (product: any, index?: number) => void;
	updateQuantity?: (product: any, quantity: number) => void;
	isEditable?: boolean;
	previousInfo?: IProductVariant[];
}

const ProductCart = ({
	selectedProduct,
	removeFromCart,
	updateQuantity,
	isEditable = true,
	previousInfo,
}: ProductCart) => {
	const { store_currency_code } = useSelector(
		(data: any) => data?.user?.user_data
	);

	if (!selectedProduct?.length) return null;

	return (
		<div className="wx__order_product_cart wx__responsive_table">
			<table className="wx__table">
				<thead className="wx__thead">
					<tr className="wx__tr">
						<th className="wx__th product">Product</th>
						<th className="wx__th unit">Unit</th>
						<th className="wx__th total">Total</th>
					</tr>
				</thead>
				<tbody className="wx__tbody">
					{selectedProduct?.map((product: any, idx: number) => (
						<tr className="wx__tr" key={product?.variantId || product?.id}>
							<td className="wx__td product">
								<div className="d-flex">
									<WxThumbnail
										name="Image"
										src={imageURLGenerate(product?.thumbnail)}
									/>
									<div className="flex-column ms-3 td-overflow-hidden">
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
							<td className="wx__td unit">
								{isEditable ? (
									<div className="d-flex align-items-start">
										<TextInput
											type="number"
											min={1}
											value={product?.quantity}
											onChange={(e) =>
												updateQuantity(idx, parseInt(e.target.value))
											}
											noMargin
											onFocus={(e) => e.target.select()}
											helpText={
												previousInfo?.find((val) => val.id === product?.id) &&
												previousInfo?.find((val) => val.id === product?.id)
													?.quantity !== product?.quantity
													? `Original qty. ${
															previousInfo?.find(
																(val) => val.id === product?.id
															)?.quantity
													  }`
													: ""
											}
											color={
												!product?.quantity || product?.quantity < 1
													? "danger"
													: "secondary"
											}
										/>
										<div className="d-flex flex-column">
											<WxIcon
												icon="expand_less"
												className="bg-light"
												onClick={() =>
													updateQuantity(idx, product?.quantity + 1)
												}
											/>
											<WxIcon
												icon="expand_more"
												className="bg-light"
												onClick={() =>
													updateQuantity(
														idx,
														product?.quantity <= 1 ? 1 : product?.quantity - 1
													)
												}
											/>
										</div>
									</div>
								) : (
									product?.quantity
								)}
							</td>
							<td className="wx__td total">
								{store_currency_code}&nbsp;{product?.subTotal}
							</td>
							{isEditable ? (
								<td className="wx__td cancel">
									<WxIcon
										variants="round"
										icon="close"
										onClick={() => removeFromCart(product, idx)}
									/>
								</td>
							) : null}
						</tr>
					))}
				</tbody>
			</table>
		</div>
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

export default ProductCart;
