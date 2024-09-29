import ContentLoader from "react-content-loader";

const CustomerDtlInfoSkelton = (props) => {
  return (
    <>
      <ContentLoader
        speed={2}
        backgroundColor="#f5f6f7"
        foregroundColor="#ecebeb"
        {...props}
      >
        <rect x="90" y="61" rx="4" ry="4" width="209" height="13" />
        <rect x="89" y="33" rx="4" ry="4" width="81" height="13" />
        <rect x="28" y="30" rx="4" ry="4" width="48" height="45" />
        <rect x="175" y="30" rx="4" ry="4" width="53" height="23" />
        <rect x="28" y="131" rx="4" ry="4" width="138" height="15" />
        <rect x="28" y="154" rx="4" ry="4" width="60" height="13" />
        <rect x="249" y="131" rx="4" ry="4" width="138" height="15" />
        <rect x="249" y="154" rx="4" ry="4" width="120" height="13" />
        <rect x="446" y="130" rx="4" ry="4" width="138" height="15" />
        <rect x="446" y="153" rx="4" ry="4" width="116" height="13" />
      </ContentLoader>
    </>
  );
};

export default CustomerDtlInfoSkelton;
