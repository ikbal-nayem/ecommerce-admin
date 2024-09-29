import WxMainXl from "@components/MainContentLayout/WxMainXl";
import WxNotFound from "@components/NotFound/WxNotFound";
import WxSelect from "@components/Select/WxSelect";
import { WxFormHeader } from "@components/WxFormLayout";
import WxIcon from "@components/WxIcon/WxIcon";
import WxInput from "@components/WxInput";
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
			<div className="wx__card wx__mt-3 wx__p-4">
				<div className="wx__row  wx__pb-0 app-list-top">
					<div className="wx__col-md-8 wx__col-sm-12 wx__mb-3">
						<WxInput
							className="wx__mb-0"
							type="search"
							placeholder="Search apps"
							startIcon={<WxIcon icon="search" />}
							onChange={(e: any) => setSearchQuery(e.target.value)}
						/>
					</div>
					<div className="wx__col-md-4 wx__col-sm-12 wx__mb-0">
						<WxSelect
							placeholder="Select category"
							valuesKey="id"
							textKey="title"
							options={appTypes}
							onChange={(e) => setSelectedCategory(e.target.value)}
						/>
					</div>
				</div>
				<div className="wx__row">
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
