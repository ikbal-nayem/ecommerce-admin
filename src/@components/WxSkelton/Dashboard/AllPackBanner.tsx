import ContentLoader from "react-content-loader";

const AllPackBanner = (props) => {
  return (
    <ContentLoader
      speed={2}
      backgroundColor="#f5f6f7"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="22" y="24" rx="4" ry="4" width="336" height="14" />
      <rect x="469" y="21" rx="4" ry="4" width="97" height="20" />
    </ContentLoader>
  );
};

export default AllPackBanner;
