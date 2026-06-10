import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useReactiveVar } from '@apollo/client';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { userVar } from '../../../apollo/client';
import { removeJwtToken } from '../../auth';

const Top = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const [open, setOpen] = useState(false);

	const handleLogout = () => {
		removeJwtToken();
		userVar(null);
	};

	if (device === 'mobile') {
		return (
			<nav className="mobile-navbar">
				<div className="mobile-navbar-row">
					<Link href="/" className="logo">
						<Image src="/mrhalal_logo_v3.svg" width={100} height={50} alt="Mr. Halal" />
					</Link>
					<button className="hamburger" onClick={() => setOpen((prev) => !prev)} aria-label="Menu">
						☰
					</button>
				</div>

				{open && (
					<div className="mobile-menu">
						<Link href="/" onClick={() => setOpen(false)}>
							Home
						</Link>
						<Link href="/products" onClick={() => setOpen(false)}>
							Products
						</Link>
						<Link href="/about" onClick={() => setOpen(false)}>
							About
						</Link>

						<div className="lang-switcher">
							<button>UZ</button>
							<button>KO</button>
							<button>EN</button>
						</div>

						{user?.memberFirstName ? (
							<div className="auth-box">
								<span className="user-name">{user.memberFirstName}</span>
								<button onClick={handleLogout}>Logout</button>
							</div>
						) : (
							<Link href="/auth" className="login-btn" onClick={() => setOpen(false)}>
								Login
							</Link>
						)}
					</div>
				)}
			</nav>
		);
	}

	return (
		<nav className="navbar">
			<div className="container">
				<Link href="/" className="logo">
					<Image src="/mrhalal_logo_v3.svg" width={120} height={60} alt="Mr. Halal" />
				</Link>

				<div className="nav-links">
					<Link href="/">Home</Link>
					<Link href="/products">Products</Link>
					<Link href="/about">About</Link>
				</div>

				<div className="nav-right">
					<div className="lang-switcher">
						<button>UZ</button>
						<button>KO</button>
						<button>EN</button>
					</div>

					{user?.memberFirstName ? (
						<div className="auth-box">
							<span className="user-name">{user.memberFirstName}</span>
							<button className="auth-btn" onClick={handleLogout}>
								Logout
							</button>
						</div>
					) : (
						<Link href="/auth" className="auth-btn">
							Login
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Top;
