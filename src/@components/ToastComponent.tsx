import { ToastContainer } from 'react-toastify';

export const ToastComponent = () => {
	return (
		<ToastContainer
			position={window.innerWidth <= 700 ? 'top-center' : 'top-right'}
			autoClose={3000}
			hideProgressBar={true}
			newestOnTop={false}
			closeOnClick
			rtl={false}
			pauseOnFocusLoss
			draggable
			pauseOnHover
			theme='colored'
		/>
	);
};
