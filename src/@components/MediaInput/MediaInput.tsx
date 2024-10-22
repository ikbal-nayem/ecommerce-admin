import Icon from '@components/Icon';
import { FC, Fragment, useEffect, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { genetartMediaURL } from 'utils/utils';
import './MediaInput.scss';

interface IMediaInputProps {
	control?: any;
	name?: string;
	defaultImage?: string | string[];
	isRequired?: boolean;
	fileList?: any[];
	multiple?: boolean;
	maxSelect?: number;
	dragNDropFor?: string;
	dragNDropText?: string;
	recommendedHeightWidth?: string;
	accept?: string;
	onChange?: (file: File | FileList | null | string | string[], name?: string) => void;
}

const MediaInput = ({
	name,
	fileList = [],
	multiple,
	maxSelect,
	dragNDropFor = 'image',
	dragNDropText = 'images',
	recommendedHeightWidth = '1000px X 1000px',
	accept = 'image/png, image/jpg, image/jpeg',
	onChange,
}: IMediaInputProps) => {
	const [fileItems, setFileItems] = useState<any[]>(fileList || []);
	const [draggedItem, setDraggedItem] = useState<any>(null);
	const [isLimitExceeded, setIsLimitExceeded] = useState<boolean>(false);
	const shouldResetNext = useRef(true);
	const isInit = useRef(true);

	useEffect(() => {
		if (isInit.current) {
			setFileItems(fileList);
			isInit.current = false;
		}
	}, [fileList, isInit.current]);

	// maximum image can select
	maxSelect = !multiple ? 1 : maxSelect === -1 ? 999 : maxSelect;

	const onDragStart = (e, index: number, id: any) => {
		const moveElement = document.getElementById(id);
		moveElement.classList.add('drag-element');
		setDraggedItem(fileItems[index]);
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/html', moveElement);
		e.dataTransfer.setDragImage(moveElement, 10, 10);
	};

	const onDragOver = (e, index) => {
		if (!multiple) return;
		e.preventDefault();
		const draggedOverItem = fileItems[index];
		if (draggedItem === draggedOverItem) return;
		let reorderedItems = fileItems.filter((item) => item !== draggedItem);
		reorderedItems.splice(index, 0, draggedItem);
		setFileItems(reorderedItems);
	};

	const onDragEnd = (id: string) => {
		const moveElement = document.getElementById(id);
		moveElement.classList.remove('drag-element');
		setDraggedItem(null);
		// onOrderChange(fileItems);
	};

	const onRemove = (idx: number) => {
		setFileItems((prev) => {
			prev.splice(idx, 1);
			onChange(multiple ? prev : prev?.length ? prev[0] : null, name);
			return prev;
		});
	};

	const onOrderChange = () => {};

	const onFileSelect = (file: FileList) => {
		if (!file) return;

		// if (dragNDropFor === 'image') {
		// 	if (maxSelect && file?.length + fileItems?.length > maxSelect) {
		// 		setIsLimitExceeded(true);
		// 		file = Array.prototype.slice.call(
		// 			file,
		// 			0,
		// 			maxSelect - fileItems?.length < 0 ? 0 : maxSelect - fileItems?.length
		// 		);
		// 	}
		// }

		if (!multiple) {
			setFileItems([file[0]]);
			onChange(file[0], name);
			return;
		}
		setFileItems((prev) => [...prev, ...Object.values(file)]);
		onChange(file, name);
	};

	return (
		<Fragment>
			{!(maxSelect <= fileItems?.length) ? (
				<div id='upload-container' className='file-area d-flex align-items-center justify-content-center'>
					<div className='file-dummy'>
						<div className='success'>Great, your files are selected. Keep on.</div>
						<div className='default d-flex align-items-center justify-content-center'>
							<Icon icon='add_photo_alternate' className='img_icon' size={50} />
							<div className='upload_info d-flex flex-column'>
								<p>
									Drag and Drop {dragNDropText} here or{' '}
									<label htmlFor='upload-files'>Browse on your computer</label>
								</p>
								<span>Recommended size:{recommendedHeightWidth}</span>
							</div>
						</div>
					</div>
					<input
						type='file'
						name={dragNDropFor}
						id='upload-files'
						accept={accept}
						multiple={dragNDropFor === 'video' ? false : multiple}
						onChange={(e) => onFileSelect(e.target.files)}
						disabled={maxSelect <= fileItems?.length}
					/>
				</div>
			) : null}

			{/* preview images */}
			{dragNDropFor === 'image' ? (
				<div className='image_files-container' onDragOver={(e) => e.preventDefault}>
					{fileItems?.map((item, idx) => {
						if (item instanceof File) {
							item = URL.createObjectURL(item);
						} else {
							item = genetartMediaURL(item);
						}
						const id = item;
						return (
							<div
								key={id}
								id={id}
								className='image-container'
								// onDragOver={(e) => onDragOver(e, idx)}
								// draggable={onOrderChange ? true : false}
								// onDragStart={(e) => onDragStart(e, idx, id)}
								// onDragEnd={() => onDragEnd(id)}
								// onClick={() => onSelect && onSelect(fileItems[idx])}
							>
								<img className='image' src={item} alt={item} />
								<div className='image_hover'>
									{/* {multiple ? <Icon icon='drag_indicator' className='image_drag' /> : null} */}
									<Icon icon='close' className='image_remove' onClick={() => onRemove(idx)} />
								</div>
							</div>
						);
					})}
					{/* {isUploading ? <Preloader /> : null} */}
				</div>
			) : null}

			{/*  preview video */}
			{dragNDropFor === 'video' && fileItems.length ? (
				<div id='video-container' className='video_files-container'>
					<video controls src={fileItems[0]} />
					<Icon onClick={() => setFileItems([])} className='closeIcon' icon='close' />
					{/* {isUploading ? <Preloader /> : null} */}
				</div>
			) : null}
		</Fragment>
	);
};

const ImageInput: FC<IMediaInputProps> = ({ control, ...props }) => {
	if (!control) return <MediaInput {...props} />;

	const { isRequired, name, defaultImage, multiple, onChange } = props;
	return (
		<Controller
			control={control}
			name={name as string}
			defaultValue={defaultImage || null}
			rules={{ required: isRequired }}
			render={({ field }) => {
				return (
					<MediaInput
						{...props}
						fileList={multiple ? field.value || [] : field.value ? [field.value] : []}
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

export default ImageInput;
