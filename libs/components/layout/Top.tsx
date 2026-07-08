import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useReactiveVar } from '@apollo/client';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { userVar } from '../../../apollo/client';
import { logOut } from '../../auth';
import { GET_MY_CART } from '../../../apollo/user/query';
import { langVar, setLang, t, type Lang } from '../../i18n';
import type { Member } from '../../types/member/member';
import type { Cart } from '../../types/cart/cart';

const LANGUAGES: Lang[] = ['UZ', 'KO', 'EN'];

const Top = () => {
	const device = useDeviceDetect();
	const [open, setOpen] = useState(false);
	const user = useReactiveVar(userVar) as Member | null;
	const lang = useReactiveVar(langVar);

	const { data: cartData } = useQuery<{ getMyCart: Cart }>(GET_MY_CART, { skip: !user });
	const cartCount = cartData?.getMyCart?.itemCount ?? 0;

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
								{user.avatar ? (
									<Image
										src={user.avatar}
										alt={user.firstName}
										width={28}
										height={28}
										style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
									/>
								) : (
									<span className="profile-nav-avatar">👤</span>
								)}
								<span className="profile-nav-name">{user.firstName}</span>
							</Link>
						) : (
							<Link href="/auth" className="auth-btn">
								{t('login', lang)}
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
							{t('home', lang)}
						</Link>
						<Link href="/products" onClick={() => setOpen(false)}>
							{t('products', lang)}
						</Link>
						<Link href="/about" onClick={() => setOpen(false)}>
							{t('about', lang)}
						</Link>

						<div className="lang-switcher">
							{LANGUAGES.map((code) => (
								<button
									key={code}
									type="button"
									className={code === lang ? 'active' : ''}
									onClick={() => setLang(code)}
								>
									{code}
								</button>
							))}
						</div>

						{user && (
							<button className="mobile-logout-btn" onClick={logOut}>
								{t('logout', lang)}
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
					<Link href="/">{t('home', lang)}</Link>
					<Link href="/products">{t('products', lang)}</Link>
					<Link href="/about">{t('about', lang)}</Link>
				</div>

				<div className="nav-right">
					<Link href="/cart" className="cart-icon-btn">
						<span className="cart-emoji">🛒</span>
						{cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
					</Link>

					<div className="lang-switcher">
						{LANGUAGES.map((code) => (
							<button
								key={code}
								type="button"
								className={code === lang ? 'active' : ''}
								onClick={() => setLang(code)}
							>
								{code}
							</button>
						))}
					</div>

					{user ? (
						<div className="nav-user">
							<Link href="/profile" className="profile-nav-btn">
								{user.avatar ? (
									<Image
										src={user.avatar}
										alt={user.firstName}
										width={28}
										height={28}
										style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
									/>
								) : (
									<span className="profile-nav-avatar">👤</span>
								)}
								<span className="profile-nav-name">{user.firstName}</span>
							</Link>
							<button className="nav-logout-btn" onClick={logOut}>
								{t('logout', lang)}
							</button>
						</div>
					) : (
						<Link href="/auth" className="auth-btn">
							{t('login', lang)}
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Top;
