import ContentLoader from "react-content-loader";

const CustomerLastOrdrSkelton = (props: any) => {
  return (
    <>
      <ContentLoader
        speed={2}
        backgroundColor="#f5f6f7"
        foregroundColor="#ecebeb"
        {...props}
      >
        <rect x="27" y="28" rx="4" ry="4" width="81" height="15" />
        <rect x="27" y="94" rx="4" ry="4" width="45" height="46" />
        <rect x="112" y="47" rx="4" ry="4" width="64" height="24" />
        <rect x="89" y="99" rx="4" ry="4" width="138" height="13" />
        <rect x="88" y="122" rx="4" ry="4" width="70" height="12" />
        <rect x="502" y="104" rx="4" ry="4" width="65" height="15" />
        <rect x="425" y="51" rx="4" ry="4" width="140" height="12" />
        <rect x="416" y="186" rx="4" ry="4" width="150" height="34" />
        <rect x="27" y="53" rx="4" ry="4" width="80" height="12" />
        <rect x="27" y="162" rx="0" ry="0" width="541" height="2" />
      </ContentLoader>
    </>
  );
};

export default CustomerLastOrdrSkelton;
