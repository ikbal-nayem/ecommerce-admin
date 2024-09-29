import ContentLoader from "react-content-loader";

const PaymentMethodSkelton = (props) => {
  return (
    <ContentLoader
      speed={2}
      backgroundColor="#f5f6f7"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="18" y="18" rx="4" ry="4" width="185" height="12" />
      <rect x="524" y="17" rx="4" ry="4" width="50" height="12" />
      <rect x="34" y="51" rx="4" ry="4" width="84" height="25" />
      <rect x="18" y="82" rx="0" ry="0" width="554" height="1" />
      <rect x="18" y="42" rx="0" ry="0" width="555" height="1" />
      <rect x="511" y="54" rx="4" ry="4" width="44" height="19" />
      <rect x="34" y="102" rx="4" ry="4" width="84" height="25" />
      <rect x="452" y="106" rx="4" ry="4" width="44" height="19" />
      <rect x="511" y="106" rx="4" ry="4" width="44" height="19" />
      <rect x="18" y="42" rx="0" ry="0" width="1" height="41" />
      <rect x="572" y="42" rx="0" ry="0" width="1" height="41" />
      <rect x="18" y="133" rx="0" ry="0" width="554" height="1" />
      <rect x="18" y="93" rx="0" ry="0" width="555" height="1" />
      <rect x="18" y="93" rx="0" ry="0" width="1" height="41" />
      <rect x="572" y="93" rx="0" ry="0" width="1" height="41" />
    </ContentLoader>
  );
};

export default PaymentMethodSkelton;
