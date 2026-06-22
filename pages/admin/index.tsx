import type { NextPage } from 'next';
import { useQuery } from '@apollo/client';
import { withLayoutAdmin } from '../../libs/components/layout/LayoutAdmin';
import { GET_ALL_PRODUCTS_BY_ADMIN, GET_ALL_ORDERS_BY_ADMIN, GET_ALL_MEMBERS_BY_ADMIN } from '../../apollo/admin/query';
import type { ProductsResponse } from '../../libs/types/product/product';
import type { OrdersResponse } from '../../libs/types/order/order';

interface MembersTotal {
	total: number;
}

const AdminDashboardPage: NextPage = () => {
	const { data: productsData } = useQuery<{ getAllProductsByAdmin: ProductsResponse }>(GET_ALL_PRODUCTS_BY_ADMIN, {
		variables: { input: { page: 1, limit: 1 } },
	});
	const { data: ordersData } = useQuery<{ getAllOrdersByAdmin: OrdersResponse }>(GET_ALL_ORDERS_BY_ADMIN, {
		variables: { input: { page: 1, limit: 100 } },
	});
	const { data: membersData } = useQuery<{ getAllMembersByAdmin: MembersTotal }>(GET_ALL_MEMBERS_BY_ADMIN, {
		variables: { input: { page: 1, limit: 1 } },
	});

	const orders = ordersData?.getAllOrdersByAdmin?.list ?? [];
	const revenue = orders
		.filter((order) => order.status !== 'CANCELLED')
		.reduce((sum, order) => sum + order.total, 0);

	const stats = [
		{ icon: '🥩', label: 'Mahsulotlar', value: String(productsData?.getAllProductsByAdmin?.total ?? 0) },
		{ icon: '📦', label: 'Buyurtmalar', value: String(ordersData?.getAllOrdersByAdmin?.total ?? 0) },
		{ icon: '👥', label: 'Foydalanuvchilar', value: String(membersData?.getAllMembersByAdmin?.total ?? 0) },
		{ icon: '💰', label: 'Daromad', value: `${revenue.toLocaleString()} ₩` },
	];

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
