import { jwtDecode } from 'jwt-decode';
import { userVar } from '../../apollo/client';
import type { Member } from '../types/member/member';

export const getJwtToken = (): string | null => {
	if (typeof window === 'undefined') return null;
	return localStorage.getItem('accessToken');
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
	try {
		const decoded = jwtDecode<Member>(token);
		userVar(decoded);
	} catch {
		userVar(null);
	}
};

export const logOut = (): void => {
	removeJwtToken();
	userVar(null);
	window.location.href = '/';
};
