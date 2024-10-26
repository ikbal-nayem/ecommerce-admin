import ContentLoader from "react-content-loader";

const PaginationSkelton = (props) => {
  return (
    <ContentLoader
      speed={2}
      backgroundColor="#f5f6f7"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="389" y="-23" rx="4" ry="4" width="35" height="14" />
      <rect x="17" y="206" rx="4" ry="4" width="55" height="9" />
      <rect x="76" y="200" rx="4" ry="4" width="34" height="19" />
      <rect x="344" y="206" rx="4" ry="4" width="55" height="9" />
      <rect x="435" y="200" rx="4" ry="4" width="22" height="22" />
      <rect x="510" y="200" rx="4" ry="4" width="22" height="22" />
      <rect x="535" y="200" rx="4" ry="4" width="22" height="22" />
      <rect x="410" y="200" rx="4" ry="4" width="22" height="22" />
      <rect x="460" y="200" rx="4" ry="4" width="22" height="22" />
      <rect x="485" y="200" rx="4" ry="4" width="22" height="22" />
    </ContentLoader>
  );
};

export default PaginationSkelton;
