import {Button} from '@components/Button';
import { Link } from 'react-router-dom';
import './NotFound.scss';

interface INotFoundProps {
	title?: string;
	description?: string | JSX.Element;
	btn_text?: string;
	btn_link?: string;
	onButtonClick?: () => void;
}

const NotFound = ({ title, description, btn_text, btn_link, onButtonClick }: INotFoundProps) => {
	return (
		<div className='w-100'>
			<div className='card wx__not_found_component'>
				<img src='/media/svg/empty.svg' alt='Not Found' />
				<h4 className='text_regular'>{title}</h4>
				<p className='text_body text_regular'>{description}</p>
				{btn_link ? (
					<Link to={btn_link || ''}>
						<Button variant='fill'>{btn_text}</Button>
					</Link>
				) : null}
				{onButtonClick ? (
					<Button variant='fill' onClick={onButtonClick}>
						{btn_text}
					</Button>
				) : null}
			</div>
		</div>
	);
};

export default NotFound;
