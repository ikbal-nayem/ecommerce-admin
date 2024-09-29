import "./SearchEngine.scss";
import React, { useEffect, useState } from "react";
import WxHr from "@components/WxHr";
import WxInput from "@components/WxInput";
import WxTextarea from "@components/WxTextarea";
import { useFormContext } from "react-hook-form";
import makeSlug from "utils/make-slug";
import WxButton from "@components/WxButton";
import useDebounce from "utils/debouncer";
import WxIcon from "@components/WxIcon/WxIcon";

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
		<div className="wx__card search_engine wx__p-3 wx__mt-4">
			<h6 className="wx__text_semibold wx__text_h6">
				Search Engine Optimization
				<WxIcon variants="round" icon="help" role="button" />
			</h6>
			<span className="wx__text_regular wx__text_body">
				Add a title and description to see how this product might appear in a
				search engine listing
			</span>
			{editSEO ? (
				<>
					<WxHr />
					<WxInput
						label={
							<label className="wx__d-flex wx__align-items-center">
								Page Title &nbsp;
								<WxIcon
									variants="round"
									icon="help"
									className="wx__text-dark"
									role="button"
								/>
							</label>
						}
						registerProperty={{ ...register("seo.metaTitle") }}
					/>
					<WxTextarea
						label={
							<label className="wx__d-flex wx__align-items-center">
								Meta Description &nbsp;
								<WxIcon
									variants="round"
									icon="help"
									className="wx__text-dark"
									role="button"
								/>
							</label>
						}
						rows={3}
						helpText="0 out of 320 charecters used"
						registerProperty={{ ...register("seo.metaDescription") }}
					/>
					<WxInput
						noMargin
						label={
							<label className="wx__d-flex wx__align-items-center">
								URL Handle &nbsp;
								<WxIcon
									variants="round"
									icon="help"
									className="wx__text-dark"
									role="button"
								/>
							</label>
						}
						placeholder="Pre"
						registerProperty={{ ...register("seo.url") }}
					/>
				</>
			) : (
				<div className="wx__mt-3">
					<WxButton variant="outline" onClick={() => setEditSEO(true)}>
						Edit SEO
					</WxButton>
				</div>
			)}
		</div>
	);
};

export default SearchEngine;
