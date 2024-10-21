import { useEffect, useState } from 'react';
import './Editor.scss';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import CkEditor from 'wx-ckeditor/ckeditor';
import editorConfig from './editor-configuration';

type Colors = 'primary' | 'secondary' | 'danger' | 'warning' | 'success';

interface IEditor {
	defaultValue?: string;
	onEditorChange?: (value: string) => void;
	errorMessage?: string | JSX.Element;
	color?: Colors;
	noMargin?: boolean;
	className?: string;
	isDisabled?: boolean;
	label?: string | JSX.Element;
	isRequired?: boolean;
	placeholder?: string;
	helpText?: string | JSX.Element;
}

const TextEditor = ({
	defaultValue,
	onEditorChange,
	errorMessage,
	placeholder,
	color,
	noMargin,
	className,
	isDisabled,
	label,
	helpText,
	isRequired,
}: IEditor) => {
	const [value, setValue] = useState(defaultValue);

	useEffect(() => {
		onEditorChange && onEditorChange(value);
	}, [value]);

	const onChangeHandle = (e, editor) => {
		const data = editor.getData();
		setValue(data);
	};

	return (
		<div
			className={`form_group ${noMargin ? 'm-0' : ''} ${className ? className : ''}`}
			aria-disabled={isDisabled}
		>
			{label ? (
				typeof label === 'string' ? (
					<label htmlFor=''>
						{label} {isRequired && <span>*</span>}
					</label>
				) : (
					<>{label}</>
				)
			) : null}

			<CKEditor
				editor={CkEditor}
				placeholder={placeholder}
				data={defaultValue}
				onChange={onChangeHandle}
				disabled={isDisabled}
				config={editorConfig}
			/>

			{errorMessage ? (
				typeof errorMessage === 'string' ? (
					<span className={`note_text ${color === 'danger' && 'text-danger'}`}>{errorMessage}</span>
				) : (
					<>{errorMessage}</>
				)
			) : null}
			{helpText ? (
				typeof helpText === 'string' ? (
					<span className={`note_text ${color === 'danger' && 'text-danger'}`}>{helpText}</span>
				) : (
					<>{helpText}</>
				)
			) : null}
		</div>
	);
};

export default TextEditor;
