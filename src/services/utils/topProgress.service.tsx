import { FC, useEffect } from 'react';
import topbar from 'topbar';

interface ITop {
	hide: () => void;
	show: () => void;
}

const config = {
	barColors: {
		'0': '#0190cd',
		'0.7': '#7953cd',
		'1': '#764ada',
	},
	barThickness: 2,
	shadowBlur: 5,
};

topbar.config(config);
const topProgress: ITop = topbar;

const TopProgressCom: FC = () => {
	useEffect(() => {
		topProgress.show();
		return () => topProgress.hide();
	}, []);

	return <></>;
};

export { topProgress, TopProgressCom };
