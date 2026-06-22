import type { NextPage } from 'next';
import { useMutation, useQuery } from '@apollo/client';
import { withLayoutAdmin } from '../../../libs/components/layout/LayoutAdmin';
import { GET_ALL_ORDERS_BY_ADMIN } from '../../../apollo/admin/query';
import { UPDATE_ORDER_STATUS_BY_ADMIN } from '../../../apollo/admin/mutation';
import type { Order, OrdersResponse } from '../../../libs/types/order/order';

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const statusClassMap: Record<string, string> = {
	PENDING: 'status-new',
	CONFIRMED: 'status-processing',
	PAID: 'status-processing',
	SHIPPED: 'status-shipping',
	DELIVERED: 'status-completed',
	CANCELLED: 'status-cancelled',
};

const AdminOrdersPage: NextPage = () => {
	const { data, loading, refetch } = useQuery<{ getAllOrdersByAdmin: OrdersResponse }>(GET_ALL_ORDERS_BY_ADMIN, {
		variables: { input: { page: 1, limit: 100 } },
	});

	const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS_BY_ADMIN);

	const orders = data?.getAllOrdersByAdmin?.list ?? [];

	const handleStatusChange = async (order: Order, status: string) => {
		await updateOrderStatus({ variables: { input: { id: Number(order.id), status } } });
		await refetch();
	};

	return (
		<div className="admin-page">
			<h1 className="admin-page-title">Buyurtmalar</h1>
			<div className="admin-table-wrap">
				<div className="admin-table-header">
					<h2>Buyurtmalar ro&apos;yxati</h2>
				</div>

				{loading ? (
					<p className="loading-text">Yuklanmoqda...</p>
				) : (
					<table>
						<thead>
							<tr>
								<th>№</th>
								<th>Buyurtma №</th>
								<th>Mahsulotlar</th>
								<th>Jami</th>
								<th>Holat</th>
								<th>Sana</th>
								<th>Amallar</th>
							</tr>
						</thead>
						<tbody>
							{orders.map((order, index) => (
								<tr key={order.id}>
									<td>{index + 1}</td>
									<td>{order.orderNumber}</td>
									<td>{order.items.map((item) => item.productName).join(', ')}</td>
									<td>{order.total.toLocaleString()} ₩</td>
									<td>
										<span className={`status-badge ${statusClassMap[order.status] ?? ''}`}>{order.status}</span>
									</td>
									<td>{new Date(order.createdAt).toLocaleDateString()}</td>
									<td>
										<select
											className="admin-status-select"
											value={order.status}
											onChange={(e) => handleStatusChange(order, e.target.value)}
										>
											{ORDER_STATUSES.map((status) => (
												<option key={status} value={status}>
													{status}
												</option>
											))}
										</select>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
};

export default withLayoutAdmin(AdminOrdersPage);
