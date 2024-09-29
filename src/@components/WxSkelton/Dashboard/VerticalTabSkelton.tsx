import ContentLoader from "react-content-loader";

const VerticalTabSkelton = (props) => {
  return (
    <>
      <ContentLoader
        speed={2}
        backgroundColor="#f5f6f7"
        foregroundColor="#ecebeb"
        {...props}
      >
        <rect x="174" y="168" rx="4" ry="4" width="85" height="23" />
        <rect x="174" y="102" rx="4" ry="4" width="123" height="11" />
        <rect x="174" y="133" rx="4" ry="4" width="385" height="8" />
        <rect x="174" y="147" rx="4" ry="4" width="209" height="8" />
        <rect x="29" y="226" rx="4" ry="4" width="85" height="8" />
        <rect x="29" y="88" rx="4" ry="4" width="67" height="8" />
        <rect x="29" y="133" rx="4" ry="4" width="85" height="8" />
        <rect x="29" y="180" rx="4" ry="4" width="65" height="8" />
        <rect x="13" y="21" rx="4" ry="4" width="124" height="12" />
        <rect x="13" y="43" rx="4" ry="4" width="155" height="8" />
        <rect x="446" y="22" rx="14" ry="14" width="113" height="27" />
        <rect x="563" y="28" rx="2" ry="2" width="4" height="15" />
        <rect x="0" y="70" rx="0" ry="0" width="589" height="1" />
        <rect x="148" y="114" rx="0" ry="0" width="1" height="138" />
        <circle cx="19" cy="230" r="6" />
        <circle cx="19" cy="184" r="6" />
        <circle cx="19" cy="92" r="6" />
        <circle cx="19" cy="137" r="6" />
        <rect x="0" y="207" rx="0" ry="0" width="148" height="1" />
        <rect x="0" y="161" rx="0" ry="0" width="148" height="1" />
        <rect x="0" y="114" rx="0" ry="0" width="148" height="1" />
      </ContentLoader>
    </>
  );
};

export default VerticalTabSkelton;
