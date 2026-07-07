import type { NextPage } from 'next';
import { useMutation, useQuery } from '@apollo/client';
import Swal from 'sweetalert2';
import { withLayoutAdmin } from '../../../libs/components/layout/LayoutAdmin';
import { GET_ALL_MEMBERS_BY_ADMIN } from '../../../apollo/admin/query';
import { DELETE_MEMBER_BY_ADMIN, UPDATE_MEMBER_BY_ADMIN } from '../../../apollo/admin/mutation';
import { userVar } from '../../../apollo/client';
import type { Member } from '../../../libs/types/member/member';

interface MembersResponse {
	list: (Member & { createdAt: string })[];
	total: number;
}

const ROLES = ['CUSTOMER', 'ADMIN'];

const AdminMembersPage: NextPage = () => {
	const { data, loading, refetch } = useQuery<{ getAllMembersByAdmin: MembersResponse }>(GET_ALL_MEMBERS_BY_ADMIN, {
		variables: { input: { page: 1, limit: 100 } },
	});

	const [updateMember] = useMutation(UPDATE_MEMBER_BY_ADMIN);
	const [deleteMember] = useMutation(DELETE_MEMBER_BY_ADMIN);

	const members = data?.getAllMembersByAdmin?.list ?? [];

	const handleRoleChange = async (id: string, newRole: string, currentRole: string) => {
		const currentUser = userVar();

		// Himoya 1: Admin o'z rolini o'zgartira olmaydi
		if (String(currentUser?.sub) === id) {
			Swal.fire({ icon: 'warning', title: 'Ruxsat yo\'q', text: 'O\'z akkauntingizning rolini o\'zgartira olmaysiz' });
			return;
		}

		// Himoya 2: Oxirgi adminni CUSTOMER'ga tushirib bo'lmaydi
		if (currentRole === 'ADMIN' && newRole === 'CUSTOMER') {
			const adminCount = members.filter((m) => m.role === 'ADMIN').length;
			if (adminCount <= 1) {
				Swal.fire({ icon: 'warning', title: 'Ruxsat yo\'q', text: 'Kamida bitta admin qolishi kerak' });
				return;
			}
		}

		try {
			await updateMember({ variables: { input: { id: Number(id), role: newRole } } });
			await refetch();
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Xatolik yuz berdi';
			Swal.fire({ icon: 'error', title: 'Xatolik', text: message });
		}
	};

	const handleToggleActive = async (id: string, isActive: boolean) => {
		await updateMember({ variables: { input: { id: Number(id), isActive: !isActive } } });
		await refetch();
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm("Foydalanuvchini o'chirishni tasdiqlaysizmi?")) return;
		await deleteMember({ variables: { id: Number(id) } });
		await refetch();
	};

	return (
		<div className="admin-page">
			<h1 className="admin-page-title">Foydalanuvchilar</h1>
			<div className="admin-table-wrap">
				<div className="admin-table-header">
					<h2>Foydalanuvchilar ro&apos;yxati</h2>
				</div>

				{loading ? (
					<p className="loading-text">Yuklanmoqda...</p>
				) : (
					<table>
						<thead>
							<tr>
								<th>№</th>
								<th>Ism</th>
								<th>Telefon</th>
								<th>Rol</th>
								<th>Holat</th>
								<th>Ro&apos;yxatdan o&apos;tgan</th>
								<th>Amallar</th>
							</tr>
						</thead>
						<tbody>
							{members.map((member, index) => (
								<tr key={member.id}>
									<td>{index + 1}</td>
									<td>
										{member.firstName} {member.lastName}
									</td>
									<td>{member.phone}</td>
									<td>
										<select
											className="admin-status-select"
											value={member.role}
											onChange={(e) => handleRoleChange(member.id, e.target.value, member.role)}
										>
											{ROLES.map((role) => (
												<option key={role} value={role}>
													{role}
												</option>
											))}
										</select>
									</td>
									<td>
										<button
											type="button"
											className={`status-badge ${member.isActive ? 'status-completed' : 'status-cancelled'}`}
											onClick={() => handleToggleActive(member.id, member.isActive)}
											style={{ border: 'none', cursor: 'pointer' }}
										>
											{member.isActive ? 'Faol' : 'Bloklangan'}
										</button>
									</td>
									<td>{new Date(member.createdAt).toLocaleDateString()}</td>
									<td>
										<button type="button" className="action-btn delete-btn" onClick={() => handleDelete(member.id)}>
											🗑️
										</button>
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

export default withLayoutAdmin(AdminMembersPage);
