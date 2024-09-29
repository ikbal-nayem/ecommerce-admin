import "./MainContentLayout.scss";

interface IWxMainFull {
  className?: string;
  children: JSX.Element | JSX.Element[] | any;
}

const WxMainFull = ({ className, children }: IWxMainFull) => {
  return (
    <section
      className={`wx__w-100 wx__d-flex justify-content-center wx__main_full ${
        className || ""
      }`}
    >
      <div className="wx__container-fluid wx__main_content setting_content">
        {children}
      </div>
    </section>
  );
};

export default WxMainFull;
