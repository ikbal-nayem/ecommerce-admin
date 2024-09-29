import { topProgress } from 'services/utils/topProgress.service';
import { useEffect, useState } from 'react';

const useLoader = (
	isDefaultLoading = false,
	withTopBar = true
): [status: boolean, setStatus: (state: boolean) => void] => {
	const [isLoading, setLoading] = useState<boolean>(isDefaultLoading);

	useEffect(() => {
		if (withTopBar) {
			isLoading ? topProgress.show() : topProgress.hide();
		}
		return () => topProgress.hide();
	}, [isLoading]);

	const setLoader = (state: boolean) => {
		setLoading(state);
	};

	return [isLoading, setLoader];
};

export default useLoader;
