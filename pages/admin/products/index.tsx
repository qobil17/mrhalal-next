import { useState } from 'react';
import type { FormEvent } from 'react';
import type { NextPage } from 'next';
import { useMutation, useQuery } from '@apollo/client';
import { withLayoutAdmin } from '../../../libs/components/layout/LayoutAdmin';
import { GET_ALL_PRODUCTS_BY_ADMIN } from '../../../apollo/admin/query';
import { GET_ALL_CATEGORIES } from '../../../apollo/user/query';
import {
	CREATE_PRODUCT_BY_ADMIN,
	DELETE_PRODUCT_BY_ADMIN,
	UPDATE_PRODUCT_BY_ADMIN,
} from '../../../apollo/admin/mutation';
import type { Product, ProductsResponse } from '../../../libs/types/product/product';
import type { Category } from '../../../libs/types/category/category';

interface ProductFormState {
	nameUz: string;
	nameKo: string;
	nameEn: string;
	nameAr: string;
	categoryId: string;
	price: string;
	stockQuantity: string;
	unit: string;
	isActive: boolean;
}

const EMPTY_FORM: ProductFormState = {
	nameUz: '',
	nameKo: '',
	nameEn: '',
	nameAr: '',
	categoryId: '',
	price: '0',
	stockQuantity: '0',
	unit: 'KG',
	isActive: true,
};

const UNITS = ['G', 'KG', 'L', 'ML', 'PIECE'];

const AdminProductsPage: NextPage = () => {
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);

	const { data, loading, refetch } = useQuery<{ getAllProductsByAdmin: ProductsResponse }>(
		GET_ALL_PRODUCTS_BY_ADMIN,
		{ variables: { input: { page: 1, limit: 100 } } },
	);
	const { data: categoriesData } = useQuery<{ getAllCategories: Category[] }>(GET_ALL_CATEGORIES);

	const [createProduct, { loading: creating }] = useMutation(CREATE_PRODUCT_BY_ADMIN);
	const [updateProduct, { loading: updating }] = useMutation(UPDATE_PRODUCT_BY_ADMIN);
	const [deleteProduct] = useMutation(DELETE_PRODUCT_BY_ADMIN);

	const products = data?.getAllProductsByAdmin?.list ?? [];
	const categories = categoriesData?.getAllCategories ?? [];

	const resetForm = () => {
		setForm(EMPTY_FORM);
		setShowForm(false);
		setEditingId(null);
	};

	const startEdit = (product: Product) => {
		setEditingId(product.id);
		setShowForm(true);
		setForm({
			nameUz: product.nameUz,
			nameKo: product.nameKo,
			nameEn: product.nameEn,
			nameAr: product.nameAr,
			categoryId: String(product.categoryId),
			price: String(product.price),
			stockQuantity: String(product.stockQuantity),
			unit: product.unit,
			isActive: product.isActive,
		});
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		const input = {
			nameUz: form.nameUz,
			nameKo: form.nameKo,
			nameEn: form.nameEn,
			nameAr: form.nameAr,
			categoryId: Number(form.categoryId),
			price: Number(form.price) || 0,
			stockQuantity: Number(form.stockQuantity) || 0,
			unit: form.unit,
			isActive: form.isActive,
		};

		if (editingId) {
			await updateProduct({ variables: { input: { id: Number(editingId), ...input } } });
		} else {
			await createProduct({ variables: { input } });
		}

		resetForm();
		await refetch();
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm("Mahsulotni o'chirishni tasdiqlaysizmi?")) return;
		await deleteProduct({ variables: { id: Number(id) } });
		await refetch();
	};

	return (
		<div className="admin-page">
			<h1 className="admin-page-title">Mahsulotlar</h1>
			<div className="admin-table-wrap">
				<div className="admin-table-header">
					<h2>Mahsulotlar ro&apos;yxati</h2>
					<button type="button" className="add-btn" onClick={() => (showForm ? resetForm() : setShowForm(true))}>
						{showForm ? 'Bekor qilish' : 'Yangi mahsulot'}
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
						<select
							value={form.categoryId}
							onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
							className="admin-status-select"
							required
						>
							<option value="">Kategoriya tanlang</option>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.nameUz}
								</option>
							))}
						</select>
						<input
							type="number"
							placeholder="Narx"
							value={form.price}
							onChange={(e) => setForm({ ...form, price: e.target.value })}
						/>
						<input
							type="number"
							placeholder="Ombor miqdori"
							value={form.stockQuantity}
							onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
						/>
						<select
							value={form.unit}
							onChange={(e) => setForm({ ...form, unit: e.target.value })}
							className="admin-status-select"
						>
							{UNITS.map((unit) => (
								<option key={unit} value={unit}>
									{unit}
								</option>
							))}
						</select>
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
								<th>Birlik</th>
								<th>Narx</th>
								<th>Ombor</th>
								<th>Holat</th>
								<th>Amallar</th>
							</tr>
						</thead>
						<tbody>
							{products.map((product, index) => (
								<tr key={product.id}>
									<td>{index + 1}</td>
									<td>{product.nameUz}</td>
									<td>{product.unit}</td>
									<td>{product.price.toLocaleString()} ₩</td>
									<td>{product.stockQuantity}</td>
									<td>{product.isActive ? 'Faol' : 'Tugagan'}</td>
									<td>
										<button type="button" className="action-btn edit-btn" onClick={() => startEdit(product)}>
											✏️
										</button>
										<button type="button" className="action-btn delete-btn" onClick={() => handleDelete(product.id)}>
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

export default withLayoutAdmin(AdminProductsPage);
