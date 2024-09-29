import { FC } from "react";

export interface IRoute {
	params?: { [key: string]: string };
	path: any;
	component: FC;
}
