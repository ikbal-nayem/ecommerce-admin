import { ENV } from "./ENV.config";

export const ADMIN_SERVICE = "admin-service/";
export const EMAIL_SERVICE = "email-service/";
export const SETTING_SERVICE = "setting-service/";
export const CUSTOMER_SERVICE = "customer-service/";
export const PRODUCT_SERVICE = "product-service/";
export const PROFILE_SERVICE = "profile-service/";
export const APP_SERVICE = "plugin-service/";
export const ORDER_SERVICE = "order-service/";
export const DISCOUNT_SERVICE = "coupon-service/";
export const PAYMENT_SERVICE = "payment-service/";
export const THEME_SERVICE = "theme-service/";
export const THEME_REGISTER = THEME_SERVICE + "theme-register/";
export const THEME_RELEASE = THEME_SERVICE + "theme-release/";
export const MARKETING_SERVICE = "marketing-service/";
// export const ONLINE_STORE = "online-store/";

export const AUTH = "auth-service/merchant/";
export const GROUP_SERVICE = CUSTOMER_SERVICE + "customer-group-master/";
export const PRODUCT_CATEGORY = PRODUCT_SERVICE + "categories/";
export const PRODUCT_COLLECTION = PRODUCT_SERVICE + "collections/";
export const PRODUCT_VENDOR = PRODUCT_SERVICE + "vendors/";
export const FILE = "file-service/files/";
export const APPS_REGISTER = APP_SERVICE + "apps-register/";
export const APPS_RELEASE = APP_SERVICE + "apps-release/";
export const APPS_TYPES = APP_SERVICE + "apps-types/";
export const APPS_REVIEW = APP_SERVICE + "apps-review/";
export const APPS_REVIEW_REACTION = APP_SERVICE + "apps-review_reaction/";
export const APPS_BILLING = APP_SERVICE + "apps-billing-cycle/";

export const IMAGE_URL = ENV.ApiEndpoint + FILE + "public/preview";

export const SLIDER = SETTING_SERVICE + "sliders/";
export const SLIDER_ITEMS = SETTING_SERVICE + "slider-items/";
