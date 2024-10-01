import WxSelect from "@components/Select/WxSelect";
import WxHr from "@components/WxHr";
import WxInput from "@components/WxInput";
import WxSwitch from "@components/WxSwitch";
import { DIMENSIONS } from "config/constants";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import "./ProductDimension.scss";

const weights = [
	{
		title: DIMENSIONS.gm,
	},
	{
		title: DIMENSIONS.kg,
	},
];

const heights = [
	{
		title: DIMENSIONS.cm,
	},
	{
		title: DIMENSIONS.m,
	},
	{
		title: DIMENSIONS.in,
	},
];

const ProductDimension = () => {
	const [hasDimension, setHasDimension] = useState(false);
	const { register, getValues } = useFormContext();

	useEffect(() => {
		const values = getValues(["weight", "width", "height"]);
		setHasDimension(values.some((v) => v));
	}, []);

	return (
		<div className="card product_dimension wx__p-3 wx__mt-4">
			<h6 className="wx__text_semibold wx__text_h6">Product Dimension</h6>
			<div style={{ maxWidth: "90%" }}>
				<WxSwitch
					label="Add product dimension"
					checkedTitle="Yes"
					unCheckedTitle="No"
					isChecked={hasDimension}
					onChange={(e) => setHasDimension(e.target.checked)}
				/>
			</div>
			{hasDimension ? (
				<>
					<WxHr />
					<div className="row">
						<div className="col-lg-4 col-md-6 col-sm-12 d-flex wx__align-items-end">
							<WxInput
								label="Weight"
								noMargin
								type="number"
								min={0}
								registerProperty={{
									...register("weight", { valueAsNumber: true }),
								}}
							/>
							<WxSelect
								options={weights}
								style={{ minWidth: 60 }}
								valuesKey="text"
								textKey="title"
								noMargin
								registerProperty={{ ...register("weightUnit") }}
							/>
						</div>
						<div className="col-lg-4 col-md-6 col-sm-12 d-flex wx__align-items-end">
							<WxInput
								label="Width"
								noMargin
								type="number"
								min={0}
								registerProperty={{
									...register("width", { valueAsNumber: true }),
								}}
							/>
							<WxSelect
								options={heights}
								style={{ minWidth: 60 }}
								valuesKey="text"
								textKey="title"
								noMargin
								registerProperty={{ ...register("widthUnit") }}
							/>
						</div>
						<div className="col-lg-4 col-md-6 col-sm-12 d-flex wx__align-items-end">
							<WxInput
								label="Height"
								noMargin
								type="number"
								min={0}
								registerProperty={{
									...register("height", { valueAsNumber: true }),
								}}
							/>
							<WxSelect
								options={heights}
								style={{ minWidth: 60 }}
								valuesKey="text"
								textKey="title"
								noMargin
								registerProperty={{ ...register("heightUnit") }}
							/>
						</div>
					</div>
				</>
			) : null}
		</div>
	);
};

export default ProductDimension;
