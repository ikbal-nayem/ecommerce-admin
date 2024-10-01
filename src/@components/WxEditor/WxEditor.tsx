import { useEffect, useState } from "react";
import "./WXEditor.scss";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import WxCkEditor from "wx-ckeditor/ckeditor";
import editorConfig from "./editor-configuration";

type Colors = "primary" | "secondary" | "danger" | "warning" | "success";

interface IWXEditor {
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

const WXEditor = ({
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
}: IWXEditor) => {
	const [value, setValue] = useState(defaultValue);

	useEffect(() => {
		onEditorChange && onEditorChange(value);
	}, [value]);

	const onChangeHandle = (e, editor) => {
		const data = editor.getData();
		setValue(data);
		// let changes = e.source.differ.getChanges({
		// 	includeChangesInGraveyard: true,
		// });
		// // console.log("changes", changes);
		// // changes = changes.filter((change) => change.name === "image");
		// changes.map((node) => {
		// 	// console.log("img:::::::", node?.position);
		// 	//   let test = node.position.nodeAfter;
		// 	//   let path = test.getAttribute("src");
		// 	//   let temp;
		// 	//   if (path) {
		// 	//     temp = { path: path.split("/")[7] + "/" + path.split("/")[8] };
		// 	//     console.log("img:::::::", path);
		// 	//   }
		// });
	};

	return (
		<div
			className={`form_group ${noMargin ? "m-0" : ""} ${
				className ? className : ""
			}`}
			aria-disabled={isDisabled}
		>
			{label ? (
				typeof label === "string" ? (
					<label htmlFor="">
						{label} {isRequired && <span>*</span>}
					</label>
				) : (
					<>{label}</>
				)
			) : null}

			<CKEditor
				editor={WxCkEditor}
				placeholder={placeholder}
				data={defaultValue}
				onChange={onChangeHandle}
				disabled={isDisabled}
				config={editorConfig}
			/>

			{errorMessage ? (
				typeof errorMessage === "string" ? (
					<span
						className={`note_text ${color === "danger" && "text-danger"}`}
					>
						{errorMessage}
					</span>
				) : (
					<>{errorMessage}</>
				)
			) : null}
			{helpText ? (
				typeof helpText === "string" ? (
					<span
						className={`note_text ${color === "danger" && "text-danger"}`}
					>
						{helpText}
					</span>
				) : (
					<>{helpText}</>
				)
			) : null}
		</div>
	);
};

export default WXEditor;
