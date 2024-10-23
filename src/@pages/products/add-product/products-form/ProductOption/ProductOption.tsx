import { Button } from '@components/Button';
import Icon from '@components/Icon';
import Label from '@components/Label';
import Switch from '@components/Switch';
import TextInput from '@components/TextInput';
import { WxDraggableList } from '@components/WxDraggableList';
import WxHr from '@components/WxHr';
import WxTag from '@components/WxTag';
import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { generateId } from 'utils/random-generate';
import './ProductOption.scss';

const dummy_options = [
	{
		id: generateId(),
		name: '',
		values: [],
	},
];

interface IValueInterface {
	id?: number;
	name?: string;
}

interface IOptionInterface {
	id?: number;
	name?: string;
	values: IValueInterface[];
}

type RenderOptionProps = {
	optionItem: IOptionInterface;
	index: number;
	optionDragHandler: any;
	onAddNewValue: (optionIndex: number, val: any) => void;
	handleValueOrderChange: (optionId: string | number, updatedOrder: any[]) => void;
	handleOptionChange: Function;
	handleOptionValueChange: Function;
	onDeleteValue: Function;
	onDeleteOption: (index: number) => void;
	focusIndex: number;
	hasVariants?: boolean;
};

const RenderOption = ({
	optionItem,
	index,
	optionDragHandler,
	onAddNewValue,
	handleValueOrderChange,
	handleOptionChange,
	handleOptionValueChange,
	onDeleteValue,
	onDeleteOption,
	focusIndex,
	hasVariants,
}: RenderOptionProps) => {
	const [isEdit, setIsEdit] = useState<boolean>(!hasVariants || optionItem?.values?.length === 0);

	const onValueOrderChange = (updatedOrder: any[]) => {
		handleValueOrderChange(optionItem?.id, updatedOrder);
	};

	if (!isEdit) {
		return (
			<>
				<div className='d-flex align-items-center'>
					<span className='material-symbols-rounded drag_indicator' {...optionDragHandler}>
						drag_indicator
					</span>
					<div className='d-flex w-100 align-items-center'>
						<div className='me-auto ms-4'>
							<strong>{optionItem?.name}</strong>
							<div className='d-flex gap-2 mt-1 flex-wrap'>
								{optionItem?.values?.map((value: any) =>
									value?.name ? <WxTag key={value?.id} label={value?.name} /> : null
								)}
							</div>
						</div>
						<div>
							<Button variant='outline' color='secondary' onClick={() => setIsEdit(true)}>
								Edit
							</Button>
						</div>
					</div>
				</div>
				<WxHr />
			</>
		);
	}

	return (
		<>
			<div className='product_option_name'>
				{optionItem?.name && optionItem?.values?.length ? (
					<span className='material-symbols-rounded drag_indicator' {...optionDragHandler}>
						drag_indicator
					</span>
				) : null}
				<TextInput
					label='Option name'
					placeholder='For example: Color or size or meterial etc'
					value={optionItem?.name}
					className={!(optionItem?.name && optionItem?.values?.length) ? 'ms-5' : ''}
					onChange={(e: any) => handleOptionChange(index, e.target?.value)}
				/>
				<Icon icon='delete_outline' className='mt-2 ms-1' size={25} onClick={() => onDeleteOption(index)} />
			</div>
			<div className='product_option_values'>
				<Label>Option Values</Label>
				<WxDraggableList
					data={optionItem?.values}
					itemId='id'
					onOrderChange={onValueOrderChange}
					renderItem={(valueItem: IValueInterface, valueIndex: number, dragHandler: any) => (
						<div className='product_option_value'>
							<span className='material-symbols-rounded drag_indicator' {...dragHandler}>
								drag_indicator
							</span>
							<TextInput
								placeholder='Add another value'
								defaultValue={valueItem?.name}
								noMargin
								onChange={(e: any) => handleOptionValueChange(index, valueIndex, e.target.value)}
								isAutoFocus={focusIndex === valueIndex}
							/>
							<Icon
								icon='delete_outline'
								className='mt-1 ms-1'
								size={25}
								onClick={() => onDeleteValue(index, valueIndex)}
							/>
						</div>
					)}
				/>
				<TextInput
					placeholder='Add another value'
					onChange={(e: any) => {
						onAddNewValue(index, e.target.value);
						e.target.value = '';
					}}
					className='ms-5'
				/>
			</div>
			<div className='ms-5'>
				<Button
					variant='outline'
					disabled={!optionItem?.name || optionItem?.values?.length === 0}
					color='secondary'
					onClick={() => setIsEdit(false)}
				>
					Done
				</Button>
			</div>
			<WxHr />
		</>
	);
};

const ProductOption = () => {
	const [options, setOptions] = useState<IOptionInterface[]>(dummy_options);
	const [focusIndex, setFocusIndex] = useState<number>();
	const isInit = useRef(true);

	const { register, watch, setValue, getValues } = useFormContext();

	const hasVariants = watch('hasVariants');


	const defaultOptions = getValues('options');

	useEffect(() => {
		if (isInit.current && defaultOptions) {
			setOptions(defaultOptions);
			isInit.current = false;
		}
	}, [defaultOptions, isInit.current]);

	useEffect(() => {
		setValue('options', options || []);
	}, [options]);

	const onOrderChange = (updatedOrder: any[]) => {
		setOptions(updatedOrder);
	};

	const onValueOrderChange = (optionId: string | number, updatedOrder: any[]) => {
		const idx = options.findIndex((op) => op.id === optionId);
		setOptions((prev) => {
			prev[idx].values = updatedOrder;
			return [...prev];
		});
	};

	const handleOptionChange = (optionIndex: number, value: string) => {
		let optionList = [...options];
		optionList[optionIndex].name = value;
		setOptions(optionList);
	};

	const handleOptionValueChange = (optionIndex: number, valueIndex: number, value: string) => {
		let optionList = [...options];
		optionList[optionIndex].values[valueIndex].name = value;
		setOptions(optionList);
	};

	const onAddNewValue = (optionIndex: number, inputValue: any) => {
		let optionList = [...options];
		optionList[optionIndex].values.push({ id: generateId(), name: inputValue });
		setOptions(optionList);
		setFocusIndex(optionList[optionIndex].values?.length - 1);
	};

	const onAddNewOption = () => {
		const prevOptionList = [...options, { id: generateId(), name: '', values: [] }];
		setOptions(prevOptionList);
	};

	const onDeleteOption = (optionIndex: number) => {
		const op = [...options];
		op.splice(optionIndex, 1);
		setOptions(op);
	};

	const onDeleteValue = (optionIndex: number, valueIndex: number) => {
		const op = [...options];
		op[optionIndex].values.splice(valueIndex, 1);
		setOptions(op);
	};

	return (
		<div className='card product_option p-3 mt-4'>
			<h6 className='text_semibold text_h6'>
				Options
				<Icon variants='round' icon='help' role='button' />
			</h6>
			<div style={{ maxWidth: '90%' }}>
				<div className='mb-2'>
					<Switch
						label='This product has options, like size or color etc.'
						checkedTitle='Yes'
						unCheckedTitle='No'
						registerProperty={{ ...register('hasVariants') }}
					/>
				</div>
			</div>

			{hasVariants ? (
				<>
					<WxHr />
					<div className='product_option_list'>
						<WxDraggableList
							data={options}
							itemId='id'
							renderItem={(optionItem, index, optionDragHandler) => (
								<RenderOption
									optionItem={optionItem}
									index={index}
									optionDragHandler={optionDragHandler}
									onAddNewValue={onAddNewValue}
									handleValueOrderChange={onValueOrderChange}
									handleOptionChange={handleOptionChange}
									handleOptionValueChange={handleOptionValueChange}
									onDeleteValue={onDeleteValue}
									onDeleteOption={onDeleteOption}
									focusIndex={focusIndex}
									hasVariants={hasVariants}
								/>
							)}
							onOrderChange={onOrderChange}
						/>
					</div>
					{options.length < 3 ? (
						<div>
							<Button onClick={onAddNewOption}>
								<Icon icon='add' className='text-primary' />
								&nbsp; Add another option
							</Button>
						</div>
					) : null}
				</>
			) : null}
		</div>
	);
};

export default ProductOption;
