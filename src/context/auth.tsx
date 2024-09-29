import { LOCAL_STORAGE_KEY, SESSION_STORAGE_KEY } from '@constants/common.constant';
import { ROUTES } from '@constants/route.constant';
import { IObject } from '@interfaces/common.interface';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocalStorageService } from 'services/utils/localStorage.service';
import { SessionStorageService } from 'services/utils/session-storage.service';
import { isExpiredToken } from 'utils/jwt';

type AuthProps = {
	isAuthenticated: boolean;
	makeAuthenticate: (accessToken: string, userInfo: IObject) => void;
	logout: () => void;
};

const initAuth = {
	isAuthenticated: false,
	makeAuthenticate: () => {},
	logout: () => {},
};

export const AuthContext = React.createContext<AuthProps>(initAuth);

export const useAuth = () => useContext(AuthContext);

const isValidToken = () => {
	const accessToken = SessionStorageService.get(SESSION_STORAGE_KEY.ACCESS_TOKEN);
	if (!accessToken) return false;
	return !isExpiredToken(accessToken);
};

const AuthProvider = (props: any) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isValidToken());
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
		if (accessToken) {
			SessionStorageService.set(SESSION_STORAGE_KEY.ACCESS_TOKEN, accessToken);
			LocalStorageService.set(LOCAL_STORAGE_KEY.USER_INFO, userInfo);
			setIsAuthenticated(true);
		}
	};

	const logout = () => {
		setIsAuthenticated(false);
		SessionStorageService.delete(SESSION_STORAGE_KEY.ACCESS_TOKEN);
		navigate(ROUTES.LOGIN);
	};

	const memoedProps = useMemo(
		() => ({
			makeAuthenticate,
			isAuthenticated,
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
