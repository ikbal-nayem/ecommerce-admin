import "./MainContentLayout.scss";

interface IWxMainXl {
	className?: string;
	children: JSX.Element | JSX.Element[] | any;
}

const WxMainXl = ({ className, children }: IWxMainXl) => {
	return (
		<section
			className={`w-100 d-flex justify-content-center wx__main_xl ${
				className || ""
			}`}
		>
			<div className="w-100 wx__main_content setting_content">
				{children}
			</div>
		</section>
	);
};

export default WxMainXl;
