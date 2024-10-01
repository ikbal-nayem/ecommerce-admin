import WxButton from "@components/WxButton";
import WxDrawer from "@components/WxDrawer";
import WxDrawerBody from "@components/WxDrawer/WxDrawerBody";
import WxDrawerFooter from "@components/WxDrawer/WxDrawerFooter";
import WxDrawerHeader from "@components/WxDrawer/WxDrawerHeader";
import { useState } from "react";
import "./RequestWithdraw.scss";

function RequestWithdraw() {
	const [drawer_open, setDrawerOpen] = useState<boolean>(false);

	const handleClose = () => setDrawerOpen(false);

	return (
		<div>
			<WxButton
				color="primary"
				variant="fill"
				onClick={() => setDrawerOpen(true)}
			>
				Request for withdraw
			</WxButton>
			<WxDrawer show={drawer_open} handleClose={handleClose}>
				<div className="withdraw_request">
					<WxDrawerHeader
						title="Withdraw request"
						closeIconAction={handleClose}
					/>

					<WxDrawerBody>
						<h3>Comming soon...</h3>
					</WxDrawerBody>

					<WxDrawerFooter>
						<div className="withdraw_request__footer">
							<WxButton
								className="me-3"
								variant="outline"
								color="secondary"
								onClick={handleClose}
							>
								Cancel
							</WxButton>
							<WxButton variant="fill">Save</WxButton>
						</div>
					</WxDrawerFooter>
				</div>
			</WxDrawer>
		</div>
	);
}

export default RequestWithdraw;
