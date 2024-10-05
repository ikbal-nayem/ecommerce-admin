import React, { useEffect, useState } from "react";
import {Button} from "@components/Button";
import WxModal from "@components/WxModal";
import WxModalBody from "@components/WxModal/WxModalBody";
import WxModalFooter from "@components/WxModal/WxModalFooter";
import WxModalHeader from "@components/WxModal/WxModalHeader";
import MediaInput from "@components/MediaInput/MediaInput";
import { FileService } from "services/api/file.service";
import { useSelector } from "react-redux";
import { IFilePayload } from "@interfaces/common.interface";

type VariantImageProps = {
	isOpen?: boolean;
	onClose?: () => void;
	getValues?: (values: string | string[]) => any;
	variantIndex?: any;
	setValue?: Function;
	onSelectImage?: (imageObject: IFilePayload[], index: number) => void;
	onAddNewImage?: (imageObject: IFilePayload[]) => void;
};

const VariantImage = ({
	isOpen,
	onClose,
	variantIndex,
	getValues,
	onSelectImage,
	onAddNewImage,
}: VariantImageProps) => {
	const [images, setImages] = useState<IFilePayload[]>([]);
	const [selectedImages, setSelectedImages] = useState<IFilePayload[]>([]);
	const [uploading, setUploading] = useState<boolean>(false);

	useEffect(() => {
		if (!isOpen) return;
		const imageValues = getValues([
			"images",
			`variants.${variantIndex.current}.image`,
		]);
		setImages(imageValues?.[0]);
		setSelectedImages(imageValues[1] ? [imageValues[1]] : []);
	}, [isOpen]);

	const handleImageAdd = (newImages: File[]) => {
		setUploading(true);
		const formData: any = new FormData();
		Object.keys(newImages).forEach((img) =>
			formData.append("files", newImages[img])
		);
		FileService.uploadAll(formData)
			.then((resp) => {
				const newImageList = [...images, ...resp.body];
				setImages(newImageList);
				onAddNewImage(newImageList);
			})
			.finally(() => setUploading(false));
	};

	const onImageSelect = (imageObject: IFilePayload) => {
		const idx = selectedImages?.findIndex(
			(val) => val.fileName === imageObject.fileName
		);
		setSelectedImages(idx > -1 ? [] : [imageObject]);
	};

	const onSave = () => {
		onSelectImage(selectedImages, variantIndex.current);
	};

	return (
		<WxModal show={isOpen} handleClose={onClose}>
			<WxModalHeader title="Update Variant Image" closeIconAction={onClose} />
			<WxModalBody>
				<MediaInput
					multiple
					fileList={images}
					onChange={handleImageAdd}
					onSelect={onImageSelect}
					selectedImages={selectedImages}
					isUploading={uploading}
				/>
			</WxModalBody>
			<WxModalFooter>
				<div className="d-flex justify-content-end">
					<Button
						className="me-3"
						variant="outline"
						color="secondary"
						onClick={onClose}
					>
						Cancel
					</Button>
					<Button variant="fill" onClick={onSave}>
						Save
					</Button>
				</div>
			</WxModalFooter>
		</WxModal>
	);
};

export default VariantImage;
