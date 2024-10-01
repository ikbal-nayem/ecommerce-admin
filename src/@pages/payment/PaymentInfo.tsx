import WxMainLg from "@components/MainContentLayout/WxMainLg";
import WxButton from "@components/WxButton";
import WxIcon from "@components/WxIcon/WxIcon";
import { SETTINGS_BILLING } from "routes/path-name.route";
import { AuthService } from "services/api/Auth.service";
import { InvoiceService } from "services/api/Invoice.service";
import Preloader from "services/utils/preloader.service";
import { AuthContext } from "context/auth";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchParamsToObject } from "utils/makeObject";


const PaymentInfo = () => {
	const [invoiceInfo, setInvoiceInfo] = useState<any>({});
	const [isLoading, setIsLoading] = useState<boolean>(true);
	let [searchParams] = useSearchParams();
	const { logout } = useContext(AuthContext);

	const navigate = useNavigate();

	const { accessToken } = useSelector((data: any) => data.user);

	const params: any = searchParamsToObject(searchParams);

	if (params?.logout) {
		AuthService.logout({ token: accessToken }).then((res: any) => {
			logout();
		});
	}

	useEffect(() => {
		setIsLoading(true);
		InvoiceService.getInvoiceInfo(params.invoiceId)
			.then((resp) => setInvoiceInfo(resp.body))
			.finally(() => setIsLoading(false));
	}, [params.invoiceId]);

	if (isLoading) return <Preloader />;

	return (
		<WxMainLg>
			<div className="card wx__p-5 wx__text-center">
				<WxIcon
					icon={params?.status === "success" ? "task_alt" : "cancel"}
					size={100}
					color={params?.status === "success" ? "success" : "danger"}
				/>
				{params?.status === "success" ? <h3>Thank you!</h3> : <h3>Failed!</h3>}
				<span>{params?.msg}</span>

				<div className="wx__my-5">
					<ul className="list-group list-group-flush">
						<li className="list-group-item">
							<div className="d-flex wx__justify-content-between">
								<span>Invoice No</span>
								<b>#{invoiceInfo?.merchantInvoice?.invoiceNo}</b>
							</div>
						</li>
						<li className="list-group-item">
							<div className="d-flex wx__justify-content-between">
								<span>Payment status</span>
								<span>{invoiceInfo?.merchantInvoice?.paymentStatus}</span>
							</div>
						</li>
						<li className="list-group-item">
							<div className="d-flex wx__justify-content-between">
								<span>Total amount</span>
								<span>
									{invoiceInfo?.merchantInvoice?.currencyCode}&nbsp;&nbsp;
									{invoiceInfo?.merchantPurchases?.totalPayableAmount?.toLocaleString()}
								</span>
							</div>
						</li>
						<li className="list-group-item">
							<div className="d-flex wx__justify-content-between">
								<strong>Invoice amount</strong>
								<strong>
									{invoiceInfo?.merchantInvoice?.currencyCode}&nbsp;&nbsp;
									{invoiceInfo?.merchantInvoice?.payAmount?.toLocaleString()}
								</strong>
							</div>
						</li>
					</ul>
				</div>

				<div className="row">
					<div className="col-sm-6 col-12 d-flex wx__justify-content-sm-end wx__justify-content-center">
						<WxButton
							color="primary"
							variant="outline"
							onClick={() => navigate(SETTINGS_BILLING)}
						>
							<WxIcon icon="keyboard_backspace" className="wx__me-2" />
							Show all invoices
						</WxButton>
					</div>
					<div className="col-sm-6 col-12 d-flex wx__justify-content-sm-start wx__justify-content-center">
						{params?.status === "success" ? (
							<WxButton
								color="primary"
								variant="fill"
								className="wx__mt-sm-0 wx__mt-2"
								onClick={() =>
									InvoiceService.downloadInvoice(params?.invoiceId)
								}
							>
								<WxIcon icon="file_download" className="wx__me-2" />
								Download Invoice
							</WxButton>
						) : null}
					</div>
				</div>
			</div>
		</WxMainLg>
	);
};

export default PaymentInfo;
