import WxDrawer from "@components/WxDrawer";
import WxDrawerHeader from "@components/WxDrawer/WxDrawerHeader";
import WxIcon from "@components/WxIcon/WxIcon";
import WxInput from "@components/WxInput";
import WxThumbnail from "@components/WxThumbnail/WxThumbnail";
import { STATUS_CONSTANT } from "config/constants";
import { IProductVariant } from "@interfaces/product.interface";
import { ProductService } from "services/api/products/Product.services";
import Preloader from "services/utils/preloader.service";
import { useEffect, useState } from "react";
import useDebounce from "utils/debouncer";
import { imageURLGenerate } from "utils/utils";
import "./BrowseProduct.scss";

interface IBrowseProductProps {
	drawerOpen: boolean;
	handleClose: () => void;
	addToCart: (product: IProductVariant) => void;
}

const BrowseProduct = ({
	drawerOpen,
	handleClose,
	addToCart,
}: IBrowseProductProps) => {
	const [productList, setProductList] = useState<IProductVariant[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string | null>();

	let search = useDebounce(searchQuery, 300);

	useEffect(() => {
		if (drawerOpen) !!search && getProductList();
		setProductList([]);
	}, [drawerOpen, search]);

	const onClose = () => {
		setProductList([]);
		setSearchQuery(null);
		handleClose();
	};

	const getProductList = () => {
		setIsLoading(true);
		const payload = {
			body: { searchKey: search },
			meta: { offset: 0, limit: 15 },
		};
		ProductService.getProductVariant(payload)
			.then((resp) =>
				setProductList(
					resp.body?.filter((item) => item.status === STATUS_CONSTANT.published)
				)
			)
			.finally(() => setIsLoading(false));
	};

	return (
		<WxDrawer show={drawerOpen} handleClose={handleClose}>
			<div className="wx__browse_product">
				<WxDrawerHeader
					title="Browse Product"
					//   backIconAction={isEditorOpen ? handleEditorClose : null}
					closeIconAction={onClose}
				/>
				<WxInput
					className="mx-4"
					type="search"
					isAutoFocus
					placeholder="Search products"
					startIcon={<WxIcon variants="outlined" icon="search" />}
					onChange={(e: any) => setSearchQuery(e.target.value)}
				/>
				{isLoading ? (
					<Preloader absolutePosition />
				) : !productList.length ? (
					<h6 className="text-center text-muted text_italic">
						Search for product
					</h6>
				) : null}
				<div className="product-tabel wx__responsive_table">
					<table className="wx__table">
						<tbody className="wx__tbody">
							{productList?.map((item) => (
								<tr
									className="wx__tr"
									key={item.variantId || item.id}
									onClick={() => addToCart(item)}
								>
									<td className="wx__td product">
										<div className="d-flex">
											<WxThumbnail
												name="Image"
												src={imageURLGenerate(item?.thumbnail)}
											/>
											<div className="flex-column  text-overflow-hidden ms-3">
												<span className="text_body text_strong text-primary">
													{item.title}
												</span>
												<br />
												{item?.options?.map((v) => (
													<small
														key={v.key}
														className="text_small text-muted"
													>
														{v.key} - {v.value}
													</small>
												))}
												<br />
											</div>
										</div>
									</td>
									<td className="wx__td quantity" align="right">
										{item?.quantity} Available
									</td>
									<td className="wx__td price" align="right">
										{item?.sellingPrice} BDT
									</td>
									<td className="wx__td">
										<WxIcon
											variants="round"
											icon="add_shopping_cart"
											className="cart-icon"
											// onClick={() => addToCart(item)}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</WxDrawer>
	);
};

export default BrowseProduct;
