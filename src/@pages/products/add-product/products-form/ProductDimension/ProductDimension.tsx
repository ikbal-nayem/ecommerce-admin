import WxSelect from "@components/Select/Select";
import WxHr from "@components/WxHr";
import TextInput from "@components/TextInput";
import Switch from "@components/Switch";
import { DIMENSIONS } from "config/constants";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

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
		<div className="card p-3 my-4">
			<h6 className="text_semibold text_h6">Product Dimension</h6>
			<div style={{ maxWidth: "90%" }}>
				<Switch
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
						<div className="col-lg-4 col-md-6 col-sm-12 d-flex align-items-end">
							<TextInput
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
						<div className="col-lg-4 col-md-6 col-sm-12 d-flex align-items-end">
							<TextInput
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
						<div className="col-lg-4 col-md-6 col-sm-12 d-flex align-items-end">
							<TextInput
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
