import { LOCAL_STORAGE_KEY, SESSION_STORAGE_KEY } from '@constants/common.constant';
import { ROUTES } from '@constants/route.constant';
import { IObject } from '@interfaces/common.interface';
import { setAuthHeader } from 'config/api.config';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocalStorageService } from 'services/utils/local-storage.service';
import { isExpiredToken } from 'utils/jwt';

type AuthProps = {
	isAuthenticated: boolean;
	isLoggingOut: boolean;
	makeAuthenticate: (accessToken: string, userInfo: IObject) => void;
	logout: () => void;
};

const initAuth = {
	isAuthenticated: false,
	isLoggingOut: false,
	makeAuthenticate: () => {},
	logout: () => {},
};

export const AuthContext = React.createContext<AuthProps>(initAuth);

export const useAuth = () => useContext(AuthContext);

const isValidToken = () => {
	const accessToken = LocalStorageService.get(SESSION_STORAGE_KEY.ACCESS_TOKEN);
	if (!accessToken) return false;
	return !isExpiredToken(accessToken);
};

const AuthProvider = (props: any) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isValidToken());
	const [isLoggingOut, setLogingOut] = useState<boolean>(false);
	const navigate = useNavigate();

	useEffect(() => {
		setInterval(() => {
			if (!isValidToken()) setIsAuthenticated(isValidToken());
		}, 60 * 1000);

		window.addEventListener('storage', handleInvalidToken);
		return () => window.removeEventListener('storage', handleInvalidToken);
	}, []);

	useEffect(() => {
		setIsAuthenticated(isValidToken());
	}, [isValidToken()]);

	const handleInvalidToken = (e) => {
		if (e.key === SESSION_STORAGE_KEY.ACCESS_TOKEN && e.oldValue && !e.newValue) logout();
	};

	const makeAuthenticate = (accessToken: string, userInfo: IObject) => {
		if (!accessToken) return;
		LocalStorageService.set(SESSION_STORAGE_KEY.ACCESS_TOKEN, accessToken);
		LocalStorageService.set(LOCAL_STORAGE_KEY.USER_INFO, userInfo);
		setIsAuthenticated(true);
		setAuthHeader()
	};

	const logout = useCallback(() => {
		setLogingOut(true);
		setIsAuthenticated(false);
		LocalStorageService.delete(SESSION_STORAGE_KEY.ACCESS_TOKEN);
		navigate(ROUTES.LOGIN);
		setLogingOut(false);
		// AuthService.logout({ token: LocalStorageService.get(SESSION_STORAGE_KEY.ACCESS_TOKEN) })
		// 	.then((res: any) => {
		// 	})
		// 	.catch((err) => ToastService.error(err?.message))
		// 	.finally(() => setLogingOut(false));
	}, []);

	const memoedProps = useMemo(
		() => ({
			isAuthenticated,
			isLoggingOut,
			makeAuthenticate,
			logout,
		}),
		[makeAuthenticate, isAuthenticated, logout]
	);

	return (
		<AuthContext.Provider value={memoedProps}>
			<>{props.children}</>
		</AuthContext.Provider>
	);
};

export default AuthProvider;
