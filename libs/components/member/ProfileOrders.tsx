import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_MY_ORDERS } from '../../../apollo/user/query';
import { langVar, t } from '../../i18n';
import type { Order, OrdersResponse } from '../../types/order/order';

const STATUS_COLORS: Record<string, string> = {
	PENDING: '#FFA500',
	CONFIRMED: '#8B5CF6',
	PAID: '#1A9E6B',
	SHIPPED: '#3B82F6',
	DELIVERED: '#22C55E',
	CANCELLED: '#EF4444',
};

const ProfileOrders = () => {
	const lang = useReactiveVar(langVar);
	const { data, loading } = useQuery<{ getMyOrders: OrdersResponse }>(GET_MY_ORDERS, {
		variables: { input: { page: 1, limit: 10 } },
	});

	const orders: Order[] = data?.getMyOrders?.list ?? [];

	return (
		<div className="profile-orders">
			<h2>{t('orders', lang)}</h2>

			{loading ? (
				<p className="loading-text">{t('loading', lang)}</p>
			) : orders.length > 0 ? (
				<div className="orders-list">
					{orders.map((order) => (
						<div key={order.id} className="order-card">
							<div className="order-info">
								<p className="order-number">{order.orderNumber}</p>
								<p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
							</div>

							<span className="order-status" style={{ background: STATUS_COLORS[order.status] ?? '#999' }}>
								{order.status}
							</span>

							<p className="order-total">₩{order.total.toLocaleString()}</p>
						</div>
					))}
				</div>
			) : (
				<p className="empty-text">{t('noOrders', lang)}</p>
			)}
		</div>
	);
};

export default ProfileOrders;
