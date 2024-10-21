import Icon from '@components/Icon';
import './Chip.scss';

type ColorTypes = 'primary' | 'secondary';
type SizeTypes = 'sm' | 'md' | 'lg';

interface IChip {
	label?: string;
	color?: ColorTypes;
	size?: SizeTypes;
	onClose?: any;
}

const Chip = ({ label, color = 'secondary', size = 'md', onClose }: IChip) => {
	return (
		<div className={`wx__chip wx__chip_${color} wx__chip_${size}`}>
			<span>{label}</span>
			<Icon icon='close' onClick={onClose} />
		</div>
	);
};

export default Chip;
