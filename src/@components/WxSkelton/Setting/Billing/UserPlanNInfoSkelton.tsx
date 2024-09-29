import ContentLoader from "react-content-loader";

const UserPlanNInfoSkelton = (props) => {
  return (
    <ContentLoader
      speed={2}
      backgroundColor="#f5f6f7"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="175" y="12" rx="0" ry="0" width="1" height="46" />
      <rect x="297" y="12" rx="0" ry="0" width="1" height="46" />
      <rect x="11" y="21" rx="2" ry="2" width="55" height="6" />
      <rect x="200" y="21" rx="2" ry="2" width="55" height="6" />
      <rect x="326" y="21" rx="2" ry="2" width="55" height="6" />
      <rect x="11" y="33" rx="2" ry="2" width="135" height="10" />
      <rect x="326" y="35" rx="2" ry="2" width="190" height="10" />
      <rect x="200" y="33" rx="2" ry="2" width="70" height="10" />
      <rect x="11" y="49" rx="2" ry="2" width="120" height="9" />
      <rect x="326" y="50" rx="2" ry="2" width="120" height="9" />
      <rect x="200" y="49" rx="2" ry="2" width="45" height="9" />
    </ContentLoader>
  );
};

export default UserPlanNInfoSkelton;
