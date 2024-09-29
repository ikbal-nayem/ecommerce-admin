import "./tabs.scss";
interface ITabsProps {
  option: any[];
  labelKey?: string;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  renderTab?: (item: any) => JSX.Element | string | number;
}

const WxTabs = ({
  option,
  labelKey,
  currentIndex,
  setCurrentIndex,
  renderTab,
}: ITabsProps) => {
  return (
    <div>
      {option?.length ? (
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          {option?.map((item, index) => {
            return (
              <li className="nav-item" role="presentation" key={index}>
                <button
                  className={`nav-link ${
                    index === currentIndex ? " active" : ""
                  } ${item?.disable ? " disable" : ""}`}
                  id={index + "-tab"}
                  data-bs-toggle="tab"
                  type="button"
                  role="tab"
                  aria-controls={item.label}
                  aria-selected="true"
                  onClick={() => {
                    setCurrentIndex(index);
                  }}
                  disabled={item.disable}
                >
                  {renderTab ? renderTab(item) : item[labelKey]}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

export default WxTabs;
