import Icon from '@components/Icon';
import TextInput from '@components/TextInput';
import { IFilePayload } from '@interfaces/common.interface';
import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import generateVariants from 'utils/generateVariantList';
import { imageURLGenerate } from 'utils/utils';
import './ProductVariants.scss';
import VariantImage from './VariantImage';

const VariantRow = ({
	index,
	variant,
	isEditForm,
	getValues,
	register,
	errors,
	setError,
	clearErrors,
	watch,
	hanleChooseImage,
}) => {
	const sku = watch(`variants.${index}.sku`);

	useEffect(() => {
		if (sku) {
			const variants = getValues('variants');
			const has = variants?.some((v: any, idx: number) => idx !== index && v?.sku === sku);
			has
				? setError(`variants.${index}.sku`, {
						type: 'unique',
						message: 'SKU already exists',
				  })
				: clearErrors(`variants.${index}.sku`);
		}
	}, [sku, errors]);

	const rPriceLabel = `variants.${index}.price`;
	const dPriceLabel = `variants.${index}.discountPrice`;

	const [sPrice, rPrice] = watch([dPriceLabel, rPriceLabel]);

	useEffect(() => {
		if (+rPrice > 0 && +sPrice >= +rPrice) {
			setError(dPriceLabel, {
				message: "'Selling Price' must be less than 'Compare at price'",
				type: 'invalid',
			});
			setError(rPriceLabel, {
				message: "'Selling Price' must be less than 'Compare at price'",
				type: 'invalid',
			});
			return;
		}
		clearErrors([dPriceLabel, rPriceLabel]);
	}, [sPrice, rPrice, errors]);

	const image = getValues(`variants.${index}.image`);

	return (
		<tr className='wx__tr'>
			<td className='image-td'>
				<div
					className='image-box'
					role='button'
					onClick={() => (isEditForm ? hanleChooseImage(index) : null)}
				>
					{image ? (
						<img src={imageURLGenerate(image?.previewUrl)} alt='variant image' width='100%' />
					) : (
						<div className='dummy-image'>
							<Icon icon='add_photo_alternate' />
						</div>
					)}
				</div>
			</td>
			<td className='variant-name'>
				<p className='mb-0 d-flex align-items-center'>
					{variant?.options?.map((val: any) => val?.value)?.join(' / ') || 'N/A'}
				</p>
			</td>
			<td className='quentity' style={{ width: 100 }}>
				<TextInput
					placeholder='Qty.'
					type='number'
					min={0}
					registerProperty={{
						...register(`variants.${index}.stock`, { valueAsNumber: true }),
					}}
					errorMessage={errors.stock?.message}
					color={errors.stock ? 'danger' : 'secondary'}
					onFocus={(e) => e.target.select()}
				/>
			</td>
			<td className='price'>
				<div>
					<TextInput
						type='number'
						placeholder='Price'
						min={0}
						registerProperty={{
							...register(dPriceLabel, {
								valueAsNumber: true,
							}),
						}}
						errorMessage={errors.variants?.[index]?.price?.message}
						color={errors.variants?.[index]?.price ? 'danger' : 'secondary'}
						onFocus={(e) => e.target.select()}
					/>
				</div>
			</td>
			<td className='price'>
				<TextInput
					type='number'
					placeholder='Price'
					min={0}
					registerProperty={{
						...register(rPriceLabel, {
							valueAsNumber: true,
						}),
					}}
					errorMessage={errors.variants?.[index]?.discountPrice?.message}
					color={errors.variants?.[index]?.discountPrice ? 'danger' : 'secondary'}
					onFocus={(e) => e.target.select()}
				/>
			</td>
			<td className='sku'>
				<TextInput
					registerProperty={{
						...register(`variants.${index}.sku`),
					}}
					errorMessage={errors.variants?.[index]?.sku?.message}
					color={errors.variants?.[index]?.sku ? 'danger' : 'secondary'}
					onFocus={(e) => e.target.select()}
				/>
			</td>
			<td className='barcode'>
				<TextInput
					registerProperty={{ ...register(`variants.${index}.barCode`) }}
					onFocus={(e) => e.target.select()}
				/>
			</td>
		</tr>
	);
};

const ProductVariants = ({ isEditForm }: { isEditForm?: boolean }) => {
	const [variantList, setVariantList] = useState<any[]>([]);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const prevOption = useRef<any[]>([]);
	const variantIndex = useRef<number | null>(null);
	const {
		register,
		watch,
		setValue,
		getValues,
		setError,
		clearErrors,
		formState: { errors },
	} = useFormContext();

	const hasVariant = watch('hasVariant');
	const options = watch('options');

	useEffect(() => {
		if (options?.length === 1 && !options?.[0]?.values?.length) return;
		let [prevVariantList, parentPrice, parentDiscount] = getValues(['variants', 'discountPrice', 'price']);
		prevVariantList = prevVariantList?.length ? [...prevVariantList] : [];
		let isTyping = checkTyping(options, prevOption.current);
		const newVariantList = makeVariantList(options, prevVariantList, parentPrice, parentDiscount, isTyping);
		setValue('variants', [...newVariantList]);
		setVariantList([...newVariantList]);
		prevOption.current = options?.length ? [...options] : [];
	}, [options]);

	const onModalClose = () => {
		variantIndex.current = null;
		setIsModalOpen(false);
	};

	const onAddNewImage = (imageList: IFilePayload[]) => {
		setValue('images', imageList);
	};

	const hanleChooseImage = (idx: number) => {
		variantIndex.current = idx;
		setIsModalOpen(true);
	};

	const onSelectImage = (imageObject: IFilePayload[], index: number) => {
		setValue(`variants.${index}.image`, imageObject?.[0]);
		setValue(`variants.${index}.imageId`, imageObject?.[0]?.id || null);
		onModalClose();
	};

	if (!hasVariant || variantList?.length === 0) return null;

	return (
		<div className='card product_variants p-3 mt-4'>
			<h6 className='text_semibold text_h6'>
				Variants <Icon icon='help' />
			</h6>
			<div className='variants_body'>
				<table className='wx__table'>
					<thead className='wx__thead'>
						<tr>
							<th />
							<th className='text-muted variant-name'>Variant</th>
							<th className='text-muted quentity'>Quantity</th>
							<th className='text-muted price'>Price</th>
							<th className='text-muted price'>Discount Price</th>
							<th className='text-muted sku'>SKU</th>
							<th className='text-muted barcode'>Barcode</th>
						</tr>
					</thead>
					<tbody className='wx__tbody'>
						{variantList.map((variant, idx) => (
							<VariantRow
								key={idx}
								index={idx}
								isEditForm={isEditForm}
								variant={variant}
								getValues={getValues}
								register={register}
								watch={watch}
								errors={errors}
								setError={setError}
								clearErrors={clearErrors}
								hanleChooseImage={hanleChooseImage}
							/>
						))}
					</tbody>
				</table>
			</div>
			<VariantImage
				isOpen={isModalOpen}
				getValues={getValues}
				onClose={onModalClose}
				variantIndex={variantIndex}
				onSelectImage={onSelectImage}
				onAddNewImage={onAddNewImage}
			/>
		</div>
	);
};

const checkTyping = (options = [], prevOption) => {
	let isTyping = false;
	options?.forEach((newOp) => {
		const preOp = prevOption?.find((val: any) => val.id === newOp.id);
		if (preOp) {
			newOp.values?.forEach((newVal: any) => {
				const preVal = preOp.values?.find((val: any) => val.id === newVal.id);
				if (newVal && preVal && newVal.name !== preVal.name) {
					isTyping = true;
				}
			});
		}
	});
	return isTyping;
};

const makeVariantList = (options = [], prevVariantList, parentPrice, parentDiscount, isTyping = false) => {
	prevVariantList = [...prevVariantList];
	return generateVariants(options).map((op, opIdx) => {
		if (isTyping) {
			return {
				...prevVariantList[opIdx],
				options: op,
			};
		}
		const prevVariantIdx = prevVariantList?.findIndex((p: any) =>
			p.options?.reduce(
				(acc: boolean, cur: any) => (!acc ? acc : op.map((o) => o.value).includes(cur.value)),
				true
			)
		);
		if (prevVariantIdx !== -1) {
			const newVariant = {
				...prevVariantList[prevVariantIdx],
				options: op,
			};
			prevVariantList.splice(prevVariantIdx, 1);
			return newVariant;
		}
		return {
			options: op,
			stock: 0,
			discountPrice: parentPrice,
			price: parentDiscount,
		};
	});
};

export default ProductVariants;
