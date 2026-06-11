import { OrderStatus } from '../../enums/order.enum';

interface MockOrder {
	_id: string;
	orderNumber: string;
	orderStatus: OrderStatus;
	orderTotal: number;
	createdAt: string;
}

const mockOrders: MockOrder[] = [
	{ _id: '1', orderNumber: 'HM-2024-0001', orderStatus: OrderStatus.DELIVERED, orderTotal: 45000, createdAt: '2024-01-15' },
	{ _id: '2', orderNumber: 'HM-2024-0002', orderStatus: OrderStatus.PAID, orderTotal: 78000, createdAt: '2024-02-10' },
	{ _id: '3', orderNumber: 'HM-2024-0003', orderStatus: OrderStatus.PENDING, orderTotal: 32000, createdAt: '2024-03-05' },
];

const STATUS_COLORS: Record<OrderStatus, string> = {
	[OrderStatus.PENDING]: '#FFA500',
	[OrderStatus.PAID]: '#1A9E6B',
	[OrderStatus.SHIPPED]: '#3B82F6',
	[OrderStatus.DELIVERED]: '#22C55E',
	[OrderStatus.CANCELLED]: '#EF4444',
};

const ProfileOrders = () => {
	return (
		<div className="profile-orders">
			<h2>Buyurtmalar</h2>

			<div className="orders-list">
				{mockOrders.map((order) => (
					<div key={order._id} className="order-card">
						<div className="order-info">
							<p className="order-number">{order.orderNumber}</p>
							<p className="order-date">{order.createdAt}</p>
						</div>

						<span className="order-status" style={{ background: STATUS_COLORS[order.orderStatus] }}>
							{order.orderStatus}
						</span>

						<p className="order-total">₩{order.orderTotal.toLocaleString()}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default ProfileOrders;
