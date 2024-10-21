import WxMainFull from "@components/MainContentLayout/WxMainFull";
import { FormHeader } from "@components/FormLayout";
import WxIcon from "@components/Icon";
import { IPortalOverview } from "@interfaces/portal.interface";
import { PORTAL_PARTNERS } from "routes/path-name.route";
import { ProfileService } from "services/api/settings/Profile.service";
import Preloader from "services/utils/preloader.service";
import { ToastService } from "services/utils/toastr.service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RequestWithdraw from "../components/RequestWithdraw";
import "./Overview.scss";

export default function Overview() {
	const [overviewData, setOverviewData] = useState<IPortalOverview>();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const navigate = useNavigate();

	useEffect(() => {
		ProfileService.getOverview()
			.then((res) => setOverviewData(res.body))
			.catch((err) => ToastService.error(err.message))
			.finally(() => setIsLoading(false));
	}, []);

	return (
		<WxMainFull>
			<FormHeader title="Overview" noBack />
			<div className="portal_overview">
				<h6>Referred users</h6>
				<div className="card p-4">
					{isLoading ? (
						<Preloader />
					) : (
						<div className="row card_info">
							<div className="col-md-4">
								<div className="d-flex align-items-center gap-3">
									<WxIcon icon="groups" className="groups" />
									<p>
										Total partner
										<h5 className="text_h5 text_semibold m-0">
											{overviewData?.user?.totalUser || 0}
										</h5>
									</p>
								</div>
							</div>
							<div className="col-md-4">
								<div className="d-flex align-items-center gap-3">
									<WxIcon
										icon="group"
										className="group"
										onClick={() => navigate(PORTAL_PARTNERS + "?tabIndex=1")}
									/>
									<p>
										Paid partners
										<h5 className="text_h5 text_semibold m-0">
											{overviewData?.user?.paidUser || 0}
										</h5>
									</p>
								</div>
							</div>
							<div className="col-md-4">
								<div className="d-flex align-items-center gap-3">
									<WxIcon
										icon="group"
										className="group"
										onClick={() => navigate(PORTAL_PARTNERS + "?tabIndex=0")}
									/>
									<p>
										Free partners
										<h5 className="text_h5 text_semibold m-0">
											{overviewData?.user?.freeUser || 0}
										</h5>
									</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			<div className="mt-5 portal_overview">
				<div className="d-flex justify-content-between align-items-end mb-2">
					<h6>Payment information</h6>
					{/* <RequestWithdraw /> */}
				</div>
				{isLoading ? (
					<Preloader />
				) : (
					<div className="card p-4">
						<div className="row card_info">
							<div className="col-md-4">
								<div className="d-flex align-items-center gap-3">
									<WxIcon
										icon="analytics"
										className="bank_total"
										variants="outlined"
									/>
									<p>
										Total payment method
										<h5 className="text_h5 text_semibold m-0">
											{overviewData?.paymentMethod?.totalCount}
										</h5>
									</p>
								</div>
							</div>
							<div className="col-md-4">
								<div className="d-flex align-items-center gap-3">
									<WxIcon icon="account_balance" className="bank_info" />
									<p>
										Bank
										<h5 className="text_h5 text_semibold m-0">
											{overviewData?.paymentMethod?.bankCount}
										</h5>
									</p>
								</div>
							</div>
							<div className="col-md-4">
								<div className="d-flex align-items-center gap-3">
									<WxIcon icon="account_balance_wallet" className="bank_info" />
									<p>
										Mobile (MFS)
										<h5 className="text_h5 text_semibold m-0">
											{overviewData?.paymentMethod?.mfsCount}
										</h5>
									</p>
								</div>
							</div>
						</div>

						<div className="row card_info mt-5">
							<div className="col-md-4">
								<div className="d-flex align-items-center gap-3">
									<WxIcon icon="payments" className="payments" />
									<p>
										Total Income
										<h5 className="text_h5 text_semibold m-0">
											BDT 0
										</h5>
									</p>
								</div>
							</div>
							<div className="col-md-4">
								<div className="d-flex align-items-center gap-3">
									<WxIcon icon="money" className="money" />
									<p>
										Last Withdraw
										<h5 className="text_h5 text_semibold m-0">
											BDT 0
										</h5>
									</p>
								</div>
							</div>
							<div className="col-md-4">
								<div className="d-flex align-items-center gap-3">
									<WxIcon icon="event_available" className="event_available" />
									<p>
										Available Withdraw
										<h5 className="text_h5 text_semibold m-0">
											BDT 0
										</h5>
									</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</WxMainFull>
	);
}
