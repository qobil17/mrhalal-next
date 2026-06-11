import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const mockUser = {
	firstName: 'Qobilbek',
	memberImage: '',
};

const Top = () => {
	const device = useDeviceDetect();
	const [open, setOpen] = useState(false);
	const cartCount = 3;

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

						<Link href="/profile" className="profile-nav-btn">
							<span className="profile-nav-avatar">👤</span>
							<span className="profile-nav-name">{mockUser.firstName}</span>
						</Link>

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

					<Link href="/profile" className="profile-nav-btn">
						<span className="profile-nav-avatar">👤</span>
						<span className="profile-nav-name">{mockUser.firstName}</span>
					</Link>
				</div>
			</div>
		</nav>
	);
};

export default Top;
