import { ReactNode } from 'react';
import './label.scss';

interface ILabelProps {
	children?: string | ReactNode;
	isRequired?: boolean;
	labelRight?: ReactNode | ReactNode[] | string;
}

function Label({ children, isRequired, labelRight }: ILabelProps) {
	return (
		<div className='wx__label'>
			<label className='text_subtitle'>
				{children} {isRequired && <span className='text_danger'>*</span>}
			</label>
			{labelRight && <div className='float-end'>{labelRight}</div>}
		</div>
	);
}

export default Label;
