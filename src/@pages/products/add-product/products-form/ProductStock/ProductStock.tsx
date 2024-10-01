import WxHr from "@components/WxHr";
import WxInput from "@components/WxInput";
import WxSwitch from "@components/WxSwitch";
import { useFormContext } from "react-hook-form";
import "./ProductStock.scss";

const ProductStock = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const isTrackQuantity = watch("isTrackQuantity");

  return (
		<div className="card product_stock wx__p-3 wx__mt-4">
			<h6 className="wx__text_semibold wx__text_h6">Stock</h6>

			<div style={{ maxWidth: "90%" }}>
				<div className="wx__mb-4">
					<WxSwitch
						label="Do you want to track stock?"
						checkedTitle="Yes"
						unCheckedTitle="No"
						registerProperty={{ ...register("isTrackQuantity") }}
					/>
				</div>
				{/* {isTrackQuantity ? (
          <div className="wx__mb-4">
            <WxSwitch
              label="Do you want to oversell?"
              checkedTitle="Yes"
              unCheckedTitle="No"
              registerProperty={{ ...register("isOverselling") }}
            />
          </div>
        ) : null} */}
			</div>
			{isTrackQuantity ? (
				<div className="row">
					<div className="col-md-6 col-sm-12">
						<WxInput
							type="number"
							label="Quantity"
							noMargin
							min={0}
							placeholder="Stock quantity"
							registerProperty={{
								...register("quantity", { valueAsNumber: true }),
							}}
							errorMessage={errors.quantity?.message}
							color={errors.quantity ? "danger" : "secondary"}
							onFocus={(e) => e.target.select()}
						/>
					</div>
				</div>
			) : null}
			<WxHr className=" wx__mt-4 wx__mb-0" />
			<div className="row">
				<div className="col-md-6 col-sm-12 wx__mt-3">
					<WxInput
						label="Product SKU"
						noMargin
						registerProperty={{ ...register("sku") }}
						onFocus={(e) => e.target.select()}
					/>
				</div>
				<div className="col-md-6 col-sm-12 wx__mt-3">
					<WxInput
						label="Barcode"
						noMargin
						registerProperty={{ ...register("barCode") }}
						onFocus={(e) => e.target.select()}
					/>
				</div>
			</div>
		</div>
	);
};

export default ProductStock;
