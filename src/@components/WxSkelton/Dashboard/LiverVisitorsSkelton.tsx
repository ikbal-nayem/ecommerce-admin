import ContentLoader from "react-content-loader";

const LiverVisitorsSkelton = (props) => {
  return (
    <ContentLoader
      speed={2}
      backgroundColor="#f5f6f7"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="463" y="15" rx="4" ry="4" width="90" height="9" />
      <rect x="463" y="63" rx="4" ry="4" width="90" height="9" />
      <rect x="464" y="79" rx="4" ry="4" width="44" height="19" />
    </ContentLoader>
  );
};

export default LiverVisitorsSkelton;
