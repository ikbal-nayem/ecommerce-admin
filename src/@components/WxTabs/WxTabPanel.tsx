import "./WxTabs";

interface ITabPanel {
	children?: JSX.Element | JSX.Element[] | string;
	currentIndex: number;
	tabIndex: number;
}

const WxTabPanel = ({ children, currentIndex, tabIndex }: ITabPanel) => {
	return (
		<div className={currentIndex === tabIndex ? "wx__d-block" : "wx__d-none"}>
			{children}
		</div>
	);
};
export default WxTabPanel;
