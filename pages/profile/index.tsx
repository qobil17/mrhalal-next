import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useQuery, useReactiveVar } from '@apollo/client';
import { withLayoutHome } from '../../libs/components/layout/LayoutHome';
import ProfileInfo from '../../libs/components/member/ProfileInfo';
import ProfileAddress from '../../libs/components/member/ProfileAddress';
import ProfileOrders from '../../libs/components/member/ProfileOrders';
import ProfileWishlist from '../../libs/components/member/ProfileWishlist';
import { GET_MY_PROFILE } from '../../apollo/user/query';
import { logOut } from '../../libs/auth';
import { authReadyVar, userVar } from '../../apollo/client';
import { langVar, t } from '../../libs/i18n';
import type { Member } from '../../libs/types/member/member';

type ProfileTab = 'info' | 'address' | 'orders' | 'wishlist';

const VALID_TABS: ProfileTab[] = ['info', 'address', 'orders', 'wishlist'];

const ProfilePage: NextPage = () => {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<ProfileTab>('info');
	const authReady = useReactiveVar(authReadyVar);
	const user = useReactiveVar(userVar) as Member | null;
	const lang = useReactiveVar(langVar);

	useEffect(() => {
		const tab = router.query.tab;
		if (typeof tab === 'string' && VALID_TABS.includes(tab as ProfileTab)) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setActiveTab(tab as ProfileTab);
		}
	}, [router.query.tab]);

	const { data, loading } = useQuery<{ getMyProfile: Member }>(GET_MY_PROFILE, {
		skip: !user,
	});

	if (!authReady) {
		return (
			<div className="profile-page">
				<div className="container">
					<p className="loading-text">{t('loading', lang)}</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="profile-page">
				<div className="container">
					<div className="cart-empty">
						<span>🔒</span>
						<p>{t('loginRequired', lang)}</p>
						<Link href="/auth">{t('goToLogin', lang)}</Link>
					</div>
				</div>
			</div>
		);
	}

	if (loading || !data?.getMyProfile) {
		return (
			<div className="profile-page">
				<div className="container">
					<p className="loading-text">{t('loading', lang)}</p>
				</div>
			</div>
		);
	}

	const profile = data.getMyProfile;

	return (
		<div className="profile-page">
			<div className="container">
				<div className="profile-layout">
					<aside className="profile-sidebar">
						<div className="sidebar-user">
							<div className="sidebar-avatar">
								{user?.avatar ? (
									<Image
										src={user.avatar}
										alt={profile.firstName}
										width={48}
										height={48}
										style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
									/>
								) : (
									'👤'
								)}
							</div>
							<div className="sidebar-user-info">
								<strong>
									{profile.firstName} {profile.lastName}
								</strong>
								<span>{profile.phone}</span>
							</div>
						</div>
						<div className="sidebar-divider" />
						<div className="sidebar-body">
							<nav className="sidebar-nav">
								<button
									type="button"
									className={`sidebar-nav-item ${activeTab === 'info' ? 'active' : ''}`}
									onClick={() => setActiveTab('info')}
								>
									<span className="nav-icon">👤</span>
									<span>{t('personalInfo', lang)}</span>
								</button>
								<button
									type="button"
									className={`sidebar-nav-item ${activeTab === 'address' ? 'active' : ''}`}
									onClick={() => setActiveTab('address')}
								>
									<span className="nav-icon">📍</span>
									<span>{t('addresses', lang)}</span>
								</button>
								<button
									type="button"
									className={`sidebar-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
									onClick={() => setActiveTab('orders')}
								>
									<span className="nav-icon">📦</span>
									<span>{t('orders', lang)}</span>
								</button>
								<button
									type="button"
									className={`sidebar-nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
									onClick={() => setActiveTab('wishlist')}
								>
									<span className="nav-icon">❤️</span>
									<span>{t('wishlist', lang)}</span>
								</button>
							</nav>
							<div className="sidebar-divider" />
							<button type="button" className="sidebar-logout" onClick={logOut}>
								<span className="nav-icon">🚪</span>
								<span>{t('logout', lang)}</span>
							</button>
						</div>
					</aside>

					<main className="profile-content">
						{activeTab === 'info' && <ProfileInfo user={profile} />}
						{activeTab === 'address' && <ProfileAddress />}
						{activeTab === 'orders' && <ProfileOrders />}
						{activeTab === 'wishlist' && <ProfileWishlist />}
					</main>
				</div>
			</div>
		</div>
	);
};

export default withLayoutHome(ProfilePage);
