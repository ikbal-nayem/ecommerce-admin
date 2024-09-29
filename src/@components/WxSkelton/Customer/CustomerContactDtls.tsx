import ContentLoader from "react-content-loader";

const CustomerContactDtls = (props: any) => {
  return (
    <>
      <ContentLoader
        speed={2}
        backgroundColor="#f5f6f7"
        foregroundColor="#ecebeb"
        {...props}
      >
        <rect x="36" y="36" rx="4" ry="4" width="219" height="18" />
        <rect x="315" y="32" rx="4" ry="4" width="34" height="34" />
        <rect x="72" y="92" rx="4" ry="4" width="138" height="13" />
        <rect x="502" y="104" rx="4" ry="4" width="65" height="15" />
        <rect x="425" y="51" rx="4" ry="4" width="140" height="12" />
        <rect x="416" y="186" rx="4" ry="4" width="150" height="34" />
        <rect x="36" y="86" rx="4" ry="4" width="20" height="20" />
        <rect x="72" y="125" rx="4" ry="4" width="138" height="13" />
        <rect x="36" y="122" rx="4" ry="4" width="20" height="20" />
      </ContentLoader>
    </>
  );
};

export default CustomerContactDtls;
