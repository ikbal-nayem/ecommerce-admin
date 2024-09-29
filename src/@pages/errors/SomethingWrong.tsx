import React, { FC } from "react";
import WxButton from "@components/WxButton";
import WxIcon from "@components/WxIcon/WxIcon";
import { ReactComponent as SomethingWrongSVG } from "assets/svg/something-wrong.svg";

const SomethingWrong: FC = () => {
	return (
		<div className="wx__w-100">
			<div className="wx__card wx__text-center wx__p-5 wx__d-flex wx__align-items-center wx__justify-content-center">
				<h2 className="wx__text_regular wx__text_h2 wx__mb-4">Oops!</h2>
				<SomethingWrongSVG height={250} />
				<p className="wx__text_body wx__text_regular wx__my-4">
					Something went wrong!
				</p>
				<WxButton variant="fill">
					<WxIcon icon="refresh" onClick={() => window.location.reload()} />
					&nbsp; Reload
				</WxButton>
			</div>
		</div>
	);
};

export default SomethingWrong;
