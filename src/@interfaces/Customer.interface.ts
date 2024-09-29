export interface IAddressesPayload {
  id?: string;
  title?: string;
  addressLine1?: string;
  addressLine2?: string;
  cityName?: string;
  state?: string;
  postCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  customerId: string;
  type?: string;
  isDefault?: boolean;
}

export interface ICustomerPayload {
	id?: string;
	customerId?: string;
	storeId?: string | any;
	firstName?: string | any;
	lastName?: string | any;
	name: string | any;
	email?: string;
	phoneNumber?: string;
	status?: string;
	dateOfBirth?: number;
}

export interface ICustomerResponse {
	customer: ICustomerPayload;
	address?: IAddressesPayload[];
	groups?: {
		id: string;
		title: string;
		storeId: string;
	}[];
	balance?: {
		id: string;
		store: string;
		customer: ICustomerPayload;
		point: number;
		maskingSms: number;
		nonMaskingSms: number;
		emailCount: number;
		money: number;
		currency: string;
	};
}
