import Preloader from "services/utils/preloader.service";
import "./BlockSection.scss";

type IBlockSectionProps = {
	children: any;
	isblocked?: boolean;
	hasLoader?: boolean;
};

const BlockSection = ({
	children,
	isblocked = false,
	hasLoader = false,
}: IBlockSectionProps) => {
	if (!isblocked) return children;
	return (
		<div className="wx__block_disabled">
			{children}
			<div className="block_section">{hasLoader ? <Preloader /> : null}</div>
		</div>
	);
};

export default BlockSection;
