import WxIcon from "@components/WxIcon/WxIcon";
import WxInput from "@components/WxInput";
import { IFilePayload } from "@interfaces/common.interface";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import generateVariants from "utils/generateVariantList";
import { imageURLGenerate } from "utils/utils";
import "./ProductVariants.scss";
import VariantImage from "./VariantImage";

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
			const variants = getValues("variants");
			const has = variants?.some(
				(v: any, idx: number) => idx !== index && v?.sku === sku
			);
			has
				? setError(`variants.${index}.sku`, {
						type: "unique",
						message: "SKU already exists",
				  })
				: clearErrors(`variants.${index}.sku`);
		}
	}, [sku, errors]);

	const sPriceLabel = `variants.${index}.sellingPrice`;
	const rPriceLabel = `variants.${index}.regularPrice`;

	const [sPrice, rPrice] = watch([sPriceLabel, rPriceLabel]);

	useEffect(() => {
		if (+rPrice > 0 && +sPrice >= +rPrice) {
			setError(sPriceLabel, {
				message: "'Selling Price' must be less than 'Compare at price'",
				type: "invalid",
			});
			setError(rPriceLabel, {
				message: "'Selling Price' must be less than 'Compare at price'",
				type: "invalid",
			});
			return;
		}
		clearErrors([sPriceLabel, rPriceLabel]);
	}, [sPrice, rPrice, errors]);

	const image = getValues(`variants.${index}.image`);

	return (
		<tr className="wx__tr">
			<td className="wx__td image-td">
				<div
					className="image-box"
					role="button"
					onClick={() => (isEditForm ? hanleChooseImage(index) : null)}
				>
					{image ? (
						<img
							src={imageURLGenerate(image?.previewUrl)}
							alt="variant image"
							width="100%"
						/>
					) : (
						<div className="dummy-image">
							<WxIcon icon="add_photo_alternate" />
						</div>
					)}
				</div>
			</td>
			<td className="wx__td variant-name">
				<p className="wx__mb-0 wx__d-flex wx__align-items-center">
					{variant?.options?.map((val: any) => val?.value)?.join(" / ") ||
						"N/A"}
				</p>
			</td>
			<td className="wx__td quentity" style={{ width: 100 }}>
				<WxInput
					placeholder="Qty."
					type="number"
					min={0}
					registerProperty={{
						...register(`variants.${index}.quantity`, { valueAsNumber: true }),
					}}
					errorMessage={errors.quantity?.message}
					color={errors.quantity ? "danger" : "secondary"}
					onFocus={(e) => e.target.select()}
				/>
			</td>
			<td className="wx__td selling-price">
				<div>
					<WxInput
						type="number"
						placeholder="Price"
						min={0}
						registerProperty={{
							...register(sPriceLabel, {
								valueAsNumber: true,
							}),
						}}
						errorMessage={errors.variants?.[index]?.sellingPrice?.message}
						color={
							errors.variants?.[index]?.sellingPrice ? "danger" : "secondary"
						}
						onFocus={(e) => e.target.select()}
					/>
				</div>
			</td>
			<td className="wx__td regular-price">
				<WxInput
					type="number"
					placeholder="Price"
					min={0}
					registerProperty={{
						...register(rPriceLabel, {
							valueAsNumber: true,
						}),
					}}
					errorMessage={errors.variants?.[index]?.regularPrice?.message}
					color={
						errors.variants?.[index]?.regularPrice ? "danger" : "secondary"
					}
					onFocus={(e) => e.target.select()}
				/>
			</td>
			<td className="wx__td sku">
				<WxInput
					registerProperty={{
						...register(`variants.${index}.sku`),
					}}
					errorMessage={errors.variants?.[index]?.sku?.message}
					color={errors.variants?.[index]?.sku ? "danger" : "secondary"}
					onFocus={(e) => e.target.select()}
				/>
			</td>
			<td className="wx__td barcode">
				<WxInput
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

	const hasVariant = watch("hasVariant");
	const options = watch("options");

	useEffect(() => {
		if (options?.length === 1 && !options?.[0]?.values?.length) return;
		let [prevVariantList, parentRegular, parentSelling] = getValues([
			"variants",
			"regularPrice",
			"sellingPrice",
		]);
		prevVariantList = prevVariantList?.length ? [...prevVariantList] : [];
		let isTyping = checkTyping(options, prevOption.current);
		const newVariantList = makeVariantList(
			options,
			prevVariantList,
			parentRegular,
			parentSelling,
			isTyping
		);
		setValue("variants", [...newVariantList]);
		setVariantList([...newVariantList]);
		prevOption.current = options?.length ? [...options] : [];
	}, [options]);

	const onModalClose = () => {
		variantIndex.current = null;
		setIsModalOpen(false);
	};

	const onAddNewImage = (imageList: IFilePayload[]) => {
		setValue("images", imageList);
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
		<div className="wx__card product_variants wx__p-3 wx__mt-4">
			<h6 className="wx__text_semibold wx__text_h6">
				Variants <WxIcon icon="help" />
			</h6>
			<div className="variants_body wx__responsive_table">
				<table className="wx__table">
					<thead className="wx__thead">
						<tr className="wx__tr">
							<th />
							<th className="wx__th variant-name">Variant</th>
							<th className="wx__th quentity">Quantity</th>
							<th className="wx__th selling-price">Selling Price</th>
							<th className="wx__th regular-price">Regular Price</th>
							<th className="wx__th sku">SKU</th>
							<th className="wx__th barcode">Barcode</th>
						</tr>
					</thead>
					<tbody className="wx__tbody">
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

const makeVariantList = (
	options = [],
	prevVariantList,
	parentRegular,
	parentSelling,
	isTyping = false
) => {
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
				(acc: boolean, cur: any) =>
					!acc ? acc : op.map((o) => o.value).includes(cur.value),
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
			quantity: 0,
			regularPrice: parentRegular,
			sellingPrice: parentSelling,
		};
	});
};

export default ProductVariants;
