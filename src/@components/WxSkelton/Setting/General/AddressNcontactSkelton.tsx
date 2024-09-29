import ContentLoader from "react-content-loader";

const AddressNcontactSkelton = (props) => {
  return (
    <ContentLoader
      speed={2}
      backgroundColor="#f5f6f7"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="12" y="17" rx="4" ry="4" width="150" height="12" />
      <rect x="530" y="17" rx="4" ry="4" width="50" height="12" />
      <rect x="28" y="64" rx="4" ry="4" width="450" height="9" />
      <rect x="28" y="83" rx="4" ry="4" width="300" height="9" />
      <rect x="12" y="55" rx="4" ry="4" width="565" height="1" />
      <rect x="12" y="35" rx="4" ry="4" width="350" height="9" />
      <rect x="12" y="62" rx="2" ry="2" width="12" height="12" />
      <rect x="12" y="82" rx="2" ry="2" width="12" height="12" />
      <rect x="564" y="64" rx="2" ry="2" width="12" height="12" />
    </ContentLoader>
  );
};

export default AddressNcontactSkelton;
