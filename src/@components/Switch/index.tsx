import clsx from 'clsx';
import './Switch.scss';

interface ISwithProps {
	label?: string | JSX.Element;
	checkedTitle?: string;
	unCheckedTitle?: string;
	className?: string;
	registerProperty?: any;
	defaultChecked?: boolean;
	disabled?: boolean;
	isChecked?: boolean;
	onChange?: Function;
}

function Switch({
	label,
	checkedTitle,
	unCheckedTitle,
	registerProperty,
	defaultChecked,
	disabled = false,
	isChecked,
	onChange,
	className,
}: ISwithProps) {
	return (
		<div
			className={clsx('switch_component d-flex justify-content-between align-items-center', className)}
		>
			{label &&
				(typeof label === 'string' ? (
					<label className={clsx({ disabled: !!disabled })}>{label}</label>
				) : (
					<>{label}</>
				))}
			<div className='form-switch'>
				<input
					disabled={disabled}
					className='form-check-input'
					type='checkbox'
					checked-value={checkedTitle}
					unchecked-value={unCheckedTitle}
					defaultChecked={defaultChecked}
					checked={isChecked}
					onChange={onChange}
					{...registerProperty}
				/>
			</div>
		</div>
	);
}

export default Switch;
