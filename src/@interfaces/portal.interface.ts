export interface IPortalOverview {
	user: {
		totalUser: number;
		freeUser: number;
		paidUser: number;
	};
	paymentMethod: {
		totalCount: number;
		mfsCount: number;
		bankCount: number;
	};
}

export interface IPartner {
	storeId: string;
	storeName: string;
	currentPlan: string;
	nextRenewalDate: number;
	ownerId: string;
	ownerName: string;
	ownerEmail: string;
	ownerPhone: string;
	purchaseDate: number;
	joiningDate: number;
	ownerImage: string;
}

export interface IPartnerPaymentInfo {
	id: string;
	planTitle: string;
	invoiceId: string;
	purchaseId: string;
	storeId: string;
	payAmount: number;
	currency: string;
	gatewayAmount: number;
	gatewayCurrency: string;
	tranDate: number;
	bankTranId: string;
	tranId: string;
	cardIssuer: string;
	pgTxnid: string;
	payGateway: string;
	isSettled: boolean;
	serviceMetaKey: string;
	status: string;
}


export interface IPortalPaymentMedia {
	id: string;
	userId: string;
	paymentMediaId: string;
	paymentMedia: {
		id: string;
		title: string;
		type: string;
		typeMeta: {
			id: string;
			title: string;
			metaType: string;
			metaKey: string;
			isDefault: boolean;
			serial: number;
		};
	};
	accountName: string;
	accountNumber: string;
	branchName: string;
	mobile: string;
}