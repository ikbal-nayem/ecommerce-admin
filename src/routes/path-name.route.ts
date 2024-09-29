export const BASE_PATH = "";

export const DASHBOARD: string = BASE_PATH + "/dashboard";
export const ANALYTICS: string = BASE_PATH + "/analytics";

export const PAYMENT: string = BASE_PATH + "/payment";
export const PAYMENT_INFO: string = PAYMENT + "/info";

export const CUSTOMERS: string = BASE_PATH + "/customers";
export const CUSTOMER_CREATE: string = CUSTOMERS + "/create";
export const CUSTOMER_DETAILS: Function = ({ id }) => `${CUSTOMERS}/${id}`;

export const ORDER: string = BASE_PATH + "/orders";
export const ORDER_CREATE: string = ORDER + "/create-order";
export const ORDER_DETAILS: ({ order_id }) => string = ({ order_id }) =>
  `${ORDER}/${order_id}`;
export const ORDER_EDIT: Function = ({ order_id }) =>
  `${ORDER}/${order_id}/edit`;
export const ORDER_REFUND: Function = ({ order_id }) =>
  `${ORDER}/${order_id}/refund`;
export const ORDER_RETURN: Function = ({ order_id }) =>
  `${ORDER}/${order_id}/return`;
export const ORDER_DELIVER: Function = ({ courier_service, order_id }) =>
  `${ORDER}/delivery/${courier_service}/${order_id}`;

export const ACCOUNT_SETTING: string = BASE_PATH + "/account-setting";
export const PRODUCT: string = BASE_PATH + "/products";
export const PRODUCT_DETAILS: Function = ({ product_id }) =>
  `${PRODUCT}/${product_id}`;
export const PRODUCT_CREATE: string = PRODUCT + "/create";
export const PRODUCT_INVENTORY: string = PRODUCT + "/inventory";
export const PRODUCT_COLLECTION: string = PRODUCT + "/collection";
export const PRODUCT_CATEGORY: string = PRODUCT + "/category";

export const DISCOUNT: string = BASE_PATH + "/discount";
export const DISCOUNT_CREATE: string = DISCOUNT + "/create";
export const DISCOUNT_EDIT: Function = ({ id }) => `${DISCOUNT}/${id}`;

export const APPS: string = BASE_PATH + "/apps";
export const APPS_LIST: string = APPS + "/list";
export const APP_DETAILS: Function = ({ id }) => `${APPS}/${id}/*`;
export const APP_OVERVIEW: Function = ({ id }) => `${APPS}/${id}/overview`;
export const APP_REVIEW: Function = ({ id }) => `${APPS}/${id}/review`;
export const APP_FQA: Function = ({ id }) => `${APPS}/${id}/faq`;

export const APP_STORE: Function = ({ appId }) =>
  BASE_PATH + `/app-store/${appId}`;

export const ONLINE_STORE: string = BASE_PATH + "/online-store";
export const PAGES: string = ONLINE_STORE + "/pages";
export const PAGES_EDIT: Function = ({ id }) => `${PAGES}/${id}`;
export const PAGES_CREATE: string = PAGES + "/create";

export const THEMES: string = ONLINE_STORE + "/themes";
export const THEME_DETAILS: Function = ({ id }) => `${THEMES}/${id}/*`;
export const THEMES_OVERVIEW: Function = ({ theme_id }) =>
  `${THEMES}/${theme_id}/overview`;
export const THEMES_REVIEW: Function = ({ theme_id }) =>
  `${THEMES}/${theme_id}/review`;
export const THEMES_SUPPORT: Function = ({ theme_id }) =>
  `${THEMES}/${theme_id}/support`;
export const THEMES_LIST: string = THEMES + "/list";

export const THEME_CUSTOMIZATION: string = THEMES + "/customization";
export const THEME_CUSTOMIZATION_S: ({ section_key }) => string = ({
  section_key,
}) => `${THEME_CUSTOMIZATION}/s/${section_key}`;
export const THEME_CUSTOMIZATION_GENERAL: string =
  THEME_CUSTOMIZATION + "/general";
export const THEME_CUSTOMIZATION_HOMEPAGE: string =
  THEME_CUSTOMIZATION + "/homepage";
export const THEME_CUSTOMIZATION_SOCIAL: string =
  THEME_CUSTOMIZATION + "/social";
export const THEME_CUSTOMIZATION_TYPOGRAPHY: string =
  THEME_CUSTOMIZATION + "/typography";
export const THEME_CUSTOMIZATION_FOOTER: string =
  THEME_CUSTOMIZATION + "/footer";
export const THEME_CUSTOMIZATION_COLOR: string = THEME_CUSTOMIZATION + "/color";
export const THEME_CUSTOMIZATION_SLIDER: string =
  THEME_CUSTOMIZATION + "/sliders";
export const THEME_CUSTOMIZATION_SLIDER_DETAILS: Function = ({ id }) =>
  `${THEME_CUSTOMIZATION_SLIDER}/${id}`;

export const MENU: string = ONLINE_STORE + "/menu";
export const MENU_CREATE: string = MENU + "/create";
export const MENU_EDIT: Function = ({ id }) => `${MENU}/${id}`;
export const PREFERENCES: string = ONLINE_STORE + "/preferences";

export const POINT_OF_SALE: string = BASE_PATH + "/point_of_sale";

export const SETTINGS: string = BASE_PATH + "/settings";
export const SETTINGS_GENERAL: string = SETTINGS + "/general";
export const SETTINGS_ROLES: string = SETTINGS + "/roles";
export const SETTINGS_ROLES_CREATE: string = SETTINGS_ROLES + "/create";
export const SETTINGS_ROLES_EDIT: Function = ({ id }) =>
  `${SETTINGS_ROLES}/${id}`;
export const SETTINGS_DOMAIN: string = SETTINGS + "/manage-domain";
export const SETTINGS_DOMAIN_CREATE: string = SETTINGS_DOMAIN + "/create";
export const SETTINGS_BILLING: string = SETTINGS + "/billing";
export const SETTINGS_ORDER: string = SETTINGS + "/order";
export const SETTINGS_DELIVERY: string = SETTINGS + "/delivery";
export const SETTINGS_DELIVERY_CREATE: string = SETTINGS_DELIVERY + "/create";
export const SETTINGS_DELIVERY_EDIT: Function = ({ id }) =>
  `${SETTINGS_DELIVERY}/${id}`;
export const SETTINGS_COURIER: string = SETTINGS + "/courier";
export const SETTINGS_COURIER_EDIT: Function = ({ key }) =>
  `${SETTINGS_COURIER}/${key}`;
export const SETTINGS_PAYMENT: string = SETTINGS + "/payment";
export const SETTINGS_SITE_OPERATOR: string = SETTINGS + "/site-operator";
export const SETTINGS_SITE_OPERATOR_ADD: string =
  SETTINGS_SITE_OPERATOR + "/create";
export const SETTINGS_SITE_OPERATOR_EDIT: Function = ({ id }) =>
  `${SETTINGS_SITE_OPERATOR}/${id}`;
export const SETTINGS_NOTIFICATION: string = SETTINGS + "/notification";
export const SETTINGS_NOTIFICATION_SMSGATEWAY: string =
  SETTINGS_NOTIFICATION + "/sms-getway";
export const SETTINGS_NOTIFICATION_ORDER: string =
  SETTINGS_NOTIFICATION + "/order";
export const SETTINGS_CHECKOUT: string = SETTINGS + "/checkout";
export const SETTINGS_POLICIES: string = SETTINGS + "/policies";
export const SETTINGS_PRICING_PLAN: string = SETTINGS + "/pricing-plan";

export const PORTAL: string = BASE_PATH + "/portal";
export const PORTAL_OVERVIEW: string = PORTAL + "/overview";
export const PORTAL_PARTNERS: string = PORTAL + "/partners";
export const PORTAL_PARTNERS_DETAILS: Function = ({ id }) =>
  `${PORTAL_PARTNERS}/${id}`;
export const PORTAL_WITHDRAW: string = PORTAL + "/withdraw";
export const PORTAL_PAYMENT_INFO: string = PORTAL + "/payment-info";
export const PORTAL_REPORT: string = PORTAL + "/report";

export const DOWNGRADE: string = BASE_PATH + "/downgrade-plan";
export const DOWNGRADE_SITE_OPERATOR: string = DOWNGRADE + "/site-operator";
export const DOWNGRADE_PRODUCT_VARIANTS: string =
  DOWNGRADE + "/product-vatiants";
export const DOWNGRADE_PRODUCT_IMAGES: string = DOWNGRADE + "/product-images";
export const DOWNGRADE_THEMES: string = DOWNGRADE + "/themes";
export const DOWNGRADE_APPS: string = DOWNGRADE + "/apps";

export const EXIT_DOWNGRADE_PLAN: string =
  "/admin" + SETTINGS + "/pricing-plan";
export const ONLINE_STORE_PAGES: Function = ({ slug }) => `/pages/${slug}`;

export const MARKETING: string = BASE_PATH + "/marketing";
export const CAMPAIGNS: string = MARKETING + "/campaigns";
export const CAMPAIGNS_CREATE: string = CAMPAIGNS + "/create";
export const CAMPAIGNS_UPDATE: string = CAMPAIGNS + "/update";
export const AUDIENCES: string = MARKETING + "/audiences";
export const AUDIENCES_CREATE: string = AUDIENCES + "/create";
export const AUDIENCES_UPDATE: string = AUDIENCES + "/update";
