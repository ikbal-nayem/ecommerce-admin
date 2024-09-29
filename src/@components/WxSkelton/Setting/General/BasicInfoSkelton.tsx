import ContentLoader from "react-content-loader";

const BasicInfoSkelton = (props) => {
  return (
    <ContentLoader
      speed={2}
      backgroundColor="#f5f6f7"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="14" y="17" rx="4" ry="4" width="150" height="12" />
      <rect x="527" y="17" rx="4" ry="4" width="50" height="12" />
      <rect x="14" y="51" rx="4" ry="4" width="250" height="9" />
      <rect x="14" y="73" rx="4" ry="4" width="464" height="9" />
      <rect x="14" y="40" rx="4" ry="4" width="565" height="1" />
    </ContentLoader>
  );
};

export default BasicInfoSkelton;
