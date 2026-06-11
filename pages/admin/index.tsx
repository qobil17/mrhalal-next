import type { NextPage } from 'next';
import { withLayoutAdmin } from '../../libs/components/layout/LayoutAdmin';

const stats = [
	{ icon: '🥩', label: 'Mahsulotlar', value: '24' },
	{ icon: '📦', label: 'Buyurtmalar', value: '156' },
	{ icon: '👥', label: 'Foydalanuvchilar', value: '89' },
	{ icon: '💰', label: 'Daromad', value: '4 250 000 ₩' },
];

const AdminDashboardPage: NextPage = () => {
	return (
		<div className="admin-page">
			<h1 className="admin-page-title">Dashboard</h1>
			<div className="stats-grid">
				{stats.map((stat) => (
					<div key={stat.label} className="stat-card">
						<span className="stat-icon">{stat.icon}</span>
						<div>
							<p className="stat-label">{stat.label}</p>
							<p className="stat-value">{stat.value}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default withLayoutAdmin(AdminDashboardPage);
