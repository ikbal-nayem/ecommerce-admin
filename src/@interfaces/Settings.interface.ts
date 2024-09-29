import { IFilePayload } from "./common.interface";

export interface ISiteOperator {
  id: string;
  name: string;
  username: string;
  roleName: string;
  roleCode: string;
  roleId: string;
  email: string;
  phone: string;
  updatedOn: number;
  status: boolean;
  isActive: true;
}

export interface INotificationSettingsItem {
  id: string;
  title: string;
  metaType: string;
  metaKey: string;
  description: string;
  isDefault: boolean;
  serial: number;
  email: boolean;
  sms: boolean;
  web: boolean;
  fcm: boolean;
}

export interface INotificationSettings {
  id: string;
  storeId: string;
  orderNotifications: INotificationSettingsItem[];
  accountNotifications: INotificationSettingsItem[];
}

export interface IDomainSettingsItem {
  id: string;
  isConfigured: boolean;
  isFreeSsl: boolean;
  sslRemarks: string;
  isOwnSsl: boolean;
  storeId: string;
  domainAddress: string;
  providerName: string;
  isPrimary: boolean;
  isDefault: boolean;
  createdOn: number;
}

export interface IDeliveryZoneItem {
  id: string;
  storeId: string;
  name: string;
  countryName: string;
  deliveryChargeAmount: number;
  hasAdvanceCharge: boolean;
  advanceDeliveryChargeAmount: number;
  isActive: boolean;
}
export interface IConfigureDeliverService {
  id: string;
  title: string;
  metaType: string;
  metaKey: string;
  isDefault: boolean;
  banner: string;
  isAvailable: boolean;
  apiKey: string;
  apiSecret: string;
  userId: string;
}

export interface IPolicySettings {
  id: string;
  storeId: string;
  title: string;
  description: string;
  slug: string;
  metaKey: string;
}

export interface IPagesSettings {
  id?: string;
  storeId?: string;
  title: string;
  slug: string;
  description: string;
  tags: string;
  isActive: boolean;
}

export interface IPreferencesSettings {
  id?: string;
  siteTitle?: string;
  siteAuthor?: string;
  siteDesc?: string;
  cartButtonText?: string;
  siteKeywords?: string;
  siteLogo?: IFilePayload | null;
  favicon?: IFilePayload | null;
  socialImage?: IFilePayload | null;
}

export interface IRateInfo {
  emailRate: number;
  maskingSmsRate: number;
  nonMaskingSmsRate: number;
}

export interface IMerchantPurchase {
  id?: string;
  couponId?: string;
  currencyId?: string;
  serviceMetaKey?: string;
  storeId?: string;
  quantity?: number;
  sellingPrice?: number;
  vatTaxAmount?: number;
  couponAmount?: number;
  purchaseNote?: string;
  merchantPurchaseLine?: {
    id: string;
    merchantPurchaseId: string;
    serviceMetaId: string;
    quantity: number;
    sellingPrice: number;
    vatTaxAmount: number;
    subTotal: number;
    costPrice: number;
    serviceDescription: string;
  };
  merchantPurchaseInvoice?: {
    id: string;
    merchantPurchaseId: string;
    storeId: string;
    paymentStatusId: string;
    orderStatusId: string;
    payAmount: number;
    invoiceDetails: string;
    invoiceNo: string;
    currencyCode: string;
  };
}
