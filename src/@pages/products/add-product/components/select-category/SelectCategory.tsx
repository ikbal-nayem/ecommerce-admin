import WxButton from "@components/Button";
import WxDrawer from "@components/WxDrawer";
import WxDrawerBody from "@components/WxDrawer/WxDrawerBody";
import WxDrawerFooter from "@components/WxDrawer/WxDrawerFooter";
import WxDrawerHeader from "@components/WxDrawer/WxDrawerHeader";
import { memo, useEffect, useState } from "react";
import {
	CategoryService,
	ICategoryPayload,
} from "services/api/products/Category.services";
import Preloader from "services/utils/preloader.service";
import "./SelectCategory.scss";
import SelectTree from "./SelectTree";

import { ToastService } from "services/utils/toastr.service";

type SelectCategoryProps = {
	selectedCategory?: ICategoryPayload;
	setCategory?: Function;
};

const SelectCategory = ({
	setCategory,
	selectedCategory,
}: SelectCategoryProps) => {
	const [drawer_open, setDrawerOpen] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [categories, setCategories] = useState<ICategoryPayload[]>([]);
	const [localSelect, setLocalSelect] =
		useState<ICategoryPayload>(selectedCategory);
		
	useEffect(() => {
		drawer_open && getCategory();
	}, [drawer_open]);

	const handleClose = () => setDrawerOpen(false);

	const getCategory = () => {
		setIsLoading(true);
		CategoryService.categoryGetByStoreId('')
			.then((res) => {
				if (res.body.length) setCategories(res.body);
			})
			.catch((err) => ToastService.error(err))
			.finally(() => setIsLoading(false));
	};

	const onFinalSelect = () => {
		setCategory(localSelect);
		handleClose();
	};

	return (
		<>
			<WxButton variant="outline" onClick={() => setDrawerOpen(true)}>
				Select Category
			</WxButton>
			<WxDrawer show={drawer_open} handleClose={handleClose}>
				<div className="wx__category_select">
					<WxDrawerHeader
						title="Select categories"
						closeIconAction={handleClose}
					/>

					<WxDrawerBody>
						{/* <TextInput
							type="search"
							startIcon={<WxIcon icon="search" />}
							placeholder="Search categories"
						/> */}

						{isLoading ? <Preloader absolutePosition /> : null}
						{!isLoading && !categories.length ? (
							<h6 className="text-center">No categories found!</h6>
						) : null}

						<div className="nested_categories">
							<SelectTree
								data={categories}
								setCategory={setLocalSelect}
								selectedCategory={localSelect}
							/>
						</div>
					</WxDrawerBody>

					<WxDrawerFooter>
						<div className="wx__category_select__footer">
							<WxButton
								className="me-3"
								variant="outline"
								color="secondary"
								onClick={handleClose}
							>
								Cancel
							</WxButton>
							<WxButton variant="fill" onClick={onFinalSelect}>
								Select Category
							</WxButton>
						</div>
					</WxDrawerFooter>
				</div>
			</WxDrawer>
		</>
	);
};

export default memo(SelectCategory);
