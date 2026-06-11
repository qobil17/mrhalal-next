import type { NextPage } from 'next';
import { withLayoutAdmin } from '../../../libs/components/layout/LayoutAdmin';

interface AdminProductRow {
	name: string;
	unit: string;
	price: number;
	status: string;
}

const products: AdminProductRow[] = [
	{ name: "Mol go'shti (Antrekot)", unit: 'KG', price: 45000, status: 'Faol' },
	{ name: "Qo'y go'shti (Koreyka)", unit: 'KG', price: 58000, status: 'Faol' },
	{ name: "Tovuq go'shti (Butun)", unit: 'KG', price: 22000, status: 'Faol' },
	{ name: 'Guruch (Premium)', unit: 'KG', price: 32000, status: 'Faol' },
	{ name: "O'simlik yog'i", unit: 'KG', price: 24000, status: 'Tugagan' },
];

const AdminProductsPage: NextPage = () => {
	return (
		<div className="admin-page">
			<h1 className="admin-page-title">Mahsulotlar</h1>
			<div className="admin-table-wrap">
				<div className="admin-table-header">
					<h2>Mahsulotlar ro&apos;yxati</h2>
					<button type="button" className="add-btn">
						Yangi mahsulot
					</button>
				</div>
				<table>
					<thead>
						<tr>
							<th>№</th>
							<th>Nomi</th>
							<th>Birlik</th>
							<th>Narx</th>
							<th>Holat</th>
							<th>Amallar</th>
						</tr>
					</thead>
					<tbody>
						{products.map((product, index) => (
							<tr key={product.name}>
								<td>{index + 1}</td>
								<td>{product.name}</td>
								<td>{product.unit}</td>
								<td>{product.price.toLocaleString()} ₩</td>
								<td>{product.status}</td>
								<td>
									<button type="button" className="action-btn edit-btn">
										✏️
									</button>
									<button type="button" className="action-btn delete-btn">
										🗑️
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

export default withLayoutAdmin(AdminProductsPage);
