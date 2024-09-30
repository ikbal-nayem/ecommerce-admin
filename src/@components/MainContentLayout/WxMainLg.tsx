import './MainContentLayout.scss';

interface IWxMainLg {
	className?: string;
	children: JSX.Element | JSX.Element[] | any;
}

const WxMainLg = ({ className, children }: IWxMainLg) => {
	return (
		<section className={`w-100 d-flex justify-content-center wx__main_lg ${className || ''}`}>
			<div className='w-100 setting_content wx__main_content'>{children}</div>
		</section>
	);
};

export default WxMainLg;
