import WxSelect from "@components/Select/WxSelect";
import WxInput from "@components/WxInput";
import { Controller } from "react-hook-form";

interface AddressFormProps {
	register?: any;
	errors?: any;
	divisions: any[];
	districts: any[];
	onChangeDivision: any;
	control?: any;
}

export const AddressForm = ({
	register,
	errors,
	divisions,
	districts,
	onChangeDivision,
	control,
}: AddressFormProps) => {
	return (
		<div className="wx__row">
			<div className="wx__col-md-12">
				<WxInput
					registerProperty={{
						...register("title", { required: false }),
					}}
					label="Title"
				/>
			</div>
			<div className="wx__col-md-12">
				<WxInput
					registerProperty={{
						...register("addressLine1", {
							required: true,
						}),
					}}
					label="Address Line 1"
					color={errors?.addressLine1 ? "danger" : "secondary"}
					errorMessage={errors?.addressLine1 && "Address Line 1 is required!"}
				/>
			</div>
			<div className="wx__col-md-12">
				<WxInput
					registerProperty={{
						...register("addressLine2", {
							required: false,
						}),
					}}
					label="Address Line 2"
				/>
			</div>
			<div className="wx__col-md-6">
				<WxInput
					label="Country"
					defaultValue="Bangladesh"
					isDisabled
					registerProperty={{
						...register("country", { required: false }),
					}}
				/>
			</div>
			<div className="wx__col-md-6">
				<WxSelect
					label="Division/State"
					options={divisions}
					placeholder="Select Division"
					valuesKey="object"
					textKey="division_name_eng"
					registerProperty={{
						...register("state", {
							required: true,
							onChange: (e) => onChangeDivision(e.target.value),
						}),
					}}
					color={errors?.state ? "danger" : "secondary"}
					errorMessage={errors?.state && "Division/State is required!"}
				/>
			</div>
			<div className="wx__col-md-6">
				{control ? (
					<Controller
						control={control}
						name="cityName"
						rules={{ required: true }}
						render={({ field: { onChange, value }, fieldState: { error } }) => (
							<WxSelect
								label="District/City"
								options={districts}
								placeholder="Select District/City"
								valuesKey="zilla_name_eng"
								textKey="zilla_name_eng"
								isRequired
								value={value}
								onChange={onChange}
								isDisabled={!districts?.length}
								color={error ? "danger" : "secondary"}
								errorMessage={error && "District/City is required!"}
							/>
						)}
					/>
				) : (
					<WxSelect
						label="District/City"
						options={districts}
						placeholder="Select District/City"
						valuesKey="zilla_name_eng"
						textKey="zilla_name_eng"
						isRequired
						registerProperty={{
							...register("cityName", { required: true }),
						}}
						isDisabled={!districts?.length}
						color={errors?.cityName ? "danger" : "secondary"}
						errorMessage={errors?.cityName && "District/City is required!"}
					/>
				)}
			</div>
			<div className="wx__col-md-6">
				<WxInput
					registerProperty={{
						...register("postCode", { required: true }),
					}}
					label="Post code"
				/>
			</div>

			<div className="wx__col-md-6">
				<WxInput
					registerProperty={{
						...register("phone", {
							required: false,
						}),
					}}
					label="Phone Number"
				/>
			</div>
			<div className="wx__col-md-6">
				<WxInput
					registerProperty={{
						...register("email", {
							required: false,
						}),
					}}
					label="Email Address"
					type="email"
				/>
			</div>
		</div>
	);
};
