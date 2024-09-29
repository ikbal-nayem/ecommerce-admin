import { EXIT_DOWNGRADE_PLAN } from "routes/path-name.route";
import { DowngradeService } from "services/api/settings/Downgrade.service";
import { ToastService } from "services/utils/toastr.service";
import { Subject } from "rxjs";
import { IDowngradeStatus } from "./interfaces.rx";

const initState: IDowngradeStatus = {
	checks: {
		isStoreOperatorCheckPassed: false,
		isProductImageCheckPassed: false,
		isProductVariationCheckPassed: false,
		isThemeCheckPassed: false,
		isAppCheckPassed: false,
	},
	isOverallPassed: false,
	isLoading: true,
};

let state = initState;

const subject = new Subject();

export const downgrade$ = {
	init: () => subject.next(state),
	subscribe: (setState) => subject.subscribe(setState),
	setInfo: (planId: string) => {
		subject.next({ ...state, isLoading: true });
		DowngradeService.isDowngradable(planId)
			.then(({ body }) => {
				state = { ...body, isLoading: false };
				subject.next(state);
			})
			.catch((err) => {
				ToastService.error(err.message);
				window.location.replace(EXIT_DOWNGRADE_PLAN);
			});
	},
	initState,
};
