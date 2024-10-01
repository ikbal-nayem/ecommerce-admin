import WxButton from '@components/WxButton';
import { Link } from 'react-router-dom';
import './WxNotFound.scss';

interface INotFoundProps {
	title?: string;
	description?: string | JSX.Element;
	btn_text?: string;
	btn_link?: string;
}

const WxNotFound = ({ title, description, btn_text, btn_link }: INotFoundProps) => {
	return (
		<div className='w-100'>
			<div className='card wx__not_found_component'>
				<img src='/media/svg/not_found.svg' alt='Not Found' />
				<h2 className='wx__text_regular wx__text_h3'>{title}</h2>
				<p className='wx__text_body wx__text_regular'>{description}</p>
				{btn_link ? (
					<Link to={btn_link || ''}>
						<WxButton variant='fill'>{btn_text}</WxButton>
					</Link>
				) : null}
			</div>
		</div>
	);
};

export default WxNotFound;
