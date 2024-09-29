import ContentLoader from "react-content-loader";

const DashboardAppSkelton = (props) => {
  return (
    <ContentLoader
      speed={2}
      backgroundColor="#f5f6f7"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="53" y="18" rx="4" ry="4" width="111" height="14" />
      <rect x="53" y="39" rx="4" ry="4" width="226" height="9" />
      <rect x="22" y="61" rx="4" ry="4" width="196" height="125" />
      <rect x="234" y="61" rx="4" ry="4" width="196" height="125" />
      <rect x="446" y="61" rx="4" ry="4" width="128" height="125" />
      <rect x="566" y="24" rx="4" ry="4" width="7" height="20" />
      <rect x="22" y="24" rx="4" ry="4" width="20" height="20" />
    </ContentLoader>
  );
};

export default DashboardAppSkelton;
