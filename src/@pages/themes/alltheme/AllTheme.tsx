import WxMainXl from "@components/MainContentLayout/WxMainXl";
import WxNotFound from "@components/NotFound/NotFound";
import Select from "@components/Select/Select";
import { FormHeader } from "@components/FormLayout";
import Icon from "@components/Icon";
import TextInput from "@components/TextInput";
import {
	ITheme,
	IThemeInstalled,
} from "@interfaces/themeCustomization.interface";
import { THEMES } from "routes/path-name.route";
import { ThemeService } from "services/api/onlineStore/themes/Theme.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useDebounce from "utils/debouncer";
import ThemeList from "./components/allview/ThemeList";

const defaultMeta = {
	offset: 0,
	prevOffset: 0,
	nextOffset: 0,
	limit: 4,
	totalRecords: 4,
	resultCount: 4,
	totalPageCount: 1,
	sort: [
		{
			order: "desc",
			field: "createdOn",
		},
	],
};

const categories = [
	{
		id: 1,
		text: "Category 1",
	},
	{
		id: 1,
		text: "Category 2",
	},
	{
		id: 1,
		text: "Category 3",
	},
];

const AllTheme = () => {
	const [themeList, setThemeList] = useState<ITheme[]>();
	const [installedThemes, setInstalledThemes] = useState<IThemeInstalled[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	// pagination states
	const [metaData, setMetaData] = useState<any>(defaultMeta);
	const [searchParams, setSearchParams] = useSearchParams();
	const [currentPage, setCurrentPage] = useState<number>(
		Number(searchParams.get("page"))
			? Number(searchParams.get("page")) - 1
			: null || 0
	);
	const [paginationLimit, setPaginationLimit] = useState(10);

	// search states
	const [searchQuery, setSearchQuery] = useState<string>(null);
	let search: string = useDebounce(searchQuery, 500);

	useEffect(() => {
		setIsLoading(true);
		getInstalledThemes();
		ThemeService.getList({ body: { limit: 5, offset: 0 } })
			.then((resp) => setThemeList(resp.body))
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsLoading(false));
	}, []);

	const getInstalledThemes = () => {
		ThemeService.getInstalledTheme({}).then((resp) =>
			setInstalledThemes(resp.body)
		);
	};

	const [selectcategories, setSelectcategories] = useState<string>("");

	const onChangeCategories = (value: any) => {
		setSelectcategories(value.target.value);
	};

	return (
		<WxMainXl>
			<FormHeader title="All themes" backNavigationLink={THEMES} />
			<div className="card p-4">
				<div className="row">
					<div className="col-md-8 col-sm-12">
						<TextInput
							type="search"
							placeholder="Search themes"
							startIcon={<Icon icon="search" />}
							onChange={(e: any) => setSearchQuery(e.target.value)}
						/>
					</div>
					<div className="col-md-4 col-sm-12">
						<Select
							placeholder="Choose category"
							valuesKey="id"
							textKey="text"
							options={categories}
							onChange={onChangeCategories}
						/>
					</div>
				</div>
				{isLoading ? (
					<Preloader />
				) : (
					<ThemeList themeList={themeList} installedThemes={installedThemes} />
				)}
				{!isLoading && !themeList?.length ? (
					<WxNotFound title="Oops!" description="No themes found." />
				) : null}
			</div>
		</WxMainXl>
	);
};

export default AllTheme;
