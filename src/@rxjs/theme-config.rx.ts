import { ThemeCustomizationService } from "services/api/settings/ThemeCustomization.service";
import { ToastService } from "services/utils/toastr.service";
import { Dispatch } from "react";
import { Subject } from "rxjs";

const initState = {
	themeName: "",
	sections: [{}],
	isLoading: true,
};

let state = initState;

const subject = new Subject();

export const themeConfig$ = {
	init: () => subject.next(state),
	subscribe: (setState: Dispatch<any>) => subject.subscribe(setState),
	get: () => {
		subject.next({ ...state, isLoading: true });
		ThemeCustomizationService.themeSectionNavList()
			.then(({ body }) => {
				state = { ...body, isLoading: false };
				subject.next(state);
			})
			.catch((err) => ToastService.error(err.message));
	},
	initState,
};
