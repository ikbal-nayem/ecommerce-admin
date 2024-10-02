import WxIcon from "@components/Icon";
import "./WxChip.scss";

type ColorTypes = "primary" | "secondary";
type SizeTypes = "sm" | "md" | "lg";

interface IWxChip {
  label?: string;
  color?: ColorTypes;
  size?: SizeTypes;
  onClose?: any;
}

const WxChip = ({
  label,
  color = "secondary",
  size = "md",
  onClose,
}: IWxChip) => {
  return (
		<div className={`wx__chip wx__chip_${color} wx__chip_${size}`}>
			<span>{label}</span>
			<WxIcon icon="close" onClick={onClose} />
		</div>
	);
};

export default WxChip;
