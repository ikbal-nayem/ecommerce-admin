import ContentLoader from "react-content-loader";

const CollectionTBSkelton = (props) => {
  return (
    <>
      <ContentLoader
        speed={2}
        backgroundColor="#f5f6f7"
        foregroundColor="#ecebeb"
        {...props}
      >
        <rect x="10" y="15" rx="4" ry="4" width="82" height="10" />
        <rect x="12" y="39" rx="4" ry="4" width="30" height="28" />
        <rect x="60" y="49" rx="4" ry="4" width="266" height="9" />
        <rect x="552" y="49" rx="4" ry="4" width="27" height="9" />
        <rect x="60" y="89" rx="4" ry="4" width="266" height="9" />
        <rect x="60" y="129" rx="4" ry="4" width="266" height="9" />
        <rect x="60" y="173" rx="4" ry="4" width="266" height="9" />
        <rect x="60" y="222" rx="4" ry="4" width="266" height="9" />
        <rect x="552" y="173" rx="4" ry="4" width="27" height="9" />
        <rect x="552" y="222" rx="4" ry="4" width="27" height="9" />
        <rect x="552" y="89" rx="4" ry="4" width="27" height="9" />
        <rect x="552" y="129" rx="4" ry="4" width="27" height="9" />
        <rect x="12" y="164" rx="4" ry="4" width="30" height="28" />
        <rect x="12" y="212" rx="4" ry="4" width="30" height="28" />
        <rect x="12" y="80" rx="4" ry="4" width="30" height="28" />
        <rect x="12" y="120" rx="4" ry="4" width="30" height="28" />
        <rect x="440" y="274" rx="4" ry="4" width="25" height="25" />
        <rect x="524" y="273" rx="4" ry="4" width="25" height="25" />
        <rect x="496" y="273" rx="4" ry="4" width="25" height="25" />
        <rect x="468" y="273" rx="4" ry="4" width="25" height="25" />
        <rect x="552" y="274" rx="4" ry="4" width="25" height="25" />
        <rect x="332" y="282" rx="4" ry="4" width="100" height="9" />
        <rect x="89" y="274" rx="4" ry="4" width="42" height="25" />
        <rect x="12" y="282" rx="4" ry="4" width="70" height="9" />
        <rect x="0" y="201" rx="4" ry="4" width="590" height="1" />
        <rect x="0" y="154" rx="4" ry="4" width="590" height="1" />
        <rect x="0" y="114" rx="4" ry="4" width="590" height="1" />
        <rect x="0" y="73" rx="4" ry="4" width="590" height="1" />
      </ContentLoader>
    </>
  );
};

export default CollectionTBSkelton;
