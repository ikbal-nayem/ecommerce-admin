import { IRoute } from "@interfaces/route.interface";
import { lazy } from "react";

import {
  ACCOUNT_SETTING,
  ANALYTICS,
  APPS,
  APPS_LIST,
  APP_DETAILS,
  APP_STORE,
  AUDIENCES,
  AUDIENCES_CREATE,
  AUDIENCES_UPDATE,
  CAMPAIGNS,
  CAMPAIGNS_CREATE,
  CAMPAIGNS_UPDATE,
  CUSTOMERS,
  CUSTOMER_CREATE,
  CUSTOMER_DETAILS,
  DASHBOARD,
  DISCOUNT,
  DISCOUNT_CREATE,
  DISCOUNT_EDIT,
  DOWNGRADE,
  DOWNGRADE_APPS,
  DOWNGRADE_PRODUCT_IMAGES,
  DOWNGRADE_PRODUCT_VARIANTS,
  DOWNGRADE_SITE_OPERATOR,
  DOWNGRADE_THEMES,
  MENU,
  MENU_CREATE,
  MENU_EDIT,
  ORDER,
  ORDER_CREATE,
  ORDER_DELIVER,
  ORDER_DETAILS,
  ORDER_EDIT,
  ORDER_REFUND,
  ORDER_RETURN,
  PAGES,
  PAGES_CREATE,
  PAGES_EDIT,
  PAYMENT,
  PAYMENT_INFO,
  PORTAL_OVERVIEW,
  PORTAL_PARTNERS,
  PORTAL_PARTNERS_DETAILS,
  PORTAL_PAYMENT_INFO,
  PORTAL_REPORT,
  PORTAL_WITHDRAW,
  PREFERENCES,
  PRODUCT,
  PRODUCT_CATEGORY,
  PRODUCT_COLLECTION,
  PRODUCT_CREATE,
  PRODUCT_DETAILS,
  PRODUCT_INVENTORY,
  SETTINGS,
  SETTINGS_BILLING,
  SETTINGS_CHECKOUT,
  SETTINGS_COURIER_EDIT,
  SETTINGS_DELIVERY,
  SETTINGS_DOMAIN,
  SETTINGS_DOMAIN_CREATE,
  SETTINGS_GENERAL,
  SETTINGS_NOTIFICATION,
  SETTINGS_NOTIFICATION_ORDER,
  SETTINGS_NOTIFICATION_SMSGATEWAY,
  SETTINGS_ORDER,
  SETTINGS_PAYMENT,
  SETTINGS_POLICIES,
  SETTINGS_PRICING_PLAN,
  SETTINGS_ROLES,
  SETTINGS_ROLES_CREATE,
  SETTINGS_ROLES_EDIT,
  SETTINGS_SITE_OPERATOR,
  SETTINGS_SITE_OPERATOR_ADD,
  SETTINGS_SITE_OPERATOR_EDIT,
  THEMES,
  THEMES_LIST,
  THEME_CUSTOMIZATION,
  THEME_CUSTOMIZATION_COLOR,
  THEME_CUSTOMIZATION_FOOTER,
  THEME_CUSTOMIZATION_GENERAL,
  THEME_CUSTOMIZATION_HOMEPAGE,
  THEME_CUSTOMIZATION_S,
  THEME_CUSTOMIZATION_SLIDER,
  THEME_CUSTOMIZATION_SLIDER_DETAILS,
  THEME_CUSTOMIZATION_SOCIAL,
  THEME_CUSTOMIZATION_TYPOGRAPHY,
  THEME_DETAILS,
} from "./path-name.route";

const AddPage = lazy(() => import("@pages/onlineStore/Pages/AddPages"));
const SettingsRolesCreate = lazy(
  () => import("@pages/settings/Pages/Role/Create/CreateRoles")
);
const CustomizationGeneral = lazy(
  () => import("@pages/themes/customization/General/General")
);
const PortalClient = lazy(() => import("@pages/portal/Partners"));
const Courier = lazy(() => import("@pages/settings/Pages/Courier/Courier"));

export const routeList: IRoute[] = [
  {
    path: DASHBOARD,
    component: lazy(() => import("@pages/dashboard/Dashboard")),
  },
  {
    path: ORDER,
    component: lazy(() => import("@pages/orders/Orders")),
  },
  {
    params: { order_id: ":order_id" },
    path: ORDER_DETAILS,
    component: lazy(() => import("@pages/orders/order-details/OrderDetails")),
  },
  {
    params: { order_id: ":order_id" },
    path: ORDER_REFUND,
    component: lazy(() => import("@pages/orders/refund/Refund")),
  },
  {
    params: { order_id: ":order_id" },
    path: ORDER_RETURN,
    component: lazy(() => import("@pages/orders/return/Return")),
  },
  {
    params: { order_id: ":order_id" },
    path: ORDER_EDIT,
    component: lazy(() => import("@pages/orders/update-order/UpdateOrder")),
  },
  {
    path: ORDER_CREATE,
    component: lazy(() => import("@pages/orders/create-order/CreateOrder")),
  },
  {
    path: PRODUCT,
    component: lazy(() => import("@pages/products/Products")),
  },
  {
    path: PRODUCT_CATEGORY,
    component: lazy(() => import("@pages/products/category/Category")),
  },
  {
    path: PRODUCT_COLLECTION,
    component: lazy(() => import("@pages/products/collection/Collection")),
  },
  {
    path: PRODUCT_CREATE,
    component: lazy(() => import("@pages/products/add-product/AddProduct")),
  },
  {
    path: PRODUCT_INVENTORY,
    component: lazy(() => import("@pages/products/inventory/Inventory")),
  },
  {
    params: { product_id: ":product_id" },
    path: PRODUCT_DETAILS,
    component: lazy(
      () => import("@pages/products/update-product/UpdateProduct")
    ),
  },
  {
    path: CUSTOMERS,
    component: lazy(() => import("@pages/customers/Customers")),
  },
  {
    params: { id: ":id" },
    path: CUSTOMER_DETAILS,
    component: lazy(() => import("@pages/customers/CustomerDetails")),
  },
  {
    path: CUSTOMER_CREATE,
    component: lazy(() => import("@pages/customers/AddCustomer")),
  },
  {
    path: DISCOUNT,
    component: lazy(() => import("@pages/discount/Discounts")),
  },
  {
    path: DISCOUNT_CREATE,
    component: lazy(() => import("@pages/discount/AddCoupon/AddCoupon")),
  },
  {
    params: { id: ":id" },
    path: DISCOUNT_EDIT,
    component: lazy(() => import("@pages/discount/EditCoupon/EditCoupon")),
  },
  {
    path: ANALYTICS,
    component: lazy(() => import("@pages/analytics/Analytics")),
  },
  {
    path: APPS,
    component: lazy(() => import("@pages/apps/Apps")),
  },
  {
    path: APPS_LIST,
    component: lazy(() => import("@pages/apps/components/AppsList/AppsList")),
  },
  {
    params: { id: ":id" },
    path: APP_DETAILS,
    component: lazy(
      () => import("@pages/apps/components/AppDetails/AppDetails")
    ),
  },
  {
    params: { appId: ":appId" },
    path: APP_STORE,
    component: lazy(() => import("@pages/app-store/AppStore")),
  },
  {
    path: PAGES,
    component: lazy(() => import("@pages/onlineStore/Pages/Pages")),
  },
  {
    path: PAGES_CREATE,
    component: AddPage,
  },
  {
    params: { id: ":id" },
    path: PAGES_EDIT,
    component: AddPage,
  },
  {
    path: THEMES,
    component: lazy(() => import("@pages/themes/main/Themes")),
  },
  {
    path: THEMES_LIST,
    component: lazy(() => import("@pages/themes/alltheme/AllTheme")),
  },
  {
    path: PREFERENCES,
    component: lazy(() => import("@pages/onlineStore/preferences/Preferences")),
  },
  {
    path: THEME_CUSTOMIZATION,
    component: CustomizationGeneral,
  },
  {
    path: THEME_CUSTOMIZATION_GENERAL,
    component: CustomizationGeneral,
  },
  {
    path: THEME_CUSTOMIZATION_HOMEPAGE,
    component: lazy(
      () => import("@pages/themes/customization/HomePage/HomePage")
    ),
  },
  {
    path: THEME_CUSTOMIZATION_FOOTER,
    component: lazy(() => import("@pages/themes/customization/Footer/Footer")),
  },
  {
    path: THEME_CUSTOMIZATION_SOCIAL,
    component: lazy(() => import("@pages/themes/customization/Social/Social")),
  },
  {
    path: THEME_CUSTOMIZATION_COLOR,
    component: lazy(() => import("@pages/themes/customization/Color/Color")),
  },
  {
    path: THEME_CUSTOMIZATION_TYPOGRAPHY,
    component: lazy(
      () => import("@pages/themes/customization/Typography/Typography")
    ),
  },
  {
    path: THEME_CUSTOMIZATION_SLIDER,
    component: lazy(() => import("@pages/themes/slider/Index")),
  },
  {
    params: { section_key: ":section_key" },
    path: THEME_CUSTOMIZATION_S,
    component: lazy(
      () => import("@pages/themes/customization/SectionCustomize")
    ),
  },
  {
    params: { id: ":id" },
    path: THEME_CUSTOMIZATION_SLIDER_DETAILS,
    component: lazy(() => import("@pages/themes/slider/SliderDetails")),
  },

  {
    params: { id: ":id", option: ":option" },
    path: THEME_DETAILS,
    component: lazy(
      () =>
        import("@pages/themes/alltheme/components/themeDetails/ThemeDetails")
    ),
  },
  {
    path: ACCOUNT_SETTING,
    component: lazy(() => import("@pages/accountSetting/AccountSetting")),
  },
  {
    path: SETTINGS,
    component: lazy(() => import("@pages/settings/Settings")),
  },
  {
    path: SETTINGS_GENERAL,
    component: lazy(() => import("@pages/settings/Pages/General/General")),
  },
  {
    path: SETTINGS_SITE_OPERATOR,
    component: lazy(
      () => import("@pages/settings/Pages/SiteOperator/List/SiteOperator")
    ),
  },
  {
    path: SETTINGS_SITE_OPERATOR_ADD,
    component: lazy(
      () => import("@pages/settings/Pages/SiteOperator/Create/CreateOperator")
    ),
  },
  {
    params: { id: ":id" },
    path: SETTINGS_SITE_OPERATOR_EDIT,
    component: lazy(
      () => import("@pages/settings/Pages/SiteOperator/Update/UpdateOperator")
    ),
  },
  {
    path: SETTINGS_ROLES,
    component: lazy(() => import("@pages/settings/Pages/Role/Role")),
  },
  {
    path: SETTINGS_ROLES_CREATE,
    component: SettingsRolesCreate,
  },
  {
    params: { id: ":id" },
    path: SETTINGS_ROLES_EDIT,
    component: SettingsRolesCreate,
  },
  {
    path: SETTINGS_DOMAIN,
    component: lazy(
      () => import("@pages/settings/Pages/ManageDomain/ManageDomain")
    ),
  },
  {
    path: SETTINGS_DOMAIN_CREATE,
    component: lazy(
      () => import("@pages/settings/Pages/ManageDomain/Create/DomainCreate")
    ),
  },
  {
    path: SETTINGS_PRICING_PLAN,
    component: lazy(
      () => import("@pages/settings/Pages/PricingPlan/PricingPlan")
    ),
  },
  {
    path: SETTINGS_ORDER,
    component: lazy(() => import("@pages/settings/Pages/Order/Order")),
  },
  {
    path: SETTINGS_PAYMENT,
    component: lazy(() => import("@pages/settings/Pages/Payment/Payment")),
  },
  {
    path: SETTINGS_NOTIFICATION,
    component: lazy(
      () => import("@pages/settings/Pages/Notification/Notification")
    ),
  },
  {
    path: SETTINGS_NOTIFICATION_ORDER,
    component: lazy(
      () =>
        import(
          "@pages/settings/Pages/Notification/Pages/OrderConfirmation/OrderConfirmation"
        )
    ),
  },
  {
    path: SETTINGS_NOTIFICATION_SMSGATEWAY,
    component: lazy(
      () => import("@pages/settings/Pages/Notification/Pages/SmsGateway/Create")
    ),
  },
  {
    path: SETTINGS_BILLING,
    component: lazy(() => import("@pages/settings/Pages/Billing/Billing")),
  },
  {
    path: PAYMENT,
    component: lazy(() => import("@pages/payment/Payment")),
  },
  {
    path: PAYMENT_INFO,
    component: lazy(() => import("@pages/payment/PaymentInfo")),
  },
  {
    path: SETTINGS_POLICIES,
    component: lazy(() => import("@pages/settings/Pages/Policies/Policies")),
  },
  {
    path: SETTINGS_CHECKOUT,
    component: lazy(() => import("@pages/settings/Pages/Checkout/Checkout")),
  },
  {
    path: SETTINGS_DELIVERY,
    component: lazy(() => import("@pages/settings/Pages/Delivery/Delivery")),
  },
  {
    params: { key: ":key" },
    path: SETTINGS_COURIER_EDIT,
    component: lazy(
      () => import("@pages/settings/Pages/Courier/ECourier/Form")
    ),
  },
  {
    params: { courier_service: ":courier_service", order_id: ":order_id" },
    path: ORDER_DELIVER,
    component: Courier,
  },
  {
    path: "/novo",
    component: Courier,
  },
  {
    path: MENU,
    component: lazy(() => import("@pages/onlineStore/menu/menu")),
  },
  {
    path: MENU_CREATE,
    component: lazy(() => import("@pages/onlineStore/menu/Create")),
  },
  {
    params: { id: ":id" },
    path: MENU_EDIT,
    component: lazy(() => import("@pages/onlineStore/menu/Update")),
  },

  {
    path: CAMPAIGNS,
    component: lazy(() => import("@pages/marketing/campaigns/Campaigns")),
  },
  {
    path: CAMPAIGNS_CREATE,
    component: lazy(
      () => import("@pages/marketing/campaigns/create/CreateCampaigns")
    ),
  },
  {
    path: CAMPAIGNS_UPDATE,
    component: lazy(
      () => import("@pages/marketing/campaigns/update/UpdateCampaign")
    ),
  },
  {
    path: AUDIENCES,
    component: lazy(() => import("@pages/marketing/audiences/Audiences")),
  },
  {
    path: AUDIENCES_CREATE,
    component: lazy(
      () => import("@pages/marketing/audiences/create/CreateAudience")
    ),
  },
  {
    path: AUDIENCES_UPDATE,
    component: lazy(
      () => import("@pages/marketing/audiences/update/UpdateAudience")
    ),
  },

  {
    path: PORTAL_OVERVIEW,
    component: lazy(() => import("@pages/portal/Overview")),
  },
  {
    path: PORTAL_PARTNERS,
    component: PortalClient,
  },
  {
    params: { id: ":id" },
    path: PORTAL_PARTNERS_DETAILS,
    component: lazy(() => import("@pages/portal/Partners/ReferrerDetails")),
  },
  {
    path: PORTAL_WITHDRAW,
    component: PortalClient,
  },
  {
    path: PORTAL_PAYMENT_INFO,
    component: lazy(() => import("@pages/portal/PaymentInfo")),
  },
  {
    path: PORTAL_REPORT,
    component: PortalClient,
  },
  {
    path: DOWNGRADE_SITE_OPERATOR,
    component: lazy(() => import("@pages/downgrade/siteoperator")),
  },
  {
    path: DOWNGRADE_PRODUCT_IMAGES,
    component: lazy(() => import("@pages/downgrade/product/ProductImages")),
  },
  {
    path: DOWNGRADE_PRODUCT_VARIANTS,
    component: lazy(() => import("@pages/downgrade/product/ProductVariant")),
  },
  {
    path: DOWNGRADE_THEMES,
    component: lazy(() => import("@pages/downgrade/themes/Themes")),
  },
  {
    path: DOWNGRADE_APPS,
    component: lazy(() => import("@pages/downgrade/apps/Apps")),
  },
];

export const expiredRoutes = [
  SETTINGS_PRICING_PLAN,
  SETTINGS_BILLING,
  PAYMENT,
  PAYMENT_INFO,
  DOWNGRADE,
  DOWNGRADE_APPS,
  DOWNGRADE_PRODUCT_IMAGES,
  DOWNGRADE_PRODUCT_VARIANTS,
  DOWNGRADE_SITE_OPERATOR,
  DOWNGRADE_THEMES,
];
