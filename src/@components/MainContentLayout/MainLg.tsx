import './MainContentLayout.scss';

interface IMainLg {
	className?: string;
	children: JSX.Element | JSX.Element[] | any;
}

const MainLg = ({ className, children }: IMainLg) => {
	return (
		<section className={`w-100 d-flex justify-content-center wx__main_lg ${className || ''}`}>
			<div className='w-100 setting_content wx__main_content'>{children}</div>
		</section>
	);
};

export default MainLg;
