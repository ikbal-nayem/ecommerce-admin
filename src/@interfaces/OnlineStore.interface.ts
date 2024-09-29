export interface IMenusetMenu {
	id?: string;
	name?: string;
	isActive?: boolean;
	url?: string;
	isCustom?: boolean;
	children?: IMenusetMenu[];
}

export interface IMenuset {
	id: string;
	storeId: string;
	name: string;
	isActive: boolean;
	isDefault: boolean;
	menu: IMenusetMenu[];
}

