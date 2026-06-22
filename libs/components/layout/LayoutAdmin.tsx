import { ReactNode, useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { removeJwtToken } from '../../auth';
import { authReadyVar, userVar } from '../../../apollo/client';
import type { Member } from '../../types/member/member';

interface LayoutAdminProps {
	children: ReactNode;
}

const adminNavItems = [
	{ href: '/admin', label: '📊 Dashboard' },
	{ href: '/admin/products', label: '🥩 Mahsulotlar' },
	{ href: '/admin/orders', label: '📦 Buyurtmalar' },
	{ href: '/admin/members', label: '👥 Foydalanuvchilar' },
	{ href: '/admin/categories', label: '🗂️ Kategoriyalar' },
];

const LayoutAdmin = ({ children }: LayoutAdminProps) => {
	const router = useRouter();
	const authReady = useReactiveVar(authReadyVar);
	const user = useReactiveVar(userVar) as Member | null;
	const authorized = authReady && !!user && user.role === 'ADMIN';

	useEffect(() => {
		// Session is still being rehydrated from localStorage - don't make any
		// auth decision yet, otherwise we'd race the rehydration and redirect
		// an actual admin away before their role is even known.
		if (!authReady) return;

		if (!user) {
			router.replace('/auth');
			return;
		}

		if (user.role !== 'ADMIN') {
			router.replace('/');
		}
	}, [authReady, user, router]);

	const handleLogout = () => {
		removeJwtToken();
		userVar(null);
		window.location.href = '/';
	};

	if (!authorized) {
		return (
			<div id="pc-wrap">
				<p className="loading-text">Yuklanmoqda...</p>
			</div>
		);
	}

	return (
		<div id="pc-wrap">
			<div className="admin-layout">
				<aside className="admin-sidebar">
					<div className="admin-logo">
						<Image src="/mrhalal_logo_v3.svg" width={48} height={48} alt="Mr. Halal" />
						<span>Admin Panel</span>
					</div>
					<nav className="admin-nav">
						{adminNavItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={`admin-nav-item ${router.pathname === item.href ? 'active' : ''}`}
							>
								{item.label}
							</Link>
						))}
					</nav>
					<button className="admin-logout" onClick={handleLogout}>
						🚪 Chiqish
					</button>
				</aside>
				<main className="admin-content">{children}</main>
			</div>
		</div>
	);
};

export const withLayoutAdmin = <P extends object>(Component: NextPage<P>): NextPage<P> => {
	const WithLayoutAdmin: NextPage<P> = (props) => (
		<LayoutAdmin>
			<Component {...props} />
		</LayoutAdmin>
	);

	WithLayoutAdmin.displayName = `withLayoutAdmin(${Component.displayName ?? Component.name ?? 'Component'})`;

	return WithLayoutAdmin;
};

export default LayoutAdmin;
