import Switch from '@components/Switch';
import TextInput from '@components/TextInput';
import WxHr from '@components/WxHr';
import { useFormContext } from 'react-hook-form';

const ProductStock = () => {
	const {
		register,
		watch,
		formState: { errors },
	} = useFormContext();

	const trackStock = watch('trackStock');

	return (
		<div className='card p-3 my-4'>
			<h6 className='text_semibold text_h6'>Stock</h6>

			<div style={{ maxWidth: '90%' }}>
				<div className='mb-4'>
					<Switch
						label='Do you want to track stock?'
						checkedTitle='Yes'
						unCheckedTitle='No'
						registerProperty={{ ...register('trackStock') }}
					/>
				</div>
				{/* {trackStock ? (
          <div className="mb-4">
            <Switch
              label="Do you want to oversell?"
              checkedTitle="Yes"
              unCheckedTitle="No"
              registerProperty={{ ...register("isOverselling") }}
            />
          </div>
        ) : null} */}
			</div>
			{trackStock ? (
				<div className='row'>
					<div className='col-md-6 col-sm-12'>
						<TextInput
							type='number'
							label='Quantity'
							noMargin
							min={0}
							placeholder='Stock quantity'
							registerProperty={{
								...register('stock', { valueAsNumber: true }),
							}}
							errorMessage={errors.stock?.message as string}
							color={errors.stock ? 'danger' : 'secondary'}
							onFocus={(e) => e.target.select()}
						/>
					</div>
				</div>
			) : null}
			<WxHr className=' mt-4 mb-0' />
			<div className='row'>
				<div className='col-md-6 col-sm-12 mt-3'>
					<TextInput
						label='Product SKU'
						noMargin
						registerProperty={{ ...register('sku') }}
						onFocus={(e) => e.target.select()}
					/>
				</div>
				<div className='col-md-6 col-sm-12 mt-3'>
					<TextInput
						label='Barcode'
						noMargin
						registerProperty={{ ...register('barCode') }}
						onFocus={(e) => e.target.select()}
					/>
				</div>
			</div>
		</div>
	);
};

export default ProductStock;
