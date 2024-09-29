import { ToastPromiseParams, toast as toastify } from 'react-toastify';
import { Id, ToastOptions, TypeOptions } from 'react-toastify/dist/types';

export const ToastService = {
	success: (message: string): Id =>
		toastify.success(message || 'Successfull 👍', { style: { backgroundColor: '#27AE60' } }),
	error: (message: string): Id =>
		toastify.error(message || 'Sorry! Something went wrong!', {
			autoClose: 5000,
			className: 'bg-danger',
		}),
	info: (message: string): Id => toastify.info(message, { className: 'bg-info' }),
	warning: (message: string): Id => toastify.warning(message, { className: 'bg-warning', autoClose: 5000 }),
	promise: (
		callBack: Promise<unknown>,
		{ pending, error, success }: ToastPromiseParams,
		options?: ToastOptions
	): any =>
		toastify.promise(
			callBack,
			{
				pending: pending || 'Processing, please wait...',
				success: success || 'Successfull 👍',
				error: error || 'Sorry! Something went wrong!',
			},
			{ position: 'top-center', theme: 'light', ...options }
		),
	loading: (message?: string): Id =>
		toastify.loading(message || 'Processing, please wait...', {
			theme: 'light',
			position: 'top-center',
		}),
	update: (toastId: Id, message: string, type: TypeOptions, isLoading: boolean = false): void =>
		toastify.update(toastId, {
			render: message,
			type,
			isLoading,
			autoClose: isLoading ? false : 4000,
			closeButton: isLoading ? false : true,
		}),
};

export const withToastLoader = (
	callBack: (success: (value?: unknown) => void, error: (reason?: any) => void) => void
) => {
	ToastService.promise(new Promise((resolve, reject) => callBack(resolve, reject)), {
		success: 'Processed succesfully 👍',
	});
};
