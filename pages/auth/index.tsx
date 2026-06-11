import { useCallback, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ApolloError, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { LOGIN, REGISTER } from '../../apollo/user/mutation';
import { setJwtToken } from '../../libs/auth';
import { userVar } from '../../apollo/client';
import type { LoginInput, RegisterInput } from '../../libs/types/member/member.input';
import type { AuthPayload } from '../../libs/types/member/member';

type AuthTab = 'login' | 'register';

interface RegisterFormInput extends RegisterInput {
	confirmPassword: string;
}

const initialLoginInput: LoginInput = {
	phone: '',
	password: '',
};

const initialRegisterInput: RegisterFormInput = {
	firstName: '',
	lastName: '',
	phone: '',
	password: '',
	confirmPassword: '',
};

const getErrorMessage = (err: unknown): string => {
	if (err instanceof ApolloError) {
		const graphQLError = err.graphQLErrors?.[0];
		const originalError = graphQLError?.extensions?.originalError as { message?: string | string[] } | undefined;
		const message = originalError?.message ?? graphQLError?.message ?? err.message;
		return Array.isArray(message) ? message.join(', ') : message || 'Xatolik yuz berdi';
	}
	return err instanceof Error ? err.message : 'Xatolik yuz berdi';
};

const AuthPage: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<AuthTab>('login');
	const [loginInput, setLoginInput] = useState<LoginInput>(initialLoginInput);
	const [registerInput, setRegisterInput] = useState<RegisterFormInput>(initialRegisterInput);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const [login, { loading: loginLoading }] = useMutation<{ login: AuthPayload }, { input: LoginInput }>(LOGIN);
	const [register, { loading: registerLoading }] = useMutation<{ register: AuthPayload }, { input: RegisterInput }>(
		REGISTER,
	);

	const handleLoginInput = useCallback((name: keyof LoginInput, value: string) => {
		setLoginInput((prev) => ({ ...prev, [name]: value }));
	}, []);

	const handleRegisterInput = useCallback((name: keyof RegisterFormInput, value: string) => {
		setRegisterInput((prev) => ({ ...prev, [name]: value }));
	}, []);

	const handleLogin = useCallback(async () => {
		try {
			const { data } = await login({
				variables: {
					input: {
						phone: loginInput.phone,
						password: loginInput.password,
					},
				},
			});

			if (!data) throw new Error('Kirishda xatolik yuz berdi');

			const { accessToken, member } = data.login;
			setJwtToken(accessToken);
			userVar(member);

			await Swal.fire({ icon: 'success', title: 'Muvaffaqiyatli kirdingiz!', timer: 1500, showConfirmButton: false });
			router.push('/');
		} catch (err) {
			const message = getErrorMessage(err);
			await Swal.fire({ icon: 'error', title: 'Xatolik', text: message });
		}
	}, [loginInput, login, router]);

	const handleRegister = useCallback(async () => {
		try {
			const { data } = await register({
				variables: {
					input: {
						firstName: registerInput.firstName,
						lastName: registerInput.lastName,
						phone: registerInput.phone,
						password: registerInput.password,
					},
				},
			});

			if (!data) throw new Error("Ro'yxatdan o'tishda xatolik yuz berdi");

			const { accessToken, member } = data.register;
			setJwtToken(accessToken);
			userVar(member);

			await Swal.fire({
				icon: 'success',
				title: "Muvaffaqiyatli ro'yxatdan o'tdingiz!",
				timer: 1500,
				showConfirmButton: false,
			});
			router.push('/');
		} catch (err) {
			const message = getErrorMessage(err);
			await Swal.fire({ icon: 'error', title: 'Xatolik', text: message });
		}
	}, [registerInput, register, router]);

	const handleLoginSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		void handleLogin();
	};

	const handleRegisterSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		void handleRegister();
	};

	const isLoginDisabled = !loginInput.phone || !loginInput.password || loginLoading;

	const isRegisterDisabled =
		!registerInput.firstName ||
		!registerInput.phone ||
		!registerInput.password ||
		!registerInput.confirmPassword ||
		registerLoading;

	return (
		<div id={device === 'mobile' ? 'mobile-wrap' : 'pc-wrap'} className="auth-page">
			<div className="auth-card">
				<img src="/mrhalal_logo_v3.svg" alt="Mr Halal" width={80} className="auth-logo" />

				<div className="auth-tabs">
					<button
						type="button"
						className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
						onClick={() => setActiveTab('login')}
					>
						Kirish
					</button>
					<button
						type="button"
						className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
						onClick={() => setActiveTab('register')}
					>
						Ro&apos;yxatdan o&apos;tish
					</button>
				</div>

				{activeTab === 'login' ? (
					<form className="auth-form" onSubmit={handleLoginSubmit}>
						<input
							type="tel"
							className="auth-input"
							placeholder="01012345678"
							value={loginInput.phone}
							onChange={(e) => handleLoginInput('phone', e.target.value)}
						/>
						<small className="input-hint">Format: 01012345678 (Korean number)</small>
						<div className="password-wrapper">
							<input
								type={showPassword ? 'text' : 'password'}
								className="auth-input"
								placeholder="Parol"
								value={loginInput.password}
								onChange={(e) => handleLoginInput('password', e.target.value)}
							/>
							<button type="button" className="eye-toggle" onClick={() => setShowPassword((prev) => !prev)}>
								{showPassword ? '🙈' : '👁'}
							</button>
						</div>
						<button type="submit" className="auth-submit" disabled={isLoginDisabled}>
							{loginLoading ? 'Yuklanmoqda...' : 'Kirish'}
						</button>
					</form>
				) : (
					<form className="auth-form" onSubmit={handleRegisterSubmit}>
						<input
							type="text"
							className="auth-input"
							placeholder="Ism"
							value={registerInput.firstName}
							onChange={(e) => handleRegisterInput('firstName', e.target.value)}
						/>
						<input
							type="text"
							className="auth-input"
							placeholder="Familiya"
							value={registerInput.lastName}
							onChange={(e) => handleRegisterInput('lastName', e.target.value)}
						/>
						<input
							type="tel"
							className="auth-input"
							placeholder="01012345678"
							value={registerInput.phone}
							onChange={(e) => handleRegisterInput('phone', e.target.value)}
						/>
						<small className="input-hint">Format: 01012345678 (Korean number)</small>
						<div className="password-wrapper">
							<input
								type={showPassword ? 'text' : 'password'}
								className="auth-input"
								placeholder="Parol"
								value={registerInput.password}
								onChange={(e) => handleRegisterInput('password', e.target.value)}
							/>
							<button type="button" className="eye-toggle" onClick={() => setShowPassword((prev) => !prev)}>
								{showPassword ? '🙈' : '👁'}
							</button>
						</div>
						<div className="password-wrapper">
							<input
								type={showConfirmPassword ? 'text' : 'password'}
								className="auth-input"
								placeholder="Parolni tasdiqlang"
								value={registerInput.confirmPassword}
								onChange={(e) => handleRegisterInput('confirmPassword', e.target.value)}
							/>
							<button
								type="button"
								className="eye-toggle"
								onClick={() => setShowConfirmPassword((prev) => !prev)}
							>
								{showConfirmPassword ? '🙈' : '👁'}
							</button>
						</div>
						<button type="submit" className="auth-submit" disabled={isRegisterDisabled}>
							{registerLoading ? 'Yuklanmoqda...' : "Ro'yxatdan o'tish"}
						</button>
					</form>
				)}

				<div className="auth-switch">
					{activeTab === 'login' ? (
						<button type="button" onClick={() => setActiveTab('register')}>
							Akkauntingiz yo&apos;qmi? Ro&apos;yxatdan o&apos;ting →
						</button>
					) : (
						<button type="button" onClick={() => setActiveTab('login')}>
							Akkauntingiz bormi? Kiring →
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default AuthPage;
