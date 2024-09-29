import React, { Fragment } from "react";
import { ActionMeta, InputActionMeta } from "react-select";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import AsyncCreatableSelect from "react-select/async-creatable";

interface SelectOptionProps {
	readonly isClearable?: boolean;
	readonly isCreatable?: boolean;
	readonly isDisabled?: boolean;
	readonly isLoading?: boolean;
	readonly isRtl?: boolean;
	readonly isMulti?: boolean;
	readonly isSearchable?: boolean;
	options?: any[];
	placeholder?: string;
	defaultSelected?: any;
	value?: any;
	registerProperty?: any;
	name?: any;
	className?: string;
	onChange?: (newValue: any, actionMeta: ActionMeta<any>) => void;
	onFocus?: () => void;
	onInputChange?: (newValue: string, actionMeta?: InputActionMeta) => void;
	filterOption?: (candidate: any, input: string) => boolean;
	getOptionLabel?: any;
	getOptionValue?: any;
	onCreateOption?: (inputValue: string) => void;
	noOptionsMessage?: () => string | JSX.Element | string;
	isAsyncList?: boolean;
	loadAsyncOptions?: (
		inputValue: string,
		callBack: (options: any[]) => void
	) => any;
	cacheOptions?: boolean;
	defaultOptions?: boolean;
}

const SelectOption = ({
	isMulti = false,
	isClearable = true,
	isCreatable,
	isDisabled,
	isLoading,
	className,
	placeholder,
	isRtl,
	isSearchable,
	options,
	defaultSelected,
	value,
	onChange,
	name,
	onInputChange,
	onFocus,
	filterOption,
	getOptionLabel,
	getOptionValue,
	onCreateOption,
	noOptionsMessage,
	isAsyncList = false,
	loadAsyncOptions,
	cacheOptions = false,
	defaultOptions = true,
}: SelectOptionProps) => {
	if (isAsyncList)
		return (
			<AsyncCreatableSelect
				cacheOptions={cacheOptions}
				loadOptions={loadAsyncOptions}
				getOptionLabel={getOptionLabel}
				getOptionValue={getOptionValue}
				defaultOptions={defaultOptions}
				onInputChange={onInputChange}
				onCreateOption={onCreateOption}
				value={value}
				onChange={onChange}
				className={className}
				classNamePrefix="select"
				placeholder={placeholder}
				defaultValue={defaultSelected}
				isDisabled={isDisabled}
				isLoading={isLoading}
				noOptionsMessage={noOptionsMessage}
				onFocus={onFocus}
				isClearable={isClearable}
			/>
		);

	if (isCreatable)
		return (
			<Fragment>
				<CreatableSelect
					isMulti={isMulti}
					className={isMulti ? "basic-multi-select" : "basic-single"}
					classNamePrefix="select"
					placeholder={placeholder}
					defaultValue={defaultSelected}
					isDisabled={isDisabled}
					isLoading={isLoading}
					isClearable={isClearable}
					isRtl={isRtl}
					isSearchable={isSearchable}
					name={name}
					options={options}
					onChange={onChange}
					onInputChange={onInputChange}
					noOptionsMessage={noOptionsMessage}
					onFocus={onFocus}
					filterOption={filterOption}
					getOptionLabel={getOptionLabel}
					getOptionValue={getOptionValue}
					onCreateOption={onCreateOption}
					value={value}
				/>
			</Fragment>
		);

	return (
		<Fragment>
			<Select
				isMulti={isMulti}
				className={isMulti ? "basic-multi-select" : "basic-single"}
				classNamePrefix="select"
				placeholder={placeholder}
				defaultValue={defaultSelected}
				isDisabled={isDisabled}
				isLoading={isLoading}
				isClearable={isClearable}
				isRtl={isRtl}
				isSearchable={isSearchable}
				name={name}
				options={options}
				onChange={onChange}
				onInputChange={onInputChange}
				noOptionsMessage={noOptionsMessage}
				onFocus={onFocus}
				filterOption={filterOption}
				getOptionLabel={getOptionLabel}
				getOptionValue={getOptionValue}
				value={value}
			/>
		</Fragment>
	);
}
export default SelectOption;
