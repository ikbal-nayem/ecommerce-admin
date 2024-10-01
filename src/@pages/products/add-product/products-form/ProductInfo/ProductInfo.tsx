import WxEditor from "@components/WxEditor/WxEditor";
import WxInput from "@components/WxInput";
import WxSwitch from "@components/WxSwitch";
import { Controller, useFormContext } from "react-hook-form";
import "./ProductInfo.scss";

const ProductInfo = () => {
	const {
		register,
		control,
		watch,
		formState: { errors },
	} = useFormContext();

	const hasSummary = watch("hasSummary");

	return (
		<div className="card p-3 mt-4">
			<WxInput
				label="Product Title"
				isRequired
				className=""
				registerProperty={{ ...register("title") }}
				errorMessage={errors.title?.message}
				color={errors.title ? "danger" : "secondary"}
			/>
			<div className="form_group">
				<label>Product Description</label>
				<Controller
					control={control}
					name="description"
					render={({ field: { onChange, value } }) => (
						<WxEditor onEditorChange={onChange} defaultValue={value} />
					)}
				/>
			</div>

			<div className="mt-3" style={{ maxWidth: "90%" }}>
				<WxSwitch
					label="Add Product Summary"
					checkedTitle="Yes"
					unCheckedTitle="No"
					registerProperty={{ ...register("hasSummary") }}
				/>
			</div>

			{hasSummary ? (
				<div className="form_group mt-4">
					<label>Product Summary</label>
					<Controller
						control={control}
						name="summary"
						render={({ field: { onChange, value } }) => (
							<WxEditor onEditorChange={onChange} defaultValue={value} />
						)}
					/>
				</div>
			) : null}
		</div>
	);
};

export default ProductInfo;
