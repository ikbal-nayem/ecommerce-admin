import TextInput from '@components/TextInput';
import WxHr from '@components/WxHr';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import './ProductPricing.scss';

const ProductPricing = () => {
	const {
		register,
		formState: { errors },
		watch,
		setError,
		clearErrors,
	} = useFormContext();

	const [sPrice, rPrice] = watch(['sellingPrice', 'regularPrice']);

	useEffect(() => {
		if (+rPrice > 0 && Number(sPrice) >= Number(rPrice)) {
			setError('sellingPrice', {
				message: "'Selling Price' must be less than 'Compare at price'",
				type: 'invalid',
			});
			setError('regularPrice', {
				message: "'Selling Price' must be less than 'Compare at price'",
				type: 'invalid',
			});
			return;
		}
		clearErrors(['sellingPrice', 'regularPrice']);
	}, [sPrice, rPrice, errors]);

	return (
		<div className='card product_pricing p-3 mt-4'>
			<h6 className='text_semibold text_h6 mb-0'>Pricing</h6>
			<div className='row'>
				<div className='col-md-6 mt-3'>
					<TextInput
						label='Selling price'
						endIcon={'৳'}
						min={0}
						noMargin
						type='number'
						registerProperty={{
							...register('sellingPrice', {
								valueAsNumber: true,
							}),
						}}
						onFocus={(e) => e.target.select()}
						errorMessage={errors.sellingPrice?.message as string}
						color={errors.sellingPrice ? 'danger' : 'secondary'}
					/>
				</div>
				<div className='col-md-6 mt-3'>
					<TextInput
						label='Cost per item'
						endIcon={'৳'}
						min={0}
						noMargin
						type='number'
						registerProperty={{
							...register('costPrice', { valueAsNumber: true }),
						}}
						helpText='Customers won’t see this'
						onFocus={(e) => e.target.select()}
						errorMessage={errors.costPrice?.message as string}
						color={errors.costPrice ? 'danger' : 'secondary'}
					/>
				</div>
				<WxHr />
				<div className='col-md-6'>
					<TextInput
						label='Compare at price'
						endIcon={'৳'}
						noMargin
						min={0}
						type='number'
						registerProperty={{
							...register('regularPrice', {
								valueAsNumber: true,
							}),
						}}
						onFocus={(e) => e.target.select()}
						errorMessage={(errors.regularPrice?.message || errors.comparePrices?.message) as string}
						color={errors.regularPrice || errors.comparePrices ? 'danger' : 'secondary'}
					/>
				</div>
			</div>
		</div>
	);
};

export default ProductPricing;
