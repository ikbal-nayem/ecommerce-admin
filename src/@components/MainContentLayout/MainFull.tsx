import "./MainContentLayout.scss";

interface IMainFull {
  className?: string;
  children: JSX.Element | JSX.Element[] | any;
}

const MainFull = ({ className, children }: IMainFull) => {
  return (
    <section
      className={`w-100 d-flex justify-content-center wx__main_full ${
        className || ""
      }`}
    >
      <div className="container-fluid wx__main_content setting_content">
        {children}
      </div>
    </section>
  );
};

export default MainFull;
