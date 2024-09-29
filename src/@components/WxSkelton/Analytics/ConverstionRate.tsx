import ContentLoader from "react-content-loader";

const ConversionRate = (props) => {
  return (
    <ContentLoader
      speed={2}
      backgroundColor="#f5f6f7"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="23" y="25" rx="4" ry="4" width="350" height="12" />
      <rect x="23" y="47" rx="4" ry="4" width="121" height="23" />
      <rect x="23" y="134" rx="4" ry="4" width="132" height="10" />
      <rect x="21" y="173" rx="4" ry="4" width="300" height="9" />
      <rect x="23" y="197" rx="4" ry="4" width="96" height="16" />
      <rect x="23" y="302" rx="4" ry="4" width="132" height="16" />
      <rect x="23" y="277" rx="4" ry="4" width="400" height="9" />
      <circle cx="495" cy="47" r="20" />
      <rect x="23" y="100" rx="4" ry="4" width="490" height="1" />
      <rect x="23" y="246" rx="4" ry="4" width="490" height="1" />
    </ContentLoader>
  );
};

export default ConversionRate;
