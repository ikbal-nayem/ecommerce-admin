import ContentLoader from "react-content-loader";

const SidebarSkelton = (props: any) => {
  return (
    <ContentLoader
      speed={2}
      backgroundColor="#f5f6f7"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="63" y="68" rx="4" ry="4" width="150" height="14" />
      <rect x="19" y="62" rx="4" ry="4" width="25" height="25" />
      <rect x="63" y="181" rx="4" ry="4" width="150" height="14" />
      <rect x="19" y="175" rx="4" ry="4" width="25" height="25" />
      <rect x="63" y="219" rx="4" ry="4" width="88" height="14" />
      <rect x="19" y="213" rx="4" ry="4" width="25" height="25" />
      <rect x="63" y="263" rx="4" ry="4" width="150" height="14" />
      <rect x="19" y="257" rx="4" ry="4" width="25" height="25" />
      <rect x="63" y="105" rx="4" ry="4" width="130" height="14" />
      <rect x="19" y="99" rx="4" ry="4" width="25" height="25" />
      <rect x="63" y="141" rx="4" ry="4" width="88" height="14" />
      <rect x="19" y="135" rx="4" ry="4" width="25" height="25" />
      <rect x="63" y="368" rx="4" ry="4" width="135" height="14" />
      <rect x="19" y="362" rx="4" ry="4" width="25" height="25" />
      <rect x="63" y="859" rx="4" ry="4" width="150" height="14" />
      <rect x="19" y="853" rx="4" ry="4" width="25" height="25" />
      <rect x="63" y="27" rx="4" ry="4" width="88" height="14" />
      <rect x="19" y="21" rx="4" ry="4" width="25" height="25" />
      <rect x="19" y="310" rx="4" ry="4" width="195" height="16" />
      <rect x="7" y="840" rx="4" ry="4" width="226" height="1" />
      <rect x="7" y="335" rx="4" ry="4" width="226" height="1" />
    </ContentLoader>
  );
};

export default SidebarSkelton;
