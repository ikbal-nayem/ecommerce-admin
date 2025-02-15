import TextEditor from '@components/TextEditor/Editor';
import TextInput from '@components/TextInput';
import { Controller, useFormContext } from 'react-hook-form';

const ProductInfo = () => {
	const {
		register,
		control,
		watch,
		formState: { errors },
	} = useFormContext();

	// const hasSummary = watch("hasSummary");

	console.log(watch());
	
	
	return (
		<div className='card p-3 mt-4'>
			<TextInput
				label='Product Title'
				isRequired
				registerProperty={{ ...register('name') }}
				errorMessage={errors.name?.message as string}
				color={errors.name ? 'danger' : 'secondary'}
			/>
			<div className='form_group mb-0'>
				<label>Product Description</label>
				<Controller
					control={control}
					name='description'
					render={({ field: { onChange, value } }) => (
						<TextEditor onEditorChange={onChange} defaultValue={value} noMargin />
					)}
				/>
			</div>

			{/* <div className="mt-3" style={{ maxWidth: "90%" }}>
				<Switch
					label="Add Product Summary"
					checkedTitle="Yes"
					unCheckedTitle="No"
					registerProperty={{ ...register("hasSummary") }}
				/>
			</div> */}

			{/* {hasSummary ? (
			) : null} */}
			<div className='form_group mt-4'>
				<TextInput
					label='Product Summary'
					registerProperty={{
						...register('summary'),
					}}
				/>
			</div>
		</div>
	);
};

export default ProductInfo;
