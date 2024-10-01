import WxAlert from "@components/Alert/WxAlert";
import WxButton from "@components/WxButton";
import { WxDraggableList } from "@components/WxDraggableList";
import WxHr from "@components/WxHr";
import WxIcon from "@components/WxIcon/WxIcon";
import WxInput from "@components/WxInput";
import WxLabel from "@components/WxLabel";
import WxSwitch from "@components/WxSwitch";
import WxTag from "@components/WxTag";
import { SETTINGS_PRICING_PLAN } from "routes/path-name.route";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { generateId } from "utils/random-generate";
import "./ProductOption.scss";

const dummy_options = [
	{
		id: generateId(),
		name: "",
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
	handleValueOrderChange: (
		optionId: string | number,
		updatedOrder: any[]
	) => void;
	handleOptionChange: Function;
	handleOptionValueChange: Function;
	onDeleteValue: Function;
	onDeleteOption: (index: number) => void;
	focusIndex: number;
	hasVariant?: boolean;
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
	hasVariant,
}: RenderOptionProps) => {
	const [isEdit, setIsEdit] = useState<boolean>(
		!hasVariant || optionItem?.values?.length === 0
	);

	const onValueOrderChange = (updatedOrder: any[]) => {
		handleValueOrderChange(optionItem?.id, updatedOrder);
	};

	if (!isEdit) {
		return (
			<>
				<div className="d-flex align-items-center">
					<span
						className="material-icons-round drag_indicator"
						{...optionDragHandler}
					>
						drag_indicator
					</span>
					<div className="d-flex w-100 align-items-center">
						<div className="me-auto ms-4">
							<strong>{optionItem?.name}</strong>
							<div className="d-flex gap-2 mt-1 flex-wrap">
								{optionItem?.values?.map((value: any) =>
									value?.name ? (
										<WxTag key={value?.id} label={value?.name} />
									) : null
								)}
							</div>
						</div>
						<div>
							<WxButton
								variant="outline"
								color="secondary"
								onClick={() => setIsEdit(true)}
							>
								Edit
							</WxButton>
						</div>
					</div>
				</div>
				<WxHr />
			</>
		);
	}

	return (
		<>
			<div className="product_option_name">
				{optionItem?.name && optionItem?.values?.length ? (
					<span
						className="material-icons-round drag_indicator"
						{...optionDragHandler}
					>
						drag_indicator
					</span>
				) : null}
				<WxInput
					label="Option name"
					placeholder="For example: Color or size or meterial etc"
					value={optionItem?.name}
					className={
						!(optionItem?.name && optionItem?.values?.length) ? "ms-5" : ""
					}
					onChange={(e: any) => handleOptionChange(index, e.target?.value)}
				/>
				<WxIcon
					icon="delete_outline"
					className="delete_icon"
					onClick={() => onDeleteOption(index)}
				/>
				{/* <span
          className="material-icons-round delete_icon"
          role="button"
          onClick={() => onDeleteOption(index)}
        >
          delete_outline
        </span> */}
			</div>
			<div className="product_option_values">
				<WxLabel>Option Values</WxLabel>
				<WxDraggableList
					data={optionItem?.values}
					itemId="id"
					onOrderChange={onValueOrderChange}
					renderItem={(
						valueItem: IValueInterface,
						valueIndex: number,
						dragHandler: any
					) => (
						<div className="product_option_value">
							<span
								className="material-icons-round drag_indicator"
								{...dragHandler}
							>
								drag_indicator
							</span>
							<WxInput
								placeholder="Add another value"
								defaultValue={valueItem?.name}
								noMargin
								onChange={(e: any) =>
									handleOptionValueChange(index, valueIndex, e.target.value)
								}
								isAutoFocus={focusIndex === valueIndex}
							/>
							<span
								className="material-icons-round delete_icon"
								role="button"
								onClick={() => onDeleteValue(index, valueIndex)}
							>
								delete_outline
							</span>
						</div>
					)}
				/>
				<WxInput
					placeholder="Add another value"
					onChange={(e: any) => {
						onAddNewValue(index, e.target.value);
						e.target.value = "";
					}}
					className="ms-5"
				/>
			</div>
			<div className="ms-5">
				<WxButton
					variant="outline"
					disabled={!optionItem?.name || optionItem?.values?.length === 0}
					color="secondary"
					onClick={() => setIsEdit(false)}
				>
					Done
				</WxButton>
			</div>
			<WxHr />
		</>
	);
};

const ProductOption = () => {
	const [options, setOptions] = useState<IOptionInterface[]>(dummy_options);
	const [focusIndex, setFocusIndex] = useState<number>();
	const isInit = useRef(true);

	const { activePlan } = useSelector((state: any) => state?.user);

	const { register, watch, setValue, getValues } = useFormContext();

	const hasVariant = watch("hasVariant");

	const defaultOptions = getValues("options");

	useEffect(() => {
		if (isInit.current && defaultOptions) {
			setOptions(defaultOptions);
			isInit.current = false;
		}
	}, [defaultOptions, isInit.current]);

	useEffect(() => {
		setValue("options", options || []);
	}, [options]);

	const onOrderChange = (updatedOrder: any[]) => {
		setOptions(updatedOrder);
	};

	const onValueOrderChange = (
		optionId: string | number,
		updatedOrder: any[]
	) => {
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

	const handleOptionValueChange = (
		optionIndex: number,
		valueIndex: number,
		value: string
	) => {
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
		const prevOptionList = [
			...options,
			{ id: generateId(), name: "", values: [] },
		];
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
		<div className="card product_option p-3 mt-4">
			<h6 className="text_semibold text_h6">
				Options
				<WxIcon variants="round" icon="help" role="button" />
			</h6>
			{!activePlan?.hasProductVariant ? (
				<WxAlert type="warning">
					Please upgrade your <Link to={SETTINGS_PRICING_PLAN}>plan</Link> to
					add product options.
				</WxAlert>
			) : null}
			<div style={{ maxWidth: "90%" }}>
				<div className="mb-2">
					<WxSwitch
						label="This product has options, like size or color etc."
						checkedTitle="Yes"
						unCheckedTitle="No"
						disabled={!activePlan?.hasProductVariant}
						registerProperty={{ ...register("hasVariant") }}
					/>
				</div>
			</div>

			{hasVariant ? (
				<>
					<WxHr />
					<div className="product_option_list">
						<WxDraggableList
							data={options}
							itemId="id"
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
									hasVariant={hasVariant}
								/>
							)}
							onOrderChange={onOrderChange}
						/>
					</div>
					{options.length < 3 ? (
						<div>
							<WxButton onClick={onAddNewOption}>
								<WxIcon icon="add" className="text-primary" />
								&nbsp; Add another option
							</WxButton>
						</div>
					) : null}
				</>
			) : null}
		</div>
	);
};

export default ProductOption;
