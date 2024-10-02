import imageCompression from 'browser-image-compression';
import { ENV } from 'config/ENV.config';
import { generateDateFormat } from './splitDate';

export const setWindowTitle = (title: string = null) => {
	const t = title || window.location.pathname?.split('/')?.slice(2)?.join(' | ');
	document.title = t.charAt(0).toUpperCase() + t.slice(1);
};

export const genetartMediaURL = (url: string) => {
	return !!url ? ENV.FILE_BASE_URL + '/' + url : '';
};

export const imageURLGenerate = (file?: any): string => {
	if (typeof file === 'undefined') return null;
	if (Array.isArray(file) && !file.length) return null;

	if (Array.isArray(file) && file.length) return ENV.FILE_BASE_URL + file[0].previewUrl;

	if (typeof file === 'string' && file) return ENV.FILE_BASE_URL + file;

	if (typeof file === 'object' && file) return ENV.FILE_BASE_URL + file.previewUrl;

	return null;
};

export const compressImage = async (
	imageFile: File,
	maxSizeMB: number = 0.3,
	maxWidthOrHeight: number = 1920,
	useWebWorker: boolean = true
) => {
	// console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
	const options = {
		maxSizeMB: maxSizeMB,
		maxWidthOrHeight: maxWidthOrHeight,
		useWebWorker: useWebWorker,
	};

	try {
		const compressedFile = await imageCompression(imageFile, options);
		// console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // true
		return await new File([compressedFile], imageFile.name, {
			type: compressedFile.type,
		});
	} catch (error) {
		throw new Error('Image not compressed!');
	}
};

export const dateAction = (prev: number, type: string) => {
	let date: any;
	if (type === 'day') date = new Date(new Date().setDate(new Date().getDate() - prev));

	if (type === 'month') date = new Date(new Date().setMonth(new Date().getMonth() - prev));

	return date;
};

export const dateCompare = (sd, ed) => {
	const sDate = new Date(sd).toLocaleDateString();
	const eDate = new Date(ed).toLocaleDateString();

	const today = new Date().toLocaleDateString();
	const yesterday = new Date(dateAction(1, 'day')).toLocaleDateString();
	const week = new Date(dateAction(7, 'day')).toLocaleDateString();
	const month = new Date(dateAction(1, 'month')).toLocaleDateString();

	if (sDate === today) return 'Today';

	if (yesterday === sDate && (today === eDate || yesterday === eDate)) return 'Yesterday';

	if (week === sDate) return 'This Week';

	if (month === sDate) return 'This Month';

	return (
		generateDateFormat(new Date(sDate).toLocaleDateString(), '%date% %MM% %yyyy%') +
		' - ' +
		generateDateFormat(new Date(ed ? eDate : new Date()).toLocaleDateString(), '%date% %MM% %yyyy%')
	);
};
export const objectTrim = (object: { [key: string]: string | number | any }) => {
	if (object instanceof Object)
		return Object.keys(object).forEach(
			(key) => (object[key] = typeof object[key] === 'string' ? object[key].trim() : object[key])
		);

	return;
};

export const currencySymbol = (locale, currency) => {
	const formatter = new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
	});

	let symbol;
	formatter.formatToParts(0).forEach(({ type, value }) => {
		if (type === 'currency') {
			symbol = value;
		}
	});

	return symbol;
};

// number formate

export const formateNumber = (num: number | string) => {
	if (!num) return 0;
	return num.toLocaleString('en-IN');
};
