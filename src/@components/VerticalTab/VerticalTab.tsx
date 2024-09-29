import { createContext, useContext, useEffect, useState } from "react";
import "./VerticalTab.scss";

interface ITab {
  children?: JSX.Element;
  id: number | string;
  className: string;
  disabled: boolean;
}

type TabProps = {
  active: number;
  setActive: Function;
};

type TabComponent = React.FunctionComponent & {
  Tab: (props) => JSX.Element;
  Tablist: (props) => JSX.Element;
  Content: (props) => JSX.Element;
  ContentItems: (props) => JSX.Element;
  activeNumber?: number;
  // ContentItems: React.FC;
};

const VerticalTabContext = createContext({} as TabProps);

const VerticalTab: TabComponent = ({
  children,
  className,
  activeNumber,
}: any): any => {
  const [active, setActive] = useState<number>(2);

  return (
    <VerticalTabContext.Provider value={{ active, setActive }}>
      <div className={`vertical_tab_main ${className ? className : ""}`}>
        {children}
      </div>
    </VerticalTabContext.Provider>
  );
};

const Tab = ({ children, id, className, disabled }: ITab): JSX.Element => {
  const { active, setActive } = useContext(VerticalTabContext);
  return (
    <li
      className={`${
        disabled ? "disabled" : active === id ? "active_tab" : ""
      } ${className ? className : ""}`}
      id={id + ""}
      onClick={() => disabled || setActive(id)}
    >
      {children}
    </li>
  );
};

const Tablist = ({ children, id, className, activeTab }): JSX.Element => {
  const { setActive } = useContext(VerticalTabContext);
  useEffect(() => {
    setActive(activeTab);
  }, [activeTab]);
  return (
    <div className={`tabs_list ${className ? className : ""}`}>
      <ul className="wx__m-0 wx__p-0" id={id}>
        {children}
      </ul>
    </div>
  );
};

const Content = ({ children, id, className }): JSX.Element => {
  const { active, setActive } = useContext(VerticalTabContext);
  return (
    active == id && (
      <div className={className ? className : ""} id={id}>
        {children}
      </div>
    )
  );
};

const ContentItems = ({ children, id, className }): JSX.Element => {
  return (
    <div className={`tabs_content ${className ? className : ""}`} id={id}>
      {children}
    </div>
  );
};

VerticalTab.Tab = Tab;
VerticalTab.Tablist = Tablist;
VerticalTab.Content = Content;
VerticalTab.ContentItems = ContentItems;

export default VerticalTab;
