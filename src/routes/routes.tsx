import ErrorBoundary from '@components/ErrorBoundary';
import { IRoute } from '@interfaces/route.interface';
import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { TopProgressCom } from 'services/utils/topProgress.service';
import { routeList } from './list.route';
import { DASHBOARD } from './path-name.route';

const Layout = lazy(() => import('layouts/index'));
const NotFound = lazy(() => import('@pages/errors/PageNotFound'));

// const PrivateRoute = memo(({ children }:any) => {
//   setWindowTitle();
//   const { isAuthenticated, logout } = useAuth();
//   const { user_data } = useSelector((state: any) => state?.user);
//   const location = useLocation();
//   if (isAuthenticated) {
//     if (
//       isDateExpired(user_data?.store_package_renewal_date) &&
//       !expiredRoutes.includes(location.pathname)
//     ) {
//       ToastService.warning("Please upgrade your plan first");
//       return <Navigate to={SETTINGS_PRICING_PLAN} />;
//     }
//     return children;
//   }
//   return logout();
// });

export const AdminRouter = () => (
	<React.Fragment>
		<Routes>
			<Route element={<Layout />}>
				{routeList.map((route: IRoute, index) => {
					const path = typeof route.path === 'function' ? route.path(route?.params) : route.path;
					return (
						<Route
							path={path}
							key={index}
							element={
								<Suspense fallback={<TopProgressCom />}>
									<ErrorBoundary>
										<route.component />
									</ErrorBoundary>
								</Suspense>
							}
						/>
					);
				})}
				<Route path='*' element={<NotFound />} />
			</Route>
			<Route path='/' element={<Navigate to={DASHBOARD} replace />} />
		</Routes>
	</React.Fragment>
);
