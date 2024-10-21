import TextInput from '@components/TextInput';
import WxHr from '@components/WxHr';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

const ProductPricing = () => {
	const {
		register,
		formState: { errors },
		watch,
		setError,
		clearErrors,
	} = useFormContext();

	const [price, dPrice] = watch(['price', 'discountPrice']);

	useEffect(() => {
		if (+dPrice > 0 && Number(dPrice) >= Number(price)) {
			setError('price', {
				message: "'Regular Price' must be gretter than 'Discount price'",
				type: 'invalid',
			});
			setError('discountPrice', {
				message: "'Discount Price' must be less than 'Regular price'",
				type: 'invalid',
			});
			return;
		}
		clearErrors(['price', 'discountPrice']);
	}, [price, dPrice, errors]);

	return (
		<div className='card product_pricing p-3 mt-4'>
			<h6 className='text_semibold text_h6 mb-0'>Pricing</h6>
			<div className='row'>
				<div className='col-md-6 mt-3'>
					<TextInput
						label='Regular price'
						startIcon={'৳'}
						min={0}
						noMargin
						type='number'
						isRequired
						registerProperty={{
							...register('price', {
								valueAsNumber: true,
							}),
						}}
						onFocus={(e) => e.target.select()}
						errorMessage={errors.price?.message as string}
						color={errors.price ? 'danger' : 'secondary'}
					/>
				</div>
				<div className='col-md-6 mt-3'>
					<TextInput
						label='Discount price'
						startIcon={'৳'}
						min={0}
						noMargin
						type='number'
						registerProperty={{
							...register('discountPrice', { valueAsNumber: true }),
						}}
						onFocus={(e) => e.target.select()}
						errorMessage={errors.discountPrice?.message as string}
						color={errors.discountPrice ? 'danger' : 'secondary'}
					/>
				</div>
				<WxHr />
				<div className='col-md-6'>
					<TextInput
						label='Cost price'
						startIcon={'৳'}
						noMargin
						min={0}
						type='number'
						registerProperty={{
							...register('costPrice', {
								valueAsNumber: true,
							}),
						}}
						helpText='Customers won’t see this'
						onFocus={(e) => e.target.select()}
						errorMessage={errors.costPrice?.message as string}
						color={errors.costPrice || errors.comparePrices ? 'danger' : 'secondary'}
					/>
				</div>
			</div>
		</div>
	);
};

export default ProductPricing;
