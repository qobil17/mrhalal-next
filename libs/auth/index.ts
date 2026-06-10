import { jwtDecode } from 'jwt-decode';
import { userVar } from '../../apollo/client';

export const getJwtToken = (): string => {
	if (typeof window === 'undefined') return '';
	return localStorage.getItem('accessToken') ?? '';
};

export const setJwtToken = (token: string): void => {
	if (typeof window === 'undefined') return;
	localStorage.setItem('accessToken', token);
};

export const removeJwtToken = (): void => {
	if (typeof window === 'undefined') return;
	localStorage.removeItem('accessToken');
};

export const updateUserInfo = (token: string): void => {
	if (!token) return;

	const decoded = jwtDecode(token);
	userVar(decoded);
};
