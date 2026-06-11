import type { NextPage } from 'next';
import { withLayoutAdmin } from '../../../libs/components/layout/LayoutAdmin';

interface AdminCategoryRow {
	name: string;
	slug: string;
}

const categories: AdminCategoryRow[] = [
	{ name: "Mol go'shti", slug: 'beef' },
	{ name: "Qo'y go'shti", slug: 'lamb' },
	{ name: 'Tovuq', slug: 'chicken' },
	{ name: 'Baliq', slug: 'fish' },
	{ name: 'Oziq-ovqat', slug: 'grocery' },
	{ name: 'Ziravorlar', slug: 'spices' },
];

const AdminCategoriesPage: NextPage = () => {
	return (
		<div className="admin-page">
			<h1 className="admin-page-title">Kategoriyalar</h1>
			<div className="admin-table-wrap">
				<div className="admin-table-header">
					<h2>Kategoriyalar ro&apos;yxati</h2>
					<button type="button" className="add-btn">
						Yangi kategoriya
					</button>
				</div>
				<table>
					<thead>
						<tr>
							<th>№</th>
							<th>Nomi</th>
							<th>Slug</th>
							<th>Amallar</th>
						</tr>
					</thead>
					<tbody>
						{categories.map((category, index) => (
							<tr key={category.slug}>
								<td>{index + 1}</td>
								<td>{category.name}</td>
								<td>{category.slug}</td>
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

export default withLayoutAdmin(AdminCategoriesPage);
