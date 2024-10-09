import SelectOption from "@components/Select/Autocomplete";
import WxSelect from "@components/Select/Select";
import {Button} from "@components/Button";
import WxChip from "@components/WxChip";
import WxHr from "@components/WxHr";
import WxLabel from "@components/WxLabel";
import WxSwitch from "@components/WxSwitch";
import { MASTER_META_KEY, PRODUCT_STATUS } from "config/constants";
import { ISalesChannel } from "@interfaces/product.interface";
import { ITagBody, TagService } from "services/api/admin/Tag.service";
import { ICategoryPayload } from "services/api/products/Category.services";
import { ICollectionPayload } from "services/api/products/Collection.services";
import { ProductService } from "services/api/products/Product.services";
import {
	IVendorPayload,
	VendorService,
} from "services/api/products/Vendor.services";
import Preloader, { ButtonLoader } from "services/utils/preloader.service";
import { memo, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import useDebounce from "utils/debouncer";
import { generateId } from "utils/random-generate";
import SelectCategory from "../../add-product/components/select-category/SelectCategory";
import SelectCollections from "../../add-product/components/select-collection/SelectCollections";

type SaveProductsProps = {
	onCollectionSelect?: (collection: ICollectionPayload) => void;
	categorySetter?: (category: ICategoryPayload) => void;
	setVendorDrawerOpen: () => void;
	selectedCollections: ICollectionPayload[];
	selectedCategory: ICategoryPayload;
	onRemoveCollection?: (id: number) => void;
	onTagSelect?: (tag: ITagBody) => void;
	selectedTags?: ITagBody[];
	onRemoveTag?: (id: number) => void;
	isSaving?: boolean;
	isEditForm?: boolean;
};

const SaveProducts = ({
	setVendorDrawerOpen,
	categorySetter,
	onCollectionSelect,
	selectedCollections,
	selectedCategory,
	onRemoveCollection,
	onTagSelect,
	selectedTags,
	onRemoveTag,
	isSaving,
	isEditForm,
}: SaveProductsProps) => {
	const [isVendorLoading, setVendorIsLoading] = useState<boolean>(false);
	const [isTagLoading, setTagIsLoading] = useState<boolean>(false);
	const [isChannelLoading, setIsChannelLoading] = useState<boolean>(true);
	const [salesChannels, setSalesChannels] = useState<ISalesChannel[]>([]);
	const [vendorSearchQuery, setVendorSearchQuery] = useState<string>();
	const [tagSearchQuery, setTagSearchQuery] = useState<string>();
	const [vendorList, setVendorList] = useState<IVendorPayload[]>([]);
	const [tagList, setTagList] = useState<ITagBody[]>([]);
	const { register, control, setValue, getValues } = useFormContext();

	let vendorSearch = useDebounce(vendorSearchQuery, 300);
	let tagSearch = useDebounce(tagSearchQuery, 300);

	useEffect(() => {
		ProductService.getSalesChannel()
			.then((resp) => {
				setSalesChannels(resp.body);
				if (!isEditForm) {
					const onlineStore = resp.body?.find(
						(item) =>
							item.metaKey === MASTER_META_KEY.SALES_CHANNEL_ONLINE_STORE
					)?.id;
					setValue("salesChannels", onlineStore ? [onlineStore] : []);
				}
			})
			.finally(() => setIsChannelLoading(false));
	}, []);

	useEffect(() => {
		getVendorList(vendorSearch);
	}, [vendorSearch]);

	useEffect(() => {
		tagSearch ? getTagList(tagSearch) : setTagList([]);
	}, [tagSearch]);

	const getVendorList = (searchQuery: string = null) => {
		setVendorIsLoading(true);
		const payload = {
			body: { name: searchQuery },
			meta: { offset: 0, limit: 15 },
		};
		VendorService.get(payload)
			.then((resp) => setVendorList(resp.body))
			.finally(() => setVendorIsLoading(false));
	};

	const onVendorChange = (vendor: IVendorPayload) => {
		setValue("vendorId", vendor?.id);
	};

	const getTagList = (searchQuery: string = null) => {
		setTagIsLoading(true);
		const payload = {
			body: { name: searchQuery },
			meta: { offset: 0, limit: 15 },
			sort: [{ field: "name", order: "asc" }],
		};
		TagService.tagList(payload)
			.then((resp) => {
				const tList = resp?.body?.filter(
					(t: ITagBody) => !selectedTags.some((st) => st.name === t.name)
				);
				setTagList(tList);
			})
			.finally(() => setTagIsLoading(false));
	};

	const onTagCreate = (newTag: string) => {
		onTagSelect({ id: generateId(), name: newTag?.toLowerCase() });
	};

	const onSalesChannelChange = (channel: ISalesChannel, isChecked: boolean) => {
		let currentChannels: string[] = getValues("salesChannels") || [];
		const idx = currentChannels.indexOf(channel.id);
		if (isChecked && idx < 0)
			currentChannels = [...currentChannels, channel.id];
		else if (!isChecked && idx >= 0) currentChannels.splice(idx, 1);
		setValue("salesChannels", [...currentChannels]);
	};

	const salesChannelsDefault = getValues("salesChannels");

	return (
		<div className="card wx__form_right p-3 mt-4">
			<div className="hide-mobile-view">
				<Button type="submit" variant="fill" w={100} disabled={isSaving}>
					{isSaving ? <ButtonLoader /> : "Save Product"}
				</Button>
				<WxHr />
			</div>
			<WxSelect
				label="Product Status"
				valuesKey="title"
				textKey="title"
				options={PRODUCT_STATUS}
				noMargin
				registerProperty={{ ...register("status") }}
			/>
			<WxHr />
			<WxLabel>Sales Cannnel</WxLabel>
			{isChannelLoading ? <Preloader /> : null}
			<div style={{ maxWidth: "80%" }}>
				{!isChannelLoading &&
					salesChannels?.map((channel) => (
						<div key={channel.id} className="my-3">
							<WxSwitch
								label={
									<div className="d-flex align-items-center">
										<span>{channel.title}</span>
									</div>
								}
								checkedTitle="Visible"
								unCheckedTitle="Hidden"
								defaultChecked={
									salesChannelsDefault &&
									(salesChannelsDefault?.includes(channel.id) || false)
								}
								onChange={(e: any) =>
									onSalesChannelChange(channel, e.target.checked)
								}
							/>
						</div>
					))}
			</div>
			<WxHr />

			<div className="mb-3">
				<WxLabel
					labelRight={
						<span
							className="text_btn_small text-primary text_medium"
							role="button"
							onClick={setVendorDrawerOpen}
						>
							Manage
						</span>
					}
				>
					Vendor
				</WxLabel>
				<Controller
					control={control}
					name="vendor"
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
			</div>

			<WxLabel>Collections</WxLabel>
			{selectedCollections.length ? (
				<div className="mb-2 d-flex gap-2 flex-wrap">
					{selectedCollections.map((collection, idx) => (
						<WxChip
							key={collection.id}
							label={collection.name}
							onClose={() => onRemoveCollection(idx)}
						/>
					))}
				</div>
			) : null}
			<SelectCollections
				selectedCollections={selectedCollections}
				setCollections={onCollectionSelect}
			/>

			<WxLabel>Category</WxLabel>
			{selectedCategory.id ? (
				<div className="mb-2">
					<WxChip
						label={selectedCategory.name}
						onClose={() => categorySetter({})}
					/>
				</div>
			) : null}
			<SelectCategory
				selectedCategory={selectedCategory}
				setCategory={categorySetter}
			/>

			<WxHr />

			<WxLabel>Tags</WxLabel>
			<SelectOption
				options={tagList}
				placeholder="Search tag"
				isCreatable
				isSearchable
				onInputChange={(val) => setTagSearchQuery(val)}
				isLoading={isTagLoading}
				onChange={(val: ITagBody) => onTagSelect(val)}
				getOptionLabel={(op: ITagBody) => op.name || op.label}
				getOptionValue={(op: ITagBody) => op}
				noOptionsMessage={() => "Search for tag"}
				onCreateOption={onTagCreate}
				value=""
			/>
			{selectedTags.length ? (
				<div className="mt-2 d-flex gap-2 flex-wrap">
					{selectedTags.map((tag, idx) => (
						<WxChip
							key={tag.id}
							label={tag.name}
							onClose={() => onRemoveTag(idx)}
						/>
					))}
				</div>
			) : null}
		</div>
	);
};

export default memo(SaveProducts);
