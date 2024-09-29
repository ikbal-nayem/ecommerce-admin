import ContentLoader from "react-content-loader";

const SummerySkelton = (props) => {
  return (
    <ContentLoader
      speed={2}
      backgroundColor="#f5f6f7"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="14" y="18" rx="4" ry="4" width="100" height="9" />
      <rect x="14" y="34" rx="4" ry="4" width="199" height="19" />
      <rect x="44" y="74" rx="4" ry="4" width="77" height="9" />
      <rect x="14" y="67" rx="4" ry="4" width="400" height="1" />
      <rect x="44" y="89" rx="4" ry="4" width="90" height="12" />
      <rect x="188" y="74" rx="4" ry="4" width="77" height="9" />
      <rect x="188" y="88" rx="4" ry="4" width="90" height="12" />
      <rect x="330" y="75" rx="4" ry="4" width="77" height="9" />
      <rect x="330" y="89" rx="4" ry="4" width="90" height="12" />
      <circle cx="27" cy="87" r="13" />
      <circle cx="168" cy="87" r="13" />
      <circle cx="311" cy="87" r="13" />
      <rect x="463" y="15" rx="4" ry="4" width="90" height="9" />
      <rect x="463" y="63" rx="4" ry="4" width="90" height="9" />
      <rect x="464" y="79" rx="4" ry="4" width="44" height="19" />
    </ContentLoader>
  );
};

export default SummerySkelton;
