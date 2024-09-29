import ContentLoader from "react-content-loader";

const CategoryTBSkelton = (props) => {
  return (
    <>
      <ContentLoader
        speed={2}
        backgroundColor="#f5f6f7"
        foregroundColor="#ecebeb"
        {...props}
      >
        <rect x="19" y="11" rx="4" ry="4" width="60" height="9" />
        <rect x="35" y="37" rx="4" ry="4" width="73" height="8" />
        <rect x="302" y="11" rx="4" ry="4" width="53" height="9" />
        <rect x="427" y="11" rx="4" ry="4" width="53" height="9" />
        <rect x="311" y="37" rx="4" ry="4" width="35" height="8" />
        <rect x="311" y="64" rx="4" ry="4" width="35" height="8" />
        <rect x="436" y="64" rx="4" ry="4" width="35" height="8" />
        <rect x="436" y="37" rx="4" ry="4" width="35" height="8" />
        <rect x="311" y="90" rx="4" ry="4" width="35" height="8" />
        <rect x="311" y="117" rx="4" ry="4" width="35" height="8" />
        <rect x="311" y="143" rx="4" ry="4" width="35" height="8" />
        <rect x="436" y="143" rx="4" ry="4" width="35" height="8" />
        <rect x="436" y="117" rx="4" ry="4" width="35" height="8" />
        <rect x="436" y="90" rx="4" ry="4" width="35" height="8" />
        <rect x="560" y="33" rx="4" ry="4" width="7" height="17" />
        <rect x="560" y="60" rx="4" ry="4" width="7" height="17" />
        <rect x="560" y="86" rx="4" ry="4" width="7" height="17" />
        <rect x="560" y="112" rx="4" ry="4" width="7" height="17" />
        <rect x="560" y="138" rx="4" ry="4" width="7" height="17" />
        <circle cx="24" cy="41" r="6" />
        <rect x="35" y="64" rx="4" ry="4" width="155" height="8" />
        <rect x="35" y="90" rx="4" ry="4" width="73" height="8" />
        <rect x="35" y="117" rx="4" ry="4" width="155" height="8" />
        <rect x="35" y="143" rx="4" ry="4" width="73" height="8" />
        <circle cx="24" cy="68" r="6" />
        <circle cx="24" cy="94" r="6" />
        <circle cx="24" cy="121" r="6" />
        <circle cx="24" cy="147" r="6" />
        <rect x="4" y="134" rx="0" ry="0" width="584" height="1" />
        <rect x="4" y="54" rx="0" ry="0" width="584" height="1" />
        <rect x="4" y="80" rx="0" ry="0" width="584" height="1" />
        <rect x="4" y="28" rx="0" ry="0" width="584" height="1" />
        <rect x="4" y="107" rx="0" ry="0" width="584" height="1" />
      </ContentLoader>
    </>
  );
};

export default CategoryTBSkelton;
