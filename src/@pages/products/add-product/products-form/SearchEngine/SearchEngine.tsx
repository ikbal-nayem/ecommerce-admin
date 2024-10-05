import "./SearchEngine.scss";
import React, { useEffect, useState } from "react";
import WxHr from "@components/WxHr";
import TextInput from "@components/TextInput";
import WxTextarea from "@components/WxTextarea";
import { useFormContext } from "react-hook-form";
import makeSlug from "utils/make-slug";
import {Button} from "@components/Button";
import useDebounce from "utils/debouncer";
import WxIcon from "@components/Icon";

const SearchEngine = () => {
	const [editSEO, setEditSEO] = useState(false);
	const { register, watch, setValue } = useFormContext();

	const productName = watch("title");
	const seoUrl = watch("seo.url");

	const url = useDebounce(seoUrl, 500)

	useEffect(() => {
		productName && setValue("seo.url", makeSlug(productName));
	}, [productName]);
	
	useEffect(() => {
		setValue("seo.url", makeSlug(url));
	}, [url]);

	return (
		<div className="card search_engine p-3 mt-4">
			<h6 className="text_semibold text_h6">
				Search Engine Optimization
				<WxIcon variants="round" icon="help" role="button" />
			</h6>
			<span className="text_regular text_body">
				Add a title and description to see how this product might appear in a
				search engine listing
			</span>
			{editSEO ? (
				<>
					<WxHr />
					<TextInput
						label={
							<label className="d-flex align-items-center">
								Page Title &nbsp;
								<WxIcon
									variants="round"
									icon="help"
									className="text-dark"
									role="button"
								/>
							</label>
						}
						registerProperty={{ ...register("seo.metaTitle") }}
					/>
					<WxTextarea
						label={
							<label className="d-flex align-items-center">
								Meta Description &nbsp;
								<WxIcon
									variants="round"
									icon="help"
									className="text-dark"
									role="button"
								/>
							</label>
						}
						rows={3}
						helpText="0 out of 320 charecters used"
						registerProperty={{ ...register("seo.metaDescription") }}
					/>
					<TextInput
						noMargin
						label={
							<label className="d-flex align-items-center">
								URL Handle &nbsp;
								<WxIcon
									variants="round"
									icon="help"
									className="text-dark"
									role="button"
								/>
							</label>
						}
						placeholder="Pre"
						registerProperty={{ ...register("seo.url") }}
					/>
				</>
			) : (
				<div className="mt-3">
					<Button variant="outline" onClick={() => setEditSEO(true)}>
						Edit SEO
					</Button>
				</div>
			)}
		</div>
	);
};

export default SearchEngine;
