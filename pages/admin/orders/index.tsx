import type { NextPage } from 'next';
import { withLayoutAdmin } from '../../../libs/components/layout/LayoutAdmin';

interface AdminOrderRow {
	orderNumber: string;
	customer: string;
	total: number;
	status: 'Yangi' | 'Jarayonda' | 'Yetkazilmoqda' | 'Yakunlangan' | 'Bekor qilingan';
	date: string;
}

const orders: AdminOrderRow[] = [
	{ orderNumber: '#10025', customer: 'Qobilbek Ibrohimov', total: 145000, status: 'Yangi', date: '2026-06-10' },
	{ orderNumber: '#10024', customer: 'Aziz Karimov', total: 89000, status: 'Jarayonda', date: '2026-06-10' },
	{ orderNumber: '#10023', customer: 'Dilnoza Yusupova', total: 232000, status: 'Yetkazilmoqda', date: '2026-06-09' },
	{ orderNumber: '#10022', customer: 'Bekzod Tursunov', total: 67000, status: 'Yakunlangan', date: '2026-06-09' },
	{ orderNumber: '#10021', customer: 'Madina Aliyeva', total: 124000, status: 'Bekor qilingan', date: '2026-06-08' },
];

const statusClassMap: Record<AdminOrderRow['status'], string> = {
	Yangi: 'status-new',
	Jarayonda: 'status-processing',
	Yetkazilmoqda: 'status-shipping',
	Yakunlangan: 'status-completed',
	'Bekor qilingan': 'status-cancelled',
};

const AdminOrdersPage: NextPage = () => {
	return (
		<div className="admin-page">
			<h1 className="admin-page-title">Buyurtmalar</h1>
			<div className="admin-table-wrap">
				<div className="admin-table-header">
					<h2>Buyurtmalar ro&apos;yxati</h2>
				</div>
				<table>
					<thead>
						<tr>
							<th>№</th>
							<th>Buyurtma №</th>
							<th>Mijoz</th>
							<th>Jami</th>
							<th>Holat</th>
							<th>Sana</th>
							<th>Amallar</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((order, index) => (
							<tr key={order.orderNumber}>
								<td>{index + 1}</td>
								<td>{order.orderNumber}</td>
								<td>{order.customer}</td>
								<td>{order.total.toLocaleString()} ₩</td>
								<td>
									<span className={`status-badge ${statusClassMap[order.status]}`}>{order.status}</span>
								</td>
								<td>{order.date}</td>
								<td>
									<button type="button" className="action-btn edit-btn">
										✏️
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default withLayoutAdmin(AdminOrdersPage);
