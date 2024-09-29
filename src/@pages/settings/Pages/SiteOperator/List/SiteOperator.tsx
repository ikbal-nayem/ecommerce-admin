import WxAlert from "@components/Alert/WxAlert";
import { ConfirmationModal } from "@components/ConfirmationModal/ConfirmationModal";
import WxMainXl from "@components/MainContentLayout/WxMainXl";
import WxNotFound from "@components/NotFound/WxNotFound";
import WxButton from "@components/WxButton";
import { WxFormHeader } from "@components/WxFormLayout";
import WxTableSkelton from "@components/WxSkelton/WxTableSkeleton";
import {
	SETTINGS,
	SETTINGS_PRICING_PLAN,
	SETTINGS_SITE_OPERATOR_ADD,
} from "routes/path-name.route";
import { SiteOperatorService } from "services/api/settings/SiteOperator.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import SiteOperatorListTable from "../../../Components/SiteOperatorListTable/SiteOperatorListTable";

const SiteOperator = () => {
	const [siteOperatorData, setSiteOperatorData] = useState<any>([]);
	const [deletedData, setDeletedData] = useState<any>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [statusConfirmation, setStatusConfirmation] = useState<boolean>(false);
	const [statusUpdateInfo, setStatusUpdateInfo] = useState<any>();
	const [confirmationModal, setConfirmationModal] = useState<boolean>(false);
	const navigate = useNavigate();

	const {
		activePlan: { storeOperatorCount },
	} = useSelector((data: any) => data?.user);

	useEffect(() => {
		getSiteOperatorList();
	}, []);

	const getSiteOperatorList = () => {
		SiteOperatorService.getList()
			.then((res) => {
				setSiteOperatorData(res.body);
				// setMetaData(res.meta);
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setIsLoading(false);
			});
	};

	const onDelete = (tempData: string) => {
		if (!tempData) return;
		setConfirmationModal(true);
		setDeletedData(tempData);
	};

	const onConfirmDelete = () => {
		setIsSubmitting(true);
		if (!deletedData) return;
		setConfirmationModal(false);
		SiteOperatorService.deleteOperator(deletedData.id)
			.then((res) => {
				ToastService.success(res.message);
				getSiteOperatorList();
			})
			.catch((err) => ToastService.error(err.message))
			.finally(() => {
				setConfirmationModal(false);
				setDeletedData("");
				setIsLoading(true);
				setIsSubmitting(false);
			});
	};

	const onOperatorStatusUpdate = (index, id, status) => {
		if (!id) return;
		setStatusConfirmation(true);
		setStatusUpdateInfo({ index, id, status });
	};

	const onConfirmStatusUpdate = () => {
		if (!statusUpdateInfo.id) {
			ToastService.error("Site Operator Information is not Valid!");
			setStatusUpdateInfo("");
			return;
		}
		setIsSubmitting(true);
		const payload = {
			id: statusUpdateInfo.id,
			isActive: statusUpdateInfo.status,
		};
		SiteOperatorService.update(payload)
			.then((res) => {
				ToastService.success("Site Operator status updated successfully");
				siteOperatorData[statusUpdateInfo.index].isActive = payload.isActive;
				setSiteOperatorData([...siteOperatorData]);
			})
			.catch((err) => {
				ToastService.error(err.message);
			})
			.finally(() => {
				setStatusConfirmation(false);
				setIsSubmitting(false);
				setStatusUpdateInfo({});
			});
	};

	return (
		<div>
			<WxMainXl className="site-operator">
				<WxFormHeader
					title="Site Operator"
					backNavigationLink={SETTINGS}
					rightContent={
						<WxButton
							variant="fill"
							onClick={() => navigate(SETTINGS_SITE_OPERATOR_ADD)}
							disabled={storeOperatorCount <= siteOperatorData?.length}
						>
							Add Operator
						</WxButton>
					}
				/>

				{storeOperatorCount <= siteOperatorData?.length ? (
					<WxAlert>
						Please upgrade your <Link to={SETTINGS_PRICING_PLAN}>plan</Link> to
						add site operator.
					</WxAlert>
				) : null}

				{isLoading ? <WxTableSkelton rows={5} columns={5} /> : null}

				{!isLoading && !siteOperatorData.length ? (
					<WxNotFound
						title="No Site Operator found!"
						btn_link={
							storeOperatorCount <= siteOperatorData?.length
								? null
								: SETTINGS_SITE_OPERATOR_ADD
						}
						btn_text={
							storeOperatorCount <= siteOperatorData?.length
								? ""
								: "Create Site Operator"
						}
					/>
				) : null}

				{siteOperatorData?.length && !isLoading ? (
					<div className="wx__card">
						<SiteOperatorListTable
							onDelete={onDelete}
							siteOperatorData={siteOperatorData}
							onChangeStatus={onOperatorStatusUpdate}
						/>
					</div>
				) : null}
			</WxMainXl>
			<ConfirmationModal
				onConfirm={() => onConfirmDelete()}
				isOpen={confirmationModal}
				setIsOpen={setConfirmationModal}
				isSubmitting={isSubmitting}
				title="Coupon Delete Confirmation!"
				body={
					<span>
						Do you want to delete <b>{deletedData?.full_name}</b>? This action
						will delete permanently.
					</span>
				}
			/>

			<ConfirmationModal
				onConfirm={() => onConfirmStatusUpdate()}
				isOpen={statusConfirmation}
				isSubmitting={isSubmitting}
				setIsOpen={setStatusConfirmation}
				title="Status Change"
				onConfirmLabel="Yes, Change"
				body={`Do you want to change the status?`}
			/>
		</div>
	);
};

export default SiteOperator;
