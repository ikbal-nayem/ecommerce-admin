import ContentLoader from "react-content-loader";

const ChartBoxHeader = (props) => {
  return (
    <ContentLoader
      speed={2}
      backgroundColor="#f5f6f7"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="23" y="25" rx="4" ry="4" width="350" height="12" />
      <rect x="23" y="47" rx="4" ry="4" width="121" height="23" />
      <circle cx="495" cy="47" r="20" />
      <rect x="23" y="100" rx="4" ry="4" width="490" height="1" />
    </ContentLoader>
  );
};

export default ChartBoxHeader;
