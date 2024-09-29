import {
  ANALYTICS,
  APPS,
  AUDIENCES,
  CAMPAIGNS,
  CUSTOMERS,
  DASHBOARD,
  DISCOUNT,
  DOWNGRADE_APPS,
  DOWNGRADE_PRODUCT_IMAGES,
  DOWNGRADE_PRODUCT_VARIANTS,
  DOWNGRADE_SITE_OPERATOR,
  DOWNGRADE_THEMES,
  MARKETING,
  MENU,
  ONLINE_STORE,
  ORDER,
  PAGES,
  PORTAL_OVERVIEW,
  PORTAL_PARTNERS,
  PORTAL_PAYMENT_INFO,
  PREFERENCES,
  PRODUCT,
  PRODUCT_CATEGORY,
  PRODUCT_COLLECTION,
  PRODUCT_INVENTORY,
  THEMES,
  THEME_CUSTOMIZATION_COLOR,
  THEME_CUSTOMIZATION_FOOTER,
  THEME_CUSTOMIZATION_HOMEPAGE,
  THEME_CUSTOMIZATION_SLIDER,
  THEME_CUSTOMIZATION_SOCIAL,
  THEME_CUSTOMIZATION_TYPOGRAPHY,
} from "routes/path-name.route";

const navLinks = [
  { label: "Dashboard", link: DASHBOARD, icon: "home" },
  { label: "Orders", link: ORDER, icon: "receipt" },
  {
    label: "Products",
    link: PRODUCT,
    icon: "category",
    ownPage: false,
    childrens: [
      { label: "Inventory", link: PRODUCT_INVENTORY },
      { label: "Collection", link: PRODUCT_COLLECTION },
      { label: "Category", link: PRODUCT_CATEGORY },
    ],
  },
  { label: "Customers", link: CUSTOMERS, icon: "person" },
  {
    label: "Discounts",
    link: DISCOUNT,
    icon: "local_offer",
  },
  { label: "Analytics", link: ANALYTICS, icon: "bar_chart" },
  {
    label: "Apps",
    link: APPS,
    icon: "widgets",
  },
  {
    label: "Marketing",
    link: MARKETING,
    icon: "fact_check",
    ownPage: true,
    childrens: [
      { label: "Campaigns", link: CAMPAIGNS },
      { label: "Audiences", link: AUDIENCES },
    ],
  },
  {
    label: "Online Store",
    link: ONLINE_STORE,
    icon: "storefront",
    icon1: "remove_red_eye",
    ownPage: true,
    childrens: [
      { label: "Themes", link: THEMES },
      { label: "Menu", link: MENU },
      { label: "Pages", link: PAGES },
      { label: "Preference", link: PREFERENCES },
    ],
  },
  // {
  // 	label: "Point of Sale",
  // 	link: POINT_OF_SALE,
  // 	icon: "point_of_sale",
  // 	childrens: [{ label: "Themes", link: POINT_OF_SALE }],
  // },
];

export default navLinks;

export const downgradeRouteList = [
  { label: "Site operators", link: DOWNGRADE_SITE_OPERATOR, icon: "groups" },
  { label: "Product images", link: DOWNGRADE_PRODUCT_IMAGES, icon: "image" },
  {
    label: "Product variations",
    link: DOWNGRADE_PRODUCT_VARIANTS,
    icon: "category",
  },
  { label: "Themes", link: DOWNGRADE_THEMES, icon: "dynamic_feed" },
  { label: "Apps", link: DOWNGRADE_APPS, icon: "widgets" },
];

export const portalRouteList = [
  { label: "Overview", link: PORTAL_OVERVIEW, icon: "streetview" },
  { label: "Partners", link: PORTAL_PARTNERS, icon: "diversity_3" },
  // { label: "Withdraw", link: PORTAL_WITHDRAW, icon: "credit_score" },
  { label: "Payment info", link: PORTAL_PAYMENT_INFO, icon: "payments" },
  // { label: "Report", link: PORTAL_REPORT, icon: "receipt_long" },
];

export const customizationRouteList = [
  // { label: "General", link: THEME_CUSTOMIZATION_GENERAL, icon: "widgets" },
  { label: "Slider", link: THEME_CUSTOMIZATION_SLIDER, icon: "web_stories" },
  { label: "Home Page", link: THEME_CUSTOMIZATION_HOMEPAGE, icon: "home" },
  { label: "Footer", link: THEME_CUSTOMIZATION_FOOTER, icon: "call_to_action" },
  {
    label: "Typography",
    link: THEME_CUSTOMIZATION_TYPOGRAPHY,
    icon: "text_fields",
  },
  { label: "Color", link: THEME_CUSTOMIZATION_COLOR, icon: "palette" },
  { label: "Social Media", link: THEME_CUSTOMIZATION_SOCIAL, icon: "language" },
];
