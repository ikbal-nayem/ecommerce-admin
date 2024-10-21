import { Button } from '@components/Button';
import Chip from '@components/Chip';
import Label from '@components/Label';
import Select from '@components/Select/Select';
import WxHr from '@components/WxHr';
import { PRODUCT_STATUS } from 'config/constants';
import { memo } from 'react';
import { useFormContext } from 'react-hook-form';
import { ICategoryPayload } from 'services/api/products/Category.services';
import { ICollectionPayload } from 'services/api/products/Collection.services';
import { isNull } from 'utils/check-validity';
import SelectCategory from '../../add-product/components/select-category/SelectCategory';
import SelectCollections from '../../add-product/components/select-collection/SelectCollections';

type SaveProductsProps = {
	isSaving?: boolean;
};

const SaveProducts = ({ isSaving }: SaveProductsProps) => {
	// const [tagSearchQuery, setTagSearchQuery] = useState<string>();
	const { register, setValue, watch } = useFormContext();

	const onCollectionSelect = (collection: ICollectionPayload) => {
		const newCollections = [...selectedCollections];
		const idx = newCollections.findIndex((val) => val._id === collection._id);
		idx >= 0 ? newCollections.splice(idx, 1) : newCollections.push(collection);
		setValue('collections', newCollections);
	};

	const onCollectionRemove = (idx: number) => {
		const newCollections = [...selectedCollections];
		newCollections.splice(idx, 1);
		setValue('collections', newCollections);
	};

	const categorySetter = (category: ICategoryPayload) => {
		setValue('category', category);
	};

	// useEffect(() => {
	// 	tagSearch ? getTagList(tagSearch) : setTagList([]);
	// }, [tagSearch]);

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

	const [selectedCollections, selectedCategory] = watch(['collections', 'category']);

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

			<Label>Collections</Label>
			{!isNull(selectedCollections) ? (
				<div className='mb-2 d-flex gap-2 flex-wrap'>
					{selectedCollections.map((collection, idx) => (
						<Chip key={collection._id} label={collection.name} onClose={() => onCollectionRemove(idx)} />
					))}
				</div>
			) : null}
			<SelectCollections selectedCollections={selectedCollections} setCollections={onCollectionSelect} />

			<Label>Category</Label>
			{!isNull(selectedCategory) ? (
				<div className='mb-2'>
					<Chip label={selectedCategory.name} onClose={() => categorySetter({})} />
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
						<Chip key={tag.id} label={tag.name} onClose={() => onRemoveTag(idx)} />
					))}
				</div>
			) : null} */}
		</div>
	);
};

export default memo(SaveProducts);
