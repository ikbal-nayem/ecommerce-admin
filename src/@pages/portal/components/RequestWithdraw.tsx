import {Button} from "@components/Button";
import Drawer from "@components/Drawer";
import DrawerBody from "@components/Drawer/DrawerBody";
import DrawerFooter from "@components/Drawer/DrawerFooter";
import DrawerHeader from "@components/Drawer/DrawerHeader";
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
			<Drawer show={drawer_open} handleClose={handleClose}>
				<div className="withdraw_request">
					<DrawerHeader
						title="Withdraw request"
						onClickClose={handleClose}
					/>

					<DrawerBody>
						<h3>Comming soon...</h3>
					</DrawerBody>

					<DrawerFooter>
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
					</DrawerFooter>
				</div>
			</Drawer>
		</div>
	);
}

export default RequestWithdraw;
