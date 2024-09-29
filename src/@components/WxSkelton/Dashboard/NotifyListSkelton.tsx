import ContentLoader from "react-content-loader";

const NotifyListSkelton = (props) => {
  return (
    <ContentLoader
      speed={2}
      backgroundColor="#f5f6f7"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="28" y="17" rx="4" ry="4" width="200" height="9" />
      <rect x="28" y="51" rx="4" ry="4" width="135" height="9" />
      <rect x="28" y="85" rx="4" ry="4" width="200" height="9" />
      <rect x="11" y="72" rx="4" ry="4" width="570" height="1" />
      <rect x="511" y="17" rx="4" ry="4" width="60" height="9" />
      <rect x="512" y="51" rx="4" ry="4" width="60" height="9" />
      <rect x="512" y="85" rx="4" ry="4" width="60" height="9" />
      <rect x="11" y="15" rx="2" ry="2" width="13" height="13" />
      <rect x="11" y="49" rx="2" ry="2" width="13" height="13" />
      <rect x="11" y="82" rx="2" ry="2" width="13" height="13" />
      <rect x="11" y="38" rx="4" ry="4" width="570" height="1" />
    </ContentLoader>
  );
};

export default NotifyListSkelton;
