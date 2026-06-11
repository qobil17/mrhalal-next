import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useReactiveVar } from '@apollo/client';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { userVar } from '../../../apollo/client';
import { logOut } from '../../auth';
import type { Member } from '../../types/member/member';

const Top = () => {
	const device = useDeviceDetect();
	const [open, setOpen] = useState(false);
	const cartCount = 3;
	const user = useReactiveVar(userVar) as Member | null;

	if (device === 'mobile') {
		return (
			<nav className="mobile-navbar">
				<div className="mobile-navbar-row">
					<Link href="/" className="logo">
						<Image src="/mrhalal_logo_v3.svg" width={100} height={50} alt="Mr. Halal" />
					</Link>

					<div className="mobile-navbar-right">
						<Link href="/cart" className="cart-icon-btn">
							<span className="cart-emoji">🛒</span>
							{cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
						</Link>

						{user ? (
							<Link href="/profile" className="profile-nav-btn">
								<span className="profile-nav-avatar">👤</span>
								<span className="profile-nav-name">{user.firstName}</span>
							</Link>
						) : (
							<Link href="/auth" className="auth-btn">
								Login
							</Link>
						)}

						<button className="hamburger" onClick={() => setOpen((prev) => !prev)} aria-label="Menu">
							☰
						</button>
					</div>
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

						{user && (
							<button className="mobile-logout-btn" onClick={logOut}>
								Chiqish
							</button>
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
					<Link href="/cart" className="cart-icon-btn">
						<span className="cart-emoji">🛒</span>
						{cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
					</Link>

					<div className="lang-switcher">
						<button>UZ</button>
						<button>KO</button>
						<button>EN</button>
					</div>

					{user ? (
						<div className="nav-user">
							<Link href="/profile" className="profile-nav-btn">
								<span className="profile-nav-avatar">👤</span>
								<span className="profile-nav-name">{user.firstName}</span>
							</Link>
							<button className="nav-logout-btn" onClick={logOut}>
								Chiqish
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
