import WxMainXl from "@components/MainContentLayout/WxMainXl";
import WxNotFound from "@components/NotFound/NotFound";
import WxSelect from "@components/Select/WxSelect";
import { WxFormHeader } from "@components/WxFormLayout";
import WxIcon from "@components/Icon";
import TextInput from "@components/TextInput";
import { IAppDetails, IInstalledApp } from "@interfaces/app.interface";
import { APPS } from "routes/path-name.route";
import { AppsService, AppsTypesService } from "services/api/Apps.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useDebounce from "utils/debouncer";
import SuggestedApp from "../SuggestedApps/Suggested";
import "./AppsList.scss";

const AppsList = () => {
	const [appListData, setappListData] = useState<IAppDetails[]>([]);
	const [installedApp, setInstalledApp] = useState<IInstalledApp[]>();
	const [appTypes, setAppTypes] = useState();
	const [selectedCategory, setSelectedCategory] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<number>(0);
	const [paginationLimit, setPaginationLimit] = useState(10);

	const [searchQuery, setSearchQuery] = useState<string>(null);
	let search: string = useDebounce(searchQuery, 500);

	const { activePlan } = useSelector((data: any) => data.user);

	useEffect(() => {
		AppsTypesService.get().then((resp) => setAppTypes(resp.body));
		AppsService.getInstalledApp().then((res) => setInstalledApp(res.body));
	}, []);

	useEffect(() => {
		if (selectedCategory || search || currentPage || paginationLimit) getApps();
	}, [selectedCategory, search, currentPage, paginationLimit]);

	const getApps = () => {
		let value = {
			body: {
				packageLevel: activePlan?.level,
				searchKey: search || null,
				appTypesId: selectedCategory || null,
			},
			meta: {
				offset: currentPage,
				limit: paginationLimit,
			},
		};
		setIsLoading(true);
		AppsService.get(value)
			.then((res: any) => setappListData(res.body))
			.catch((err) => ToastService.error(err))
			.finally(() => setIsLoading(false));
	};

	return (
		<WxMainXl className="wx__apps_list_page">
			<WxFormHeader title="Browse All Apps" backNavigationLink={APPS} />
			<div className="card mt-3 p-4">
				<div className="row  pb-0 app-list-top">
					<div className="col-md-8 col-sm-12 mb-3">
						<TextInput
							className="mb-0"
							type="search"
							placeholder="Search apps"
							startIcon={<WxIcon icon="search" />}
							onChange={(e: any) => setSearchQuery(e.target.value)}
						/>
					</div>
					<div className="col-md-4 col-sm-12 mb-0">
						<WxSelect
							placeholder="Select category"
							valuesKey="id"
							textKey="title"
							options={appTypes}
							onChange={(e) => setSelectedCategory(e.target.value)}
						/>
					</div>
				</div>
				<div className="row">
					<div className="wx__suggested_product">
						{isLoading ? (
							<Preloader />
						) : (
							<SuggestedApp
								appListData={appListData}
								installedApps={installedApp}
							/>
						)}
						{!isLoading && !appListData?.length ? (
							<WxNotFound title="Oops!" description="No apps found." />
						) : null}
					</div>
				</div>
			</div>
		</WxMainXl>
	);
};

export default AppsList;
