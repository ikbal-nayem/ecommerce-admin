import { IconButton } from '@components/Button';
import { IColors, IObject } from '@interfaces/common.interface';
import clsx from 'clsx';
import { useRef } from 'react';
import { Controller } from 'react-hook-form';
import Select, { InputActionMeta, createFilter } from 'react-select';
import AsyncSelect from 'react-select/async';
import CreatableSelect from 'react-select/creatable';
import { debounce } from 'utils/debouncer';

interface AutocompleteProps {
	isClearable?: boolean;
	isCreatable?: boolean;
	isDisabled?: boolean;
	isLoading?: boolean;
	isMulti?: boolean;
	maxLength?: number;
	isAsync?: boolean;
	isSearchable?: boolean;
	control?: any;
	isRequired?: boolean | string;
	filterProps?: Array<string>;
	options?: Array<IObject>;
	placeholder?: string;
	defaultValue?: any;
	value?: any;
	name?: string;
	label?: string;
	onChange?: (selected: any) => void;
	onFocus?: () => void;
	onInputChange?: (newValue: string, actionMeta?: InputActionMeta) => void;
	inputValue?: string;
	getOptionLabel: (option: IObject) => any;
	getOptionValue?: (option: IObject) => string;
	onCreateOption?: (inputValue: string) => void;
	noOptionsMessage?: () => string | JSX.Element | string;
	closeMenuOnSelect?: boolean;
	tagColor?: IColors;
	noMargin?: boolean;
	autoFocus?: boolean;
	isError?: boolean;
	errorMessage?: string;
	loadOptions?: (searchKey: string, callback: any) => void;
	endIcon?: string;
	endIconTitle?: string;
	onEditIconClick?: () => void;
	helpText?: string;
	viewOnly?: IObject | IObject[];
}

type SelectComponentProps = {
	value: any;
	onChange?: (selected: any) => void;
};

const Autocomplete = ({
	control,
	isAsync,
	isMulti = false,
	isClearable = true,
	isCreatable,
	isDisabled,
	isRequired,
	filterProps = [], // If pass empty array it will filter from lable
	isLoading,
	autoFocus,
	maxLength,
	label,
	placeholder,
	isSearchable,
	options,
	defaultValue,
	value,
	onChange,
	name,
	onInputChange,
	inputValue,
	onFocus,
	getOptionLabel,
	getOptionValue,
	onCreateOption,
	noOptionsMessage,
	tagColor = 'secondary',
	closeMenuOnSelect,
	noMargin,
	isError,
	errorMessage,
	loadOptions,
	endIcon,
	endIconTitle,
	onEditIconClick,
	helpText,
	viewOnly,
}: AutocompleteProps) => {
	const SelectComponent = ({ value, onChange }: SelectComponentProps) => {
		const prevState = useRef<{ searchKey: null | string; prevList: IObject[] }>({
			searchKey: '',
			prevList: [],
		});

		const debouncedLoadOptions = debounce((searchKey: string, callback: any) => {
			if (prevState.current.searchKey !== searchKey) {
				prevState.current.searchKey = searchKey;
				loadOptions &&
					loadOptions(searchKey, (data: IObject[]) => {
						prevState.current.prevList = data;
						callback(data);
					});
			} else callback(prevState.current.prevList);
		}, 500);

		const onFilter = createFilter({
			stringify: (option: IObject) => {
				if (filterProps?.length)
					return filterProps
						.map((f) => (option.data[f] ? option.data[f] : ''))
						.join(' ')
						.trim();
				return option?.label;
			},
		});

		if (isAsync)
			return (
				<AsyncSelect
					classNames={{
						control: () => clsx(['form-control form-control-sm p-0', { 'is-invalid': isError }]),
					}}
					className='w-100'
					cacheOptions
					defaultOptions
					isMulti={isMulti}
					placeholder={placeholder}
					defaultValue={defaultValue}
					isDisabled={isDisabled}
					isLoading={isLoading}
					isClearable={isClearable}
					isSearchable={isSearchable}
					name={name}
					options={options}
					onChange={onChange}
					onInputChange={onInputChange}
					noOptionsMessage={
						noOptionsMessage
							? noOptionsMessage
							: ({ inputValue }) => (inputValue === '' ? 'অনুসন্ধান করুন' : 'কোনো তথ্য পাওয়া যায়নি!')
					}
					onFocus={onFocus}
					getOptionLabel={getOptionLabel}
					getOptionValue={getOptionValue}
					closeMenuOnSelect={closeMenuOnSelect}
					value={value}
					loadOptions={debouncedLoadOptions}
				/>
			);

		return isCreatable ? (
			<CreatableSelect
				classNames={{
					control: () => clsx(['form-control form-control-sm p-0', { 'is-invalid': isError }]),
				}}
				className='w-100'
				isMulti={isMulti}
				placeholder={placeholder}
				defaultValue={defaultValue}
				isDisabled={isDisabled}
				isLoading={isLoading}
				isClearable={isClearable}
				isSearchable={isSearchable}
				isValidNewOption={() => true}
				name={name}
				options={options}
				onChange={onChange}
				onInputChange={onInputChange}
				noOptionsMessage={noOptionsMessage}
				onFocus={onFocus}
				filterOption={onFilter}
				getOptionLabel={getOptionLabel}
				getOptionValue={getOptionValue}
				onCreateOption={onCreateOption}
				closeMenuOnSelect={closeMenuOnSelect}
				value={value}
			/>
		) : (
			<Select
				classNames={{
					control: () => clsx(['form-control form-control-sm p-0', { 'is-invalid': isError }]),
				}}
				className='w-100'
				isMulti={isMulti}
				placeholder={placeholder}
				defaultValue={defaultValue}
				isDisabled={isDisabled}
				isLoading={isLoading}
				isClearable={isClearable}
				isSearchable={isSearchable}
				name={name}
				autoFocus={autoFocus}
				options={options}
				onChange={onChange}
				onInputChange={onInputChange}
				inputValue={inputValue}
				noOptionsMessage={noOptionsMessage}
				onFocus={onFocus}
				filterOption={onFilter}
				closeMenuOnSelect={closeMenuOnSelect}
				getOptionLabel={getOptionLabel}
				getOptionValue={getOptionValue}
				value={value}
			/>
		);
	};

	return (
		<div className={`min-w-100px ${noMargin ? '' : 'mb-6'}`}>
			{label && (
				<label className='d-flex align-items-center fs-5'>
					<span className={isRequired ? 'required' : ''}>{label}</span>
				</label>
			)}

			<div className={clsx([{ 'd-flex w-100': !!endIcon }])}>
				{control ? (
					<Controller
						control={control}
						name={name || ''}
						rules={{
							required: isRequired,
							validate: {
								checkLength: (val) => {
									if (!isMulti) return true;
									return maxLength && val?.length > maxLength ? `Max length is ${maxLength}` : true;
								},
							},
						}}
						render={({ field }: { field: any }) => (
							<SelectComponent
								onChange={(val) => {
									field.onChange(val);
									onChange && onChange(val);
								}}
								value={field.value}
							/>
						)}
					/>
				) : (
					<SelectComponent onChange={onChange} value={value} />
				)}
				{!!endIcon && (
					<IconButton
						iconName={endIcon}
						rounded={false}
						onClick={onEditIconClick}
						hoverTitle={endIconTitle}
					/>
				)}
			</div>

			{isError ? (
				<div className='invalid-feedback d-block'>{errorMessage}</div>
			) : !!helpText ? (
				<div className='form-text text-gray-600'>{helpText}</div>
			) : null}
		</div>
	);
};
export default Autocomplete;
