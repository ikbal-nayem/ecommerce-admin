import { ConfirmationModal } from '@components/ConfirmationModal/ConfirmationModal';
import WxMainLg from '@components/MainContentLayout/MainLg';
import {Button} from '@components/Button';
import { WxDraggableList } from '@components/WxDraggableList';
import { WxFormHeader } from '@components/WxFormLayout';
import WxIcon from '@components/Icon';
import Switch from '@components/Switch';
import WxThumbnail from '@components/Thumbnail';
import { ISliderItem } from '@interfaces/themeCustomization.interface';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { THEME_CUSTOMIZATION_SLIDER } from 'routes/path-name.route';
import { SliderItemService } from 'services/api/onlineStore/themes/Slider.service';
import Preloader from 'services/utils/preloader.service';
import { ToastService } from 'services/utils/toastr.service';
import { compressImage, imageURLGenerate } from 'utils/utils';
import AddSliderImage from './components/AddSliderImage';
import './Slider.scss';

const SliderDetails = () => {
	const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
	const [sliderItems, setSliderItems] = useState<ISliderItem[]>([]);
	const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
	const [isEditForm, setIsEditForm] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const editedData = useRef<ISliderItem | null>(null);
	const deleteItem = useRef<ISliderItem | null>(null);
	const { id } = useParams();

	useEffect(() => {
		getSliderImageList();
	}, []);

	const getSliderImageList = () => {
		setIsLoading(true);
		SliderItemService.getBySliderId(id)
			.then((res) => {
				setSliderItems(res.body);
			})
			.finally(() => setIsLoading(false));
	};

	const handleFormClose = () => {
		editedData.current = null;
		setIsEditForm(false);
		setIsFormOpen(false);
	};

	const handleConfirmClose = () => {
		deleteItem.current = null;
		setIsConfirmOpen(false);
	};

	const onOrderChange = (newOrderedData: ISliderItem[]) => {
		newOrderedData.forEach((item, idx) => (item.serial = idx + 1));
		SliderItemService.reOrganize(newOrderedData)
			.then(() => {
				setSliderItems(newOrderedData);
			})
			.catch((err) => {
				setSliderItems(sliderItems);
			});
	};

	const handleDelete = (requestData: ISliderItem) => {
		deleteItem.current = requestData;
		setIsConfirmOpen(true);
	};

	const onConfirmDelete = () => {
		setIsSaving(true);
		SliderItemService.deleteAll([deleteItem.current?.id])
			.then((resp) => {
				ToastService.success(resp.message);
				sliderItems.splice(
					sliderItems.findIndex((itm) => itm?.id === deleteItem.current?.id),
					1
				);
				setSliderItems([...sliderItems]);
				handleConfirmClose();
				isFormOpen && handleFormClose();
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsSaving(false));
	};

	const onEditStart = (editData: ISliderItem) => {
		editedData.current = editData;
		setIsEditForm(true);
		setIsFormOpen(true);
	};

	const onStatusChange = (status: boolean, index: number) => {
		setIsSaving(true);
		let temp = sliderItems;
		temp[index].isActive = status;
		const formData = new FormData();
		formData.append('body', JSON.stringify(temp[index]));
		SliderItemService.update(formData)
			.then((resp) => setSliderItems([...temp]))
			.catch((err) => {
				ToastService.error(err.message);
				temp[index].isActive = !status;
				setSliderItems([...temp]);
			})
			.finally(() => setIsSaving(false));
	};

	const onSubmitForm = async (data: ISliderItem) => {
		const img: any = data?.image;
		if (!img) {
			ToastService.error('Please select image');
			return;
		}
		setIsSaving(true);
		data.sliderId = id;
		data.isExternal = false;
		data.url = null;
		data.type = null;

		const newData = new FormData();
		if (img instanceof File) {
			delete data?.image;
			const cImg = await compressImage(img, 1);
			newData.append('file', cImg);
		}
		newData.append('body', JSON.stringify(data));
		if (isEditForm) {
			SliderItemService.update(newData)
				.then((res) => {
					ToastService.success(res.message);
					getSliderImageList();
					handleFormClose();
				})
				.catch((err) => ToastService.error(err.message))
				.finally(() => setIsSaving(false));
			return;
		}
		SliderItemService.create(newData)
			.then((res) => {
				ToastService.success(res.message);
				setSliderItems([...sliderItems, res.body]);
				handleFormClose();
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsSaving(false));
	};

	if (isLoading) {
		return <Preloader absolutePosition />;
	}

	return (
		<WxMainLg className='homeSection'>
			<WxFormHeader title='Slider Banners' backNavigationLink={THEME_CUSTOMIZATION_SLIDER} />
			<div className='card p-3 mt-4'>
				<div className='title_section'>
					<div className='title' />
					<Button onClick={() => setIsFormOpen(true)} variant='outline'>
						<WxIcon icon='add' />
						<span>Add Banner</span>
					</Button>
				</div>
				{sliderItems?.length ? (
					<div className='wx__table_noPopup'>
						<WxDraggableList
							data={sliderItems}
							itemId='id'
							onOrderChange={onOrderChange}
							renderItem={(item: any, index: number, dragHandler: any) => (
								<ul className='single-banner d-flex justify-content-between align-items-center'>
									<li className='banner-left'>
										<span className='material-icons-round drag_indicator cursor-grab' {...dragHandler}>
											drag_indicator
										</span>
										<div className='d-flex align-items-center'>
											<WxThumbnail src={imageURLGenerate(item?.image)} />
											<div className='banner_title_section'>
												<div className='banner_title'>{item.title}</div>
												<div className='banner_edited'>{item?.subTitle || ''}</div>
											</div>
										</div>
									</li>
									<li className='banner-right me-2'>
										<div className='d-flex align-items-center gap-3'>
											<Switch
												isChecked={item.isActive}
												onChange={(e) => onStatusChange(e.target.checked, index)}
												disabled={isSaving}
											/>
											<WxIcon
												icon='delete'
												size={22}
												variants='outlined'
												color='danger'
												onClick={() => handleDelete(item)}
											/>
											<WxIcon icon='edit' size={22} variants='outlined' onClick={() => onEditStart(item)} />
										</div>
									</li>
								</ul>
							)}
						/>
					</div>
				) : (
					<div className='no_banner_added'>No banner added</div>
				)}
			</div>
			<AddSliderImage
				isOpen={isFormOpen}
				isEditForm={isEditForm}
				handleFormClose={handleFormClose}
				editedData={editedData.current}
				submitForm={onSubmitForm}
				isSaving={isSaving}
				handleDelete={handleDelete}
			/>

			<ConfirmationModal
				isSubmitting={isSaving}
				isOpen={isConfirmOpen}
				onClose={handleConfirmClose}
				onConfirm={onConfirmDelete}
				body={`Are your sure you want to delete '${deleteItem.current?.title}'? This action wont be reverseable!`}
			/>
		</WxMainLg>
	);
};

export default SliderDetails;
