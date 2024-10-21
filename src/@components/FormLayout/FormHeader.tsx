import Icon from '@components/Icon';
import clsx from 'clsx';
import React from 'react';
import { useNavigate } from 'react-router-dom';

type IFormHeaderProps = {
	backNavigationLink?: any;
	title: string;
	rightContent?: React.ReactNode | string;
	noBack?: boolean;
	noMargin?: boolean;
};

const FormHeader = ({
	backNavigationLink,
	title,
	rightContent,
	noBack,
	noMargin = false,
}: IFormHeaderProps) => {
	const navigate = useNavigate();

	return (
		<div
			className={clsx(`d-flex align-items-center justify-content-between fw-bold`, { 'mb-0': noMargin })}
		>
			<div className='d-flex align-items-center gap-2'>
				{noBack ? null : <Icon icon='arrow_back' onClick={() => navigate(backNavigationLink || -1)} size={25} />}
				<h4 className='text_heading mb-0'>{title}</h4>
			</div>
			{rightContent}
		</div>
	);
};

export default FormHeader;
