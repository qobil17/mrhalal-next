import { useCallback, useState } from 'react';
import type { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';

type AuthTab = 'login' | 'register';

interface LoginInput {
	phone: string;
	password: string;
}

interface RegisterInput {
	firstName: string;
	lastName: string;
	phone: string;
	password: string;
	confirmPassword: string;
}

const initialLoginInput: LoginInput = {
	phone: '',
	password: '',
};

const initialRegisterInput: RegisterInput = {
	firstName: '',
	lastName: '',
	phone: '',
	password: '',
	confirmPassword: '',
};

const AuthPage: NextPage = () => {
	const device = useDeviceDetect();
	const [activeTab, setActiveTab] = useState<AuthTab>('login');
	const [loginInput, setLoginInput] = useState<LoginInput>(initialLoginInput);
	const [registerInput, setRegisterInput] = useState<RegisterInput>(initialRegisterInput);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleLoginInput = useCallback((name: keyof LoginInput, value: string) => {
		setLoginInput((prev) => ({ ...prev, [name]: value }));
	}, []);

	const handleRegisterInput = useCallback((name: keyof RegisterInput, value: string) => {
		setRegisterInput((prev) => ({ ...prev, [name]: value }));
	}, []);

	const handleLoginSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log('LOGIN:', loginInput);
	};

	const handleRegisterSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log('REGISTER:', registerInput);
	};

	const isLoginDisabled = !loginInput.phone || !loginInput.password;

	const isRegisterDisabled =
		!registerInput.firstName ||
		!registerInput.lastName ||
		!registerInput.phone ||
		!registerInput.password ||
		!registerInput.confirmPassword;

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
							placeholder="+82 10-0000-0000"
							value={loginInput.phone}
							onChange={(e) => handleLoginInput('phone', e.target.value)}
						/>
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
							Kirish
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
							placeholder="+82 10-0000-0000"
							value={registerInput.phone}
							onChange={(e) => handleRegisterInput('phone', e.target.value)}
						/>
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
							Ro&apos;yxatdan o&apos;tish
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
