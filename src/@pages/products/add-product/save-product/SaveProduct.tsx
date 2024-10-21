import { Button } from '@components/Button';
import Label from '@components/Label';
import Select from '@components/Select/Select';
import WxChip from '@components/WxChip';
import WxHr from '@components/WxHr';
import { PRODUCT_STATUS } from 'config/constants';
import { memo } from 'react';
import { useFormContext } from 'react-hook-form';
import { ICategoryPayload } from 'services/api/products/Category.services';
import { ICollectionPayload } from 'services/api/products/Collection.services';
import SelectCategory from '../../add-product/components/select-category/SelectCategory';
import SelectCollections from '../../add-product/components/select-collection/SelectCollections';

type SaveProductsProps = {
	onCollectionSelect?: (collection: ICollectionPayload) => void;
	categorySetter?: (category: ICategoryPayload) => void;
	selectedCollections: ICollectionPayload[];
	selectedCategory: ICategoryPayload;
	onRemoveCollection?: (id: number) => void;
	isSaving?: boolean;
};

const SaveProducts = ({
	categorySetter,
	onCollectionSelect,
	selectedCollections,
	selectedCategory,
	onRemoveCollection,
	isSaving,
}: SaveProductsProps) => {
	// const [isVendorLoading, setVendorIsLoading] = useState<boolean>(false);
	// const [isChannelLoading, setIsChannelLoading] = useState<boolean>(true);
	// const [salesChannels, setSalesChannels] = useState<ISalesChannel[]>([]);
	// const [vendorSearchQuery, setVendorSearchQuery] = useState<string>();
	// const [tagSearchQuery, setTagSearchQuery] = useState<string>();
	// const [vendorList, setVendorList] = useState<IVendorPayload[]>([]);
	const { register } = useFormContext();

	// let vendorSearch = useDebounce(vendorSearchQuery, 300);
	// let tagSearch = useDebounce(tagSearchQuery, 300);

	// useEffect(() => {
	// 	ProductService.getSalesChannel()
	// 		.then((resp) => {
	// 			setSalesChannels(resp.body);
	// 			if (!isEditForm) {
	// 				const onlineStore = resp.body?.find(
	// 					(item) => item.metaKey === MASTER_META_KEY.SALES_CHANNEL_ONLINE_STORE
	// 				)?.id;
	// 				setValue('salesChannels', onlineStore ? [onlineStore] : []);
	// 			}
	// 		})
	// 		.finally(() => setIsChannelLoading(false));
	// }, []);

	// useEffect(() => {
	// 	getVendorList(vendorSearch);
	// }, [vendorSearch]);

	// useEffect(() => {
	// 	tagSearch ? getTagList(tagSearch) : setTagList([]);
	// }, [tagSearch]);

	// const getVendorList = (searchQuery: string = null) => {
	// 	setVendorIsLoading(true);
	// 	const payload = {
	// 		body: { name: searchQuery },
	// 		meta: { offset: 0, limit: 15 },
	// 	};
	// 	VendorService.get(payload)
	// 		.then((resp) => setVendorList(resp.body))
	// 		.finally(() => setVendorIsLoading(false));
	// };

	// const onVendorChange = (vendor: IVendorPayload) => {
	// 	setValue('vendorId', vendor?.id);
	// };

	// const getTagList = (searchQuery: string = null) => {
	// 	setTagIsLoading(true);
	// 	const payload = {
	// 		body: { name: searchQuery },
	// 		meta: { offset: 0, limit: 15 },
	// 		sort: [{ field: 'name', order: 'asc' }],
	// 	};
	// 	TagService.tagList(payload)
	// 		.then((resp) => {
	// 			const tList = resp?.body?.filter((t: ITagBody) => !selectedTags.some((st) => st.name === t.name));
	// 			setTagList(tList);
	// 		})
	// 		.finally(() => setTagIsLoading(false));
	// };

	// const onTagCreate = (newTag: string) => {
	// 	onTagSelect({ id: generateId(), name: newTag?.toLowerCase() });
	// };

	// const onSalesChannelChange = (channel: ISalesChannel, isChecked: boolean) => {
	// 	let currentChannels: string[] = getValues('salesChannels') || [];
	// 	const idx = currentChannels.indexOf(channel.id);
	// 	if (isChecked && idx < 0) currentChannels = [...currentChannels, channel.id];
	// 	else if (!isChecked && idx >= 0) currentChannels.splice(idx, 1);
	// 	setValue('salesChannels', [...currentChannels]);
	// };

	// const salesChannelsDefault = getValues('salesChannels');

	return (
		<div className='card wx__form_right p-3 mt-4'>
			<div className='d-none d-sm-block'>
				<Button type='submit' variant='fill' width={100} isLoading={isSaving}>
					Save Product
				</Button>
				<WxHr />
			</div>
			<Select
				label='Product Status'
				valuesKey='value'
				textKey='title'
				options={PRODUCT_STATUS}
				noMargin
				registerProperty={{ ...register('isActive') }}
			/>
			<WxHr />
			{/* <Label>Sales Cannnel</Label> */}
			{/* {isChannelLoading ? <Preloader /> : null} */}
			{/* <div style={{ maxWidth: '80%' }}>
				{!isChannelLoading &&
					salesChannels?.map((channel) => (
						<div key={channel.id} className='my-3'>
							<Switch
								label={
									<div className='d-flex align-items-center'>
										<span>{channel.title}</span>
									</div>
								}
								checkedTitle='Visible'
								unCheckedTitle='Hidden'
								defaultChecked={salesChannelsDefault && (salesChannelsDefault?.includes(channel.id) || false)}
								onChange={(e: any) => onSalesChannelChange(channel, e.target.checked)}
							/>
						</div>
					))}
			</div> */}
			{/* <WxHr /> */}

			{/* <div className='mb-3'>
				<Label
					labelRight={
						<span
							className='text_btn_small text-primary text_medium'
							role='button'
							onClick={setVendorDrawerOpen}
						>
							Manage
						</span>
					}
				>
					Vendor
				</Label>
				<Controller
					control={control}
					name='vendor'
					render={({ field: { onChange, value } }) => (
						<SelectOption
							options={vendorList}
							onInputChange={(val) => setVendorSearchQuery(val)}
							isLoading={isVendorLoading}
							isSearchable
							value={value}
							onFocus={() => getVendorList()}
							onChange={(val: IVendorPayload) => {
								onVendorChange(val);
								onChange(val);
							}}
							getOptionLabel={(op: IVendorPayload) => op?.name}
							getOptionValue={(op: IVendorPayload) => op}
						/>
					)}
				/>
			</div> */}

			<Label>Collections</Label>
			{selectedCollections.length ? (
				<div className='mb-2 d-flex gap-2 flex-wrap'>
					{selectedCollections.map((collection, idx) => (
						<WxChip key={collection._id} label={collection.name} onClose={() => onRemoveCollection(idx)} />
					))}
				</div>
			) : null}
			<SelectCollections selectedCollections={selectedCollections} setCollections={onCollectionSelect} />

			<Label>Category</Label>
			{selectedCategory._id ? (
				<div className='mb-2'>
					<WxChip label={selectedCategory.name} onClose={() => categorySetter({})} />
				</div>
			) : null}
			<SelectCategory selectedCategory={selectedCategory} setCategory={categorySetter} />

			{/* <WxHr /> */}

			{/* <Label>Tags</Label> */}
			{/* <SelectOption
				options={tagList}
				placeholder='Search tag'
				isCreatable
				isSearchable
				onInputChange={(val) => setTagSearchQuery(val)}
				onChange={(val) => onTagSelect(val)}
				getOptionLabel={(op) => op.name || op.label}
				getOptionValue={(op) => op._id}
				noOptionsMessage={() => 'Search for tag'}
				onCreateOption={onTagCreate}
			/> */}
			{/* {selectedTags.length ? (
				<div className='mt-2 d-flex gap-2 flex-wrap'>
					{selectedTags.map((tag, idx) => (
						<WxChip key={tag.id} label={tag.name} onClose={() => onRemoveTag(idx)} />
					))}
				</div>
			) : null} */}
		</div>
	);
};

export default memo(SaveProducts);
