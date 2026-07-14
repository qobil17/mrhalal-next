import { ReactNode, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useQuery, useReactiveVar } from '@apollo/client';
import Swal from 'sweetalert2';
import { removeJwtToken } from '../../auth';
import { authReadyVar, userVar } from '../../../apollo/client';
import { GET_EXPIRING_PRODUCTS } from '../../../apollo/admin/query';
import { getLocalizedName, langVar, t } from '../../i18n';
import type { Member } from '../../types/member/member';
import type { Product } from '../../types/product/product';

interface LayoutAdminProps {
	children: ReactNode;
}

const adminNavItems = [
	{ href: '/admin', label: '📊 Dashboard' },
	{ href: '/admin/products', label: '🥩 Mahsulotlar' },
	{ href: '/admin/orders', label: '📦 Buyurtmalar' },
	{ href: '/admin/members', label: '👥 Foydalanuvchilar' },
	{ href: '/admin/categories', label: '🗂️ Kategoriyalar' },
	{ href: '/admin/banners', label: '🖼️ Bannerlar' },
];

// Module-level (not component state) so the "show once" behavior survives
// LayoutAdmin remounting on every admin page navigation, and only resets on
// a full page reload.
let expiryAlertShown = false;

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const LayoutAdmin = ({ children }: LayoutAdminProps) => {
	const router = useRouter();
	const authReady = useReactiveVar(authReadyVar);
	const user = useReactiveVar(userVar) as Member | null;
	const lang = useReactiveVar(langVar);
	const authorized = authReady && !!user && user.role === 'ADMIN';
	const [showExpiryPanel, setShowExpiryPanel] = useState(false);

	const { data: expiringData } = useQuery<{ getExpiringProducts: Product[] }>(GET_EXPIRING_PRODUCTS, {
		skip: !authorized,
	});
	const expiringProducts = expiringData?.getExpiringProducts ?? [];

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

	useEffect(() => {
		if (!expiringData || expiryAlertShown) return;
		if (expiringProducts.length === 0) return;

		expiryAlertShown = true;
		Swal.fire({
			icon: 'warning',
			title: t('adminExpiryAlertTitle', lang),
			text: t('adminExpiryAlertMessage', lang).replace('{count}', String(expiringProducts.length)),
		});
	}, [expiringData, expiringProducts, lang]);

	const getDaysLabel = (expiryDate: string): { text: string; overdue: boolean } => {
		const diffDays = Math.ceil((new Date(expiryDate).getTime() - Date.now()) / MS_PER_DAY);

		if (diffDays === 0) return { text: t('adminExpiryDueToday', lang), overdue: false };
		if (diffDays > 0) return { text: t('adminExpiryDaysLeft', lang).replace('{days}', String(diffDays)), overdue: false };
		return { text: t('adminExpiryDaysOverdue', lang).replace('{days}', String(Math.abs(diffDays))), overdue: true };
	};

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
				<div className="admin-main">
					<div className="admin-topbar">
						<div className="notification-bell-wrap">
							<button
								type="button"
								className="notification-bell"
								onClick={() => setShowExpiryPanel((prev) => !prev)}
								aria-label={t('adminExpiryPanelTitle', lang)}
							>
								🔔
								{expiringProducts.length > 0 && (
									<span className="notification-badge">{expiringProducts.length}</span>
								)}
							</button>

							{showExpiryPanel && (
								<>
									<div className="notification-backdrop" onClick={() => setShowExpiryPanel(false)} />
									<div className="notification-panel">
										<div className="notification-panel-title">{t('adminExpiryPanelTitle', lang)}</div>
										{expiringProducts.length === 0 ? (
											<p className="notification-empty">—</p>
										) : (
											<ul className="notification-list">
												{expiringProducts.map((product) => {
													const { text, overdue } = getDaysLabel(product.expiryDate!);
													return (
														<li key={product.id} className="notification-item">
															<span className="notification-item-name">{getLocalizedName(product, lang)}</span>
															<span className="notification-item-date">
																{new Date(product.expiryDate!).toISOString().slice(0, 10)}
															</span>
															<span className={`notification-item-days ${overdue ? 'overdue' : ''}`}>{text}</span>
														</li>
													);
												})}
											</ul>
										)}
									</div>
								</>
							)}
						</div>
					</div>
					<main className="admin-content">{children}</main>
				</div>
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
