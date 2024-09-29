import ContentLoader from "react-content-loader";

const SessionLandingSkelton = (props) => {
  return (
    <ContentLoader
      speed={2}
      backgroundColor="#f5f6f7"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="23" y="23" rx="4" ry="4" width="250" height="12" />
      <rect x="23" y="53" rx="4" ry="4" width="195" height="10" />
      <rect x="23" y="83" rx="4" ry="4" width="464" height="10" />
      <rect x="23" y="110" rx="4" ry="4" width="300" height="10" />
      <rect x="23" y="140" rx="4" ry="4" width="185" height="10" />
      <rect x="23" y="170" rx="4" ry="4" width="378" height="10" />
      <rect x="23" y="200" rx="4" ry="4" width="450" height="10" />
      <rect x="23" y="230" rx="4" ry="4" width="59" height="10" />
      <rect x="23" y="260" rx="4" ry="4" width="275" height="10" />
      <rect x="23" y="290" rx="4" ry="4" width="383" height="10" />
      <rect x="23" y="320" rx="4" ry="4" width="450" height="10" />
    </ContentLoader>
  );
};

export default SessionLandingSkelton;
