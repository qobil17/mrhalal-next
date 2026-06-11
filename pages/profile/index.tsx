import { useState } from 'react';
import type { NextPage } from 'next';
import { withLayoutHome } from '../../libs/components/layout/LayoutHome';
import ProfileInfo from '../../libs/components/member/ProfileInfo';
import ProfileAddress from '../../libs/components/member/ProfileAddress';
import ProfileOrders from '../../libs/components/member/ProfileOrders';
import ProfileWishlist from '../../libs/components/member/ProfileWishlist';

type ProfileTab = 'info' | 'address' | 'orders' | 'wishlist';

const mockUser = {
	firstName: 'Qobilbek',
	lastName: 'Ibrohimov',
	phone: '+82 10-9643-4477',
	memberImage: '',
};

const ProfilePage: NextPage = () => {
	const [activeTab, setActiveTab] = useState<ProfileTab>('info');
	const { firstName, lastName, phone } = mockUser;

	return (
		<div className="profile-page">
			<div className="container">
				<div className="profile-layout">
					<aside className="profile-sidebar">
						<div className="sidebar-user">
							<div className="sidebar-avatar">👤</div>
							<div className="sidebar-user-info">
								<strong>
									{firstName} {lastName}
								</strong>
								<span>{phone}</span>
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
									<span>Shaxsiy ma&apos;lumotlar</span>
								</button>
								<button
									type="button"
									className={`sidebar-nav-item ${activeTab === 'address' ? 'active' : ''}`}
									onClick={() => setActiveTab('address')}
								>
									<span className="nav-icon">📍</span>
									<span>Manzillar</span>
								</button>
								<button
									type="button"
									className={`sidebar-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
									onClick={() => setActiveTab('orders')}
								>
									<span className="nav-icon">📦</span>
									<span>Buyurtmalar</span>
								</button>
								<button
									type="button"
									className={`sidebar-nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
									onClick={() => setActiveTab('wishlist')}
								>
									<span className="nav-icon">❤️</span>
									<span>Wishlist</span>
								</button>
							</nav>
							<div className="sidebar-divider" />
							<button type="button" className="sidebar-logout">
								<span className="nav-icon">🚪</span>
								<span>Chiqish</span>
							</button>
						</div>
					</aside>

					<main className="profile-content">
						{activeTab === 'info' && <ProfileInfo user={mockUser} />}
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
