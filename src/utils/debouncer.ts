import { useEffect, useState } from 'react';

export default function useDebounce(value: any, delay: number) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);
		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

export function debounce(func: any, delay: number = 500) {
	let timerId: any;
	return function (...args: any) {
		const context = this;
		clearTimeout(timerId);
		timerId = setTimeout(() => {
			func.apply(context, args);
		}, delay);
	};
}
