import {Button} from "@components/Button";
import WxDrawer from "@components/Drawer";
import WxDrawerBody from "@components/Drawer/DrawerBody";
import WxDrawerFooter from "@components/Drawer/DrawerFooter";
import WxDrawerHeader from "@components/WxDrawer/WxDrawerHeader";
import { useState } from "react";
import "./RequestWithdraw.scss";

function RequestWithdraw() {
	const [drawer_open, setDrawerOpen] = useState<boolean>(false);

	const handleClose = () => setDrawerOpen(false);

	return (
		<div>
			<Button
				color="primary"
				variant="fill"
				onClick={() => setDrawerOpen(true)}
			>
				Request for withdraw
			</Button>
			<WxDrawer show={drawer_open} handleClose={handleClose}>
				<div className="withdraw_request">
					<WxDrawerHeader
						title="Withdraw request"
						onClickClose={handleClose}
					/>

					<WxDrawerBody>
						<h3>Comming soon...</h3>
					</WxDrawerBody>

					<WxDrawerFooter>
						<div className="withdraw_request__footer">
							<Button
								className="me-3"
								variant="outline"
								color="secondary"
								onClick={handleClose}
							>
								Cancel
							</Button>
							<Button variant="fill">Save</Button>
						</div>
					</WxDrawerFooter>
				</div>
			</WxDrawer>
		</div>
	);
}

export default RequestWithdraw;
