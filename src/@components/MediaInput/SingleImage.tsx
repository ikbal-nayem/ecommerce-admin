import Icon from '@components/Icon';
import clsx from 'clsx';
import { ChangeEvent, FC, memo, useEffect, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { genetartMediaURL } from 'utils/utils';

type SingleImageProps = {
	control?: any;
	label?: string;
	img?: string;
	name: string;
	disabled?: boolean;
	isRequired?: boolean | string;
	defaultImage?: string | null;
	onChange?: (file: File | null | undefined, name?: string) => void;
	isError?: boolean;
	errorMessage?: string;
	helpText?: string;
	editImage?: boolean;
	maxImageSize?: number;
	maxWidthOrHeight?: number;
	noMargin?: boolean;
};

const ImageUpload: FC<SingleImageProps> = memo(
	({
		label,
		name,
		img,
		disabled,
		isRequired,
		defaultImage,
		onChange,
		isError,
		errorMessage,
		helpText,
		editImage,
		maxImageSize,
		maxWidthOrHeight,
		noMargin,
	}) => {
		const [image, setImage] = useState<File | string | null | undefined>(img || defaultImage);
		const [isEditorOpen, setEditorOpen] = useState<boolean>(false);
		const imgRef = useRef<HTMLInputElement>(null);
		const isInit = useRef<boolean>(true);
		const tempImageHolder = useRef<ChangeEvent<HTMLInputElement> | null>(null);

		useEffect(() => {
			if (!isInit.current) {
				setImage(img);
			} else isInit.current = false;
		}, [img, isInit]);

		const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
			if (editImage) {
				tempImageHolder.current = e;
				setEditorOpen(true);
				return;
			}
			const f = e.target.files?.[0];
			handleImageChange(f);
		};

		const handleImageChange = (imgFile: File | undefined) => {
			setImage(imgFile);
			onChange && onChange(imgFile, name);
			editImage && onEditorClose();
		};

		const onCancle = () => {
			setImage(null);
			imgRef.current && (imgRef.current.value = '');
			onChange && onChange(null, name);
		};

		const onEditorClose = () => {
			tempImageHolder.current = null;
			imgRef.current && (imgRef.current.value = '');
			setEditorOpen(false);
		};

		return (
			<>
				<div
					className={clsx('fv-row fv-plugins-icon-container', {
						'mb-6': !noMargin,
					})}
				>
					{label ? (
						<label className='d-block fw-semibold fs-5 mb-2'>
							<span className={clsx([{ required: isRequired }])}>{label}</span>
						</label>
					) : null}
					<div
						className='image-input image-input-empty image-input-outline image-input-placeholder'
						style={{
							backgroundImage: image ? 'none' : `url("/media/svg/files/blank-image.svg")`,
						}}
						data-kt-image-input='true'
					>
						<div
							className={clsx('image-input-wrapper border border-2 shadow-none w-125px h-125px', {
								'border-danger': isError,
							})}
							style={{
								backgroundImage: image
									? `url('${image instanceof File ? URL.createObjectURL(image) : genetartMediaURL(image)}')`
									: 'none',
								backgroundSize: '100%',
								backgroundPosition: 'center',
							}}
						/>
						{disabled ? null : (
							<>
								<label
									className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
									data-kt-image-input-action='change'
									data-bs-toggle='tooltip'
									aria-label='Change image'
									data-bs-original-title='Change image'
									data-kt-initialized='1'
								>
									<Icon icon='edit' />
									<input
										type='file'
										name='avatar'
										accept='.png, .jpg, .jpeg'
										disabled={disabled}
										ref={imgRef}
										onChange={onImageChange}
									/>
									<input type='hidden' name='avatar_remove' disabled={disabled} />
								</label>
								<span
									className={clsx([
										`btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow`,
										{ 'd-flex': !!image },
									])}
									data-kt-image-input-action='cancel'
									data-bs-toggle='tooltip'
									aria-label='Cancel image'
									data-bs-original-title='Cancel image'
									data-kt-initialized='1'
									onClick={onCancle}
								>
									<Icon icon='close' />
								</span>
							</>
						)}
					</div>
					{isError ? (
						<div className='invalid-feedback d-block'>{errorMessage}</div>
					) : !!helpText ? (
						<div className='form-text text-gray-600'>{helpText}</div>
					) : null}
				</div>
			</>
		);
	}
);

const SingleImage: FC<SingleImageProps> = ({ control, ...props }) => {
	if (!control) return <ImageUpload {...props} />;

	const { isRequired, name, defaultImage, onChange } = props;
	return (
		<Controller
			control={control}
			name={name as string}
			defaultValue={defaultImage || null}
			rules={{ required: isRequired }}
			render={({ field }) => {
				return (
					<ImageUpload
						{...props}
						defaultImage={null}
						img={field?.value}
						onChange={(f, n) => {
							field.onChange(f);
							onChange && onChange(f, n);
						}}
					/>
				);
			}}
		/>
	);
};

export { SingleImage };
