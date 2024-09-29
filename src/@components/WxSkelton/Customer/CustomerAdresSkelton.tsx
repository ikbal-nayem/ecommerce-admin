import ContentLoader from "react-content-loader";

const CustomerAdresSkelton = (props) => {
  return (
    <>
      <ContentLoader
        speed={2}
        backgroundColor="#f5f6f7"
        foregroundColor="#ecebeb"
        {...props}
      >
        <rect x="36" y="37" rx="4" ry="4" width="219" height="18" />
        <rect x="312" y="34" rx="4" ry="4" width="34" height="34" />
        <rect x="36" y="230" rx="4" ry="4" width="310" height="13" />
        <rect x="36" y="197" rx="4" ry="4" width="20" height="20" />
        <rect x="63" y="308" rx="4" ry="4" width="138" height="15" />
        <rect x="36" y="86" rx="4" ry="4" width="20" height="20" />
        <rect x="36" y="255" rx="4" ry="4" width="310" height="13" />
        <rect x="36" y="366" rx="4" ry="4" width="310" height="13" />
        <rect x="36" y="340" rx="4" ry="4" width="310" height="13" />
        <rect x="36" y="476" rx="4" ry="4" width="310" height="13" />
        <rect x="36" y="451" rx="4" ry="4" width="310" height="13" />
        <rect x="36" y="305" rx="4" ry="4" width="20" height="20" />
        <rect x="36" y="418" rx="4" ry="4" width="20" height="20" />
        <rect x="63" y="199" rx="4" ry="4" width="138" height="15" />
        <rect x="63" y="421" rx="4" ry="4" width="138" height="15" />
        <rect x="36" y="118" rx="4" ry="4" width="310" height="13" />
        <rect x="36" y="144" rx="4" ry="4" width="310" height="13" />
        <rect x="68" y="39" rx="4" ry="4" width="138" height="15" />
        <rect x="36" y="543" rx="4" ry="4" width="160" height="15" />
        <rect x="63" y="89" rx="4" ry="4" width="138" height="15" />
      </ContentLoader>
    </>
  );
};

export default CustomerAdresSkelton;
