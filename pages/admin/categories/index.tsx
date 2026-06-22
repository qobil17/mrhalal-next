import { useState } from 'react';
import type { FormEvent } from 'react';
import type { NextPage } from 'next';
import { useMutation, useQuery } from '@apollo/client';
import { withLayoutAdmin } from '../../../libs/components/layout/LayoutAdmin';
import { GET_ALL_CATEGORIES_BY_ADMIN } from '../../../apollo/admin/query';
import {
	CREATE_CATEGORY_BY_ADMIN,
	DELETE_CATEGORY_BY_ADMIN,
	UPDATE_CATEGORY_BY_ADMIN,
} from '../../../apollo/admin/mutation';
import type { Category } from '../../../libs/types/category/category';

interface CategoriesResponse {
	list: Category[];
	total: number;
}

interface CategoryFormState {
	nameUz: string;
	nameKo: string;
	nameEn: string;
	nameAr: string;
	sortOrder: string;
	isActive: boolean;
}

const EMPTY_FORM: CategoryFormState = { nameUz: '', nameKo: '', nameEn: '', nameAr: '', sortOrder: '0', isActive: true };

const AdminCategoriesPage: NextPage = () => {
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form, setForm] = useState<CategoryFormState>(EMPTY_FORM);

	const { data, loading, refetch } = useQuery<{ getAllCategoriesByAdmin: CategoriesResponse }>(
		GET_ALL_CATEGORIES_BY_ADMIN,
		{ variables: { input: { page: 1, limit: 100 } } },
	);

	const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY_BY_ADMIN);
	const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY_BY_ADMIN);
	const [deleteCategory] = useMutation(DELETE_CATEGORY_BY_ADMIN);

	const categories = data?.getAllCategoriesByAdmin?.list ?? [];

	const resetForm = () => {
		setForm(EMPTY_FORM);
		setShowForm(false);
		setEditingId(null);
	};

	const startEdit = (category: Category) => {
		setEditingId(category.id);
		setShowForm(true);
		setForm({
			nameUz: category.nameUz,
			nameKo: category.nameKo,
			nameEn: category.nameEn,
			nameAr: category.nameAr ?? '',
			sortOrder: String(category.sortOrder),
			isActive: category.isActive,
		});
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		const input = {
			nameUz: form.nameUz,
			nameKo: form.nameKo,
			nameEn: form.nameEn,
			nameAr: form.nameAr,
			sortOrder: Number(form.sortOrder) || 0,
			isActive: form.isActive,
		};

		if (editingId) {
			await updateCategory({ variables: { input: { id: Number(editingId), ...input } } });
		} else {
			await createCategory({ variables: { input } });
		}

		resetForm();
		await refetch();
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm("Kategoriyani o'chirishni tasdiqlaysizmi?")) return;
		await deleteCategory({ variables: { id: Number(id) } });
		await refetch();
	};

	return (
		<div className="admin-page">
			<h1 className="admin-page-title">Kategoriyalar</h1>
			<div className="admin-table-wrap">
				<div className="admin-table-header">
					<h2>Kategoriyalar ro&apos;yxati</h2>
					<button type="button" className="add-btn" onClick={() => (showForm ? resetForm() : setShowForm(true))}>
						{showForm ? 'Bekor qilish' : 'Yangi kategoriya'}
					</button>
				</div>

				{showForm && (
					<form className="admin-inline-form" onSubmit={handleSubmit}>
						<input
							placeholder="Nomi (UZ)"
							value={form.nameUz}
							onChange={(e) => setForm({ ...form, nameUz: e.target.value })}
							required
						/>
						<input
							placeholder="Nomi (KO)"
							value={form.nameKo}
							onChange={(e) => setForm({ ...form, nameKo: e.target.value })}
							required
						/>
						<input
							placeholder="Nomi (EN)"
							value={form.nameEn}
							onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
							required
						/>
						<input
							placeholder="Nomi (AR)"
							value={form.nameAr}
							onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
							required
						/>
						<input
							type="number"
							placeholder="Tartib"
							value={form.sortOrder}
							onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
						/>
						<label className="admin-checkbox-label">
							<input
								type="checkbox"
								checked={form.isActive}
								onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
							/>
							Faol
						</label>
						<button type="submit" className="add-btn" disabled={creating || updating}>
							{editingId ? 'Saqlash' : "Qo'shish"}
						</button>
					</form>
				)}

				{loading ? (
					<p className="loading-text">Yuklanmoqda...</p>
				) : (
					<table>
						<thead>
							<tr>
								<th>№</th>
								<th>Nomi</th>
								<th>Slug</th>
								<th>Holat</th>
								<th>Amallar</th>
							</tr>
						</thead>
						<tbody>
							{categories.map((category, index) => (
								<tr key={category.id}>
									<td>{index + 1}</td>
									<td>{category.nameUz}</td>
									<td>{category.slug}</td>
									<td>{category.isActive ? 'Faol' : 'Faol emas'}</td>
									<td>
										<button type="button" className="action-btn edit-btn" onClick={() => startEdit(category)}>
											✏️
										</button>
										<button type="button" className="action-btn delete-btn" onClick={() => handleDelete(category.id)}>
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

export default withLayoutAdmin(AdminCategoriesPage);
