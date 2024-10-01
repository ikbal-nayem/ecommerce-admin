import "./WxTabs";

interface ITabPanel {
	children?: JSX.Element | JSX.Element[] | string;
	currentIndex: number;
	tabIndex: number;
}

const WxTabPanel = ({ children, currentIndex, tabIndex }: ITabPanel) => {
	return (
		<div className={currentIndex === tabIndex ? "d-block" : "d-inline"}>
			{children}
		</div>
	);
};
export default WxTabPanel;
