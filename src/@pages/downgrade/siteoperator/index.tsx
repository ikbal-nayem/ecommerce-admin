import WxAlert from "@components/Alert/WxAlert";
import { ConfirmationModal } from "@components/ConfirmationModal/ConfirmationModal";
import WxMainXl from "@components/MainContentLayout/WxMainXl";
import WxNotFound from "@components/NotFound/WxNotFound";
import { WxFormHeader } from "@components/WxFormLayout";
import WxTableSkelton from "@components/WxSkelton/WxTableSkeleton";
import { ISiteOperator } from "@interfaces/Settings.interface";
import { downgrade$ } from "@rxjs/downgrade.rx";
import { IDowngradeStatus } from "@rxjs/interfaces.rx";
import { SiteOperatorService } from "services/api/settings/SiteOperator.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchParamsToObject } from "utils/makeObject";
import "./SiteOperator.scss";
import SiteOperatorListTable from "./SiteOperatorListTable";

const SiteOperator = () => {
	const [downgradeStatus, setDowngradeStatus] = useState<IDowngradeStatus>(
		downgrade$.initState
	);
	const [siteOperatorData, setSiteOperatorData] = useState<ISiteOperator[]>([]);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [confirmationModal, setConfirmationModal] = useState<boolean>(false);
	const deleteItem = useRef<ISiteOperator | null>(null);
	const [searchParams] = useSearchParams();
	const sParams: any = searchParamsToObject(searchParams);

	useEffect(() => {
		getSiteOperatorList();
		const subscription = downgrade$.subscribe(setDowngradeStatus);
		downgrade$.init();
		return () => subscription.unsubscribe();
	}, []);

	const getSiteOperatorList = () => {
		SiteOperatorService.getList()
			.then((res) => setSiteOperatorData(res.body))
			.finally(() => setIsLoading(false));
	};

	const onClose = () => {
		deleteItem.current = null;
		setConfirmationModal(false);
		setIsSubmitting(false);
	};

	const onDelete = (data: ISiteOperator) => {
		if (!data) return;
		deleteItem.current = data;
		setConfirmationModal(true);
	};

	const onConfirmDelete = () => {
		setIsSubmitting(true);
		if (!deleteItem.current) return;
		setConfirmationModal(false);
		SiteOperatorService.deleteOperator(deleteItem.current?.id)
			.then((res) => {
				ToastService.success(res.message);
				downgrade$.setInfo(sParams?.plan_id);
				getSiteOperatorList();
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => onClose());
	};

	return (
		<>
			<WxMainXl>
				<WxFormHeader title="Site operators" noBack />

				{!!siteOperatorData?.length && (
					<WxAlert>
						You can not have more than{" "}
						{downgradeStatus?.plan?.storeOperatorCount} site operator
					</WxAlert>
				)}

				{!isLoading ? (
					!siteOperatorData?.length ? (
						<WxNotFound title="No Site Operator found!" />
					) : null
				) : (
					<WxTableSkelton rows={5} columns={5} />
				)}

				{siteOperatorData?.length ? (
					<div className="wx__card wx__mt-3">
						<SiteOperatorListTable
							onDelete={onDelete}
							siteOperatorData={siteOperatorData}
						/>
					</div>
				) : null}
			</WxMainXl>
			<ConfirmationModal
				onConfirm={onConfirmDelete}
				isOpen={confirmationModal}
				onClose={onClose}
				isSubmitting={isSubmitting}
				title="Delete confirmation!"
				body={
					<span>
						Do you want to delete <b>{deleteItem.current?.name}</b>? This action
						will delete permanently.
					</span>
				}
			/>
		</>
	);
};

export default SiteOperator;
