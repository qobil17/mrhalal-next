import type { NextPage } from 'next';
import { withLayoutAdmin } from '../../../libs/components/layout/LayoutAdmin';

interface AdminMemberRow {
	name: string;
	phone: string;
	role: string;
	status: string;
	joinedAt: string;
}

const members: AdminMemberRow[] = [
	{ name: 'Qobilbek Ibrohimov', phone: '01012345678', role: 'Admin', status: 'Faol', joinedAt: '2026-01-12' },
	{ name: 'Aziz Karimov', phone: '01023456789', role: 'Mijoz', status: 'Faol', joinedAt: '2026-02-03' },
	{ name: 'Dilnoza Yusupova', phone: '01034567890', role: 'Mijoz', status: 'Faol', joinedAt: '2026-02-21' },
	{ name: 'Bekzod Tursunov', phone: '01045678901', role: 'Mijoz', status: 'Bloklangan', joinedAt: '2026-03-15' },
	{ name: 'Madina Aliyeva', phone: '01056789012', role: 'Mijoz', status: 'Faol', joinedAt: '2026-04-02' },
];

const AdminMembersPage: NextPage = () => {
	return (
		<div className="admin-page">
			<h1 className="admin-page-title">Foydalanuvchilar</h1>
			<div className="admin-table-wrap">
				<div className="admin-table-header">
					<h2>Foydalanuvchilar ro&apos;yxati</h2>
				</div>
				<table>
					<thead>
						<tr>
							<th>№</th>
							<th>Ism</th>
							<th>Telefon</th>
							<th>Rol</th>
							<th>Holat</th>
							<th>Ro&apos;yxatdan o&apos;tgan</th>
						</tr>
					</thead>
					<tbody>
						{members.map((member, index) => (
							<tr key={member.phone}>
								<td>{index + 1}</td>
								<td>{member.name}</td>
								<td>{member.phone}</td>
								<td>{member.role}</td>
								<td>{member.status}</td>
								<td>{member.joinedAt}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default withLayoutAdmin(AdminMembersPage);
