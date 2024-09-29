import { ROUTES } from '@constants/route.constant';
import Login from '@pages/auth/Login';
import { useAuth } from 'context/auth';
import { useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { AdminRouter } from './routes';

export default function () {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isAuthenticated) navigate(ROUTES.LOGIN, { replace: true });
	}, [isAuthenticated]);

	return (
		<Routes>
			{isAuthenticated ? (
				<Route path='*' element={<AdminRouter />} />
			) : (
				<>
					<Route path='/login' element={<Login />} />
					<Route path='*' element={<Navigate to={ROUTES.LOGIN} replace />} />
				</>
			)}
			{/* <Route path="/invoice" element={<ReactPDF />} /> */}
		</Routes>
	);
}
