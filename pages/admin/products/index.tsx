import { useState } from 'react';
import type { FormEvent } from 'react';
import type { NextPage } from 'next';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import Swal from 'sweetalert2';
import { getJwtToken } from '../../../libs/auth';
import { withLayoutAdmin } from '../../../libs/components/layout/LayoutAdmin';
import { langVar, t } from '../../../libs/i18n';
import { GET_ALL_PRODUCTS_BY_ADMIN } from '../../../apollo/admin/query';
import { GET_ALL_CATEGORIES } from '../../../apollo/user/query';
import {
	CREATE_PRODUCT_BY_ADMIN,
	DELETE_PRODUCT_BY_ADMIN,
	UPDATE_PRODUCT_BY_ADMIN,
} from '../../../apollo/admin/mutation';
import type { Product, ProductsResponse } from '../../../libs/types/product/product';
import type { Category } from '../../../libs/types/category/category';

interface ImageRow {
	url: string;
	isPrimary: boolean;
}

interface ProductFormState {
	nameUz: string;
	nameKo: string;
	nameEn: string;
	nameAr: string;
	categoryId: string;
	price: string;
	comparePrice: string;
	stockQuantity: string;
	unit: string;
	isActive: boolean;
	expiryDate: string;
}

const EMPTY_FORM: ProductFormState = {
	nameUz: '',
	nameKo: '',
	nameEn: '',
	nameAr: '',
	categoryId: '',
	price: '',
	comparePrice: '',
	stockQuantity: '0',
	unit: 'KG',
	isActive: true,
	expiryDate: '',
};

const EMPTY_IMAGES: ImageRow[] = [{ url: '', isPrimary: true }];

const UNITS = ['G', 'KG', 'L', 'ML', 'PIECE'];

const LABEL_OPTIONS = ['', 'RECOMMENDED', 'DISCOUNT'] as const;

const isFormDirty = (form: ProductFormState, images: ImageRow[]) =>
	form.nameUz !== '' ||
	form.nameKo !== '' ||
	form.nameEn !== '' ||
	form.nameAr !== '' ||
	form.categoryId !== '' ||
	form.price !== '' ||
	images.some((img) => img.url !== '');

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const AdminProductsPage: NextPage = () => {
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
	const [images, setImages] = useState<ImageRow[]>(EMPTY_IMAGES);
	const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
	const lang = useReactiveVar(langVar);

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
	const saving = creating || updating;

	const resetForm = () => {
		setForm(EMPTY_FORM);
		setImages(EMPTY_IMAGES);
		setShowForm(false);
		setEditingId(null);
	};

	const handleCancel = async () => {
		if (isFormDirty(form, images)) {
			const result = await Swal.fire({
				icon: 'question',
				title: 'Bekor qilish',
				text: "Rostdan bekor qilasizmi? Kiritilgan ma'lumotlar o'chadi",
				showCancelButton: true,
				confirmButtonText: 'Ha, bekor qilish',
				cancelButtonText: "Yo'q",
				confirmButtonColor: '#6b7280',
				cancelButtonColor: '#ef4444',
			});
			if (!result.isConfirmed) return;
		}
		resetForm();
	};

	const startEdit = (product: Product) => {
		setEditingId(product.id);
		setShowForm(true);
		setForm({
			nameUz: product.nameUz ?? '',
			nameKo: product.nameKo ?? '',
			nameEn: product.nameEn ?? '',
			nameAr: product.nameAr ?? '',
			categoryId: product.categoryId != null ? String(product.categoryId) : '',
			price: product.price != null ? String(product.price) : '',
			comparePrice: product.comparePrice != null ? String(product.comparePrice) : '',
			stockQuantity: product.stockQuantity != null ? String(product.stockQuantity) : '0',
			unit: product.unit ?? 'KG',
			isActive: product.isActive ?? true,
			expiryDate: product.expiryDate ? product.expiryDate.slice(0, 10) : '',
		});
		const existingImages: ImageRow[] =
			product.images?.length > 0
				? product.images.map((img) => ({ url: img.url ?? '', isPrimary: img.isPrimary ?? false }))
				: EMPTY_IMAGES;
		setImages(existingImages);
	};

	const handleImageUrlChange = (index: number, url: string) => {
		setImages((prev) => prev.map((img, i) => (i === index ? { ...img, url } : img)));
	};

	const handleSetPrimary = (index: number) => {
		setImages((prev) => prev.map((img, i) => ({ ...img, isPrimary: i === index })));
	};

	const handleAddImage = () => {
		setImages((prev) => [...prev, { url: '', isPrimary: false }]);
	};

	const handleRemoveImage = (index: number) => {
		setImages((prev) => {
			const next = prev.filter((_, i) => i !== index);
			if (prev[index].isPrimary && next.length > 0) {
				next[0] = { ...next[0], isPrimary: true };
			}
			return next.length > 0 ? next : EMPTY_IMAGES;
		});
	};

	const handleFileSelect = async (index: number, file: File) => {
		setUploadingIndex(index);
		try {
			const token = getJwtToken();
			const formData = new FormData();
			formData.append('file', file);

			const res = await fetch(`${API_BASE}/upload/image`, {
				method: 'POST',
				headers: token ? { Authorization: `Bearer ${token}` } : {},
				body: formData,
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({})) as { message?: string };
				throw new Error(data.message ?? `Server xatosi: ${res.status}`);
			}

			const { url } = (await res.json()) as { url: string; publicId: string };
			handleImageUrlChange(index, url);
		} catch (err: unknown) {
			Swal.fire({
				icon: 'error',
				title: 'Yuklanmadi',
				text: err instanceof Error ? err.message : 'Rasm yuklanmadi',
			});
		} finally {
			setUploadingIndex(null);
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		// UpdateProductInput qabul qiladigan maydonlar (images yo'q)
		const baseFields = {
			nameUz: form.nameUz,
			nameKo: form.nameKo,
			nameEn: form.nameEn,
			nameAr: form.nameAr,
			categoryId: Number(form.categoryId),
			price: parseFloat(form.price) || 0,
			stockQuantity: parseInt(form.stockQuantity) || 0,
			unit: form.unit,
			isActive: form.isActive,
			...(form.comparePrice ? { comparePrice: parseFloat(form.comparePrice) } : {}),
			...(form.expiryDate ? { expiryDate: new Date(form.expiryDate).toISOString() } : {}),
		};

		const validImages = images
			.filter((img) => img.url.trim() !== '')
			.map((img, i) => ({ url: img.url.trim(), isPrimary: img.isPrimary, sortOrder: i }));

		try {
			if (editingId) {
				// images har doim yuboriladi: bo'sh [] = barcha rasmlarni o'chir
				await updateProduct({
					variables: { input: { id: Number(editingId), ...baseFields, images: validImages } },
				});
			} else {
				const createInput: Record<string, unknown> = { ...baseFields };
				if (validImages.length > 0) createInput.images = validImages;
				await createProduct({ variables: { input: createInput } });
			}
			resetForm();
			await refetch();
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Xatolik yuz berdi';
			Swal.fire({ icon: 'error', title: 'Xatolik', text: message });
		}
	};

	const handleLabelChange = async (id: string, label: string) => {
		try {
			await updateProduct({
				variables: { input: { id: Number(id), label: label === '' ? null : label } },
			});
			await refetch();
			await Swal.fire({
				icon: 'success',
				title: t('adminLabelUpdateSuccess', lang),
				timer: 1200,
				showConfirmButton: false,
			});
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Xatolik yuz berdi';
			Swal.fire({ icon: 'error', title: 'Xatolik', text: message });
		}
	};

	const handleDelete = async (id: string) => {
		const result = await Swal.fire({
			icon: 'warning',
			title: "O'chirishni tasdiqlang",
			text: "Mahsulotni o'chirishni tasdiqlaysizmi?",
			showCancelButton: true,
			confirmButtonText: "Ha, o'chir",
			cancelButtonText: "Yo'q",
			confirmButtonColor: '#ef4444',
			cancelButtonColor: '#6b7280',
		});
		if (!result.isConfirmed) return;
		await deleteProduct({ variables: { id: Number(id) } });
		await refetch();
	};

	return (
		<div className="admin-page">
			<h1 className="admin-page-title">Mahsulotlar</h1>
			<div className="admin-table-wrap">
				<div className="admin-table-header">
					<h2>Mahsulotlar ro&apos;yxati</h2>
					{!showForm && (
						<button type="button" className="add-btn" onClick={() => setShowForm(true)}>
							Yangi mahsulot
						</button>
					)}
				</div>

				{showForm && (
					<form className="admin-product-form" onSubmit={handleSubmit}>

						{/* ── Nomlar ── */}
						<fieldset className="form-section">
							<legend className="form-section-title">Nomlar</legend>
							<div className="form-row">
								<div className="form-group">
									<label htmlFor="nameUz">Nomi (O&apos;zbekcha) *</label>
									<input
										id="nameUz"
										placeholder="Masalan: Qo'y go'shti"
										value={form.nameUz ?? ''}
										onChange={(e) => setForm({ ...form, nameUz: e.target.value })}
										required
									/>
								</div>
								<div className="form-group">
									<label htmlFor="nameKo">Nomi (Koreyscha) *</label>
									<input
										id="nameKo"
										placeholder="예: 양고기"
										value={form.nameKo ?? ''}
										onChange={(e) => setForm({ ...form, nameKo: e.target.value })}
										required
									/>
								</div>
								<div className="form-group">
									<label htmlFor="nameEn">Nomi (Inglizcha) *</label>
									<input
										id="nameEn"
										placeholder="E.g.: Lamb meat"
										value={form.nameEn ?? ''}
										onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
										required
									/>
								</div>
								<div className="form-group">
									<label htmlFor="nameAr">Nomi (Arabcha) *</label>
									<input
										id="nameAr"
										placeholder="مثال: لحم الضأن"
										value={form.nameAr ?? ''}
										onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
										required
										dir="rtl"
									/>
								</div>
							</div>
						</fieldset>

						{/* ── Narx va ombor ── */}
						<fieldset className="form-section">
							<legend className="form-section-title">Narx va ombor</legend>
							<div className="form-row">
								<div className="form-group">
									<label htmlFor="categoryId">Kategoriya *</label>
									<select
										id="categoryId"
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
								</div>
								<div className="form-group">
									<label htmlFor="price">Narx (KRW) *</label>
									<input
										id="price"
										type="number"
										placeholder="0"
										min="0"
										step="0.01"
										value={form.price ?? ''}
										onChange={(e) => setForm({ ...form, price: e.target.value })}
										required
									/>
								</div>
								<div className="form-group">
									<label htmlFor="comparePrice">Asl narx / Chegirmadan oldin (KRW)</label>
									<input
										id="comparePrice"
										type="number"
										placeholder="Ixtiyoriy"
										min="0"
										step="0.01"
										value={form.comparePrice ?? ''}
										onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
									/>
								</div>
								<div className="form-group">
									<label htmlFor="stockQuantity">Ombordagi soni</label>
									<input
										id="stockQuantity"
										type="number"
										placeholder="0"
										min="0"
										value={form.stockQuantity ?? '0'}
										onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
									/>
								</div>
								<div className="form-group">
									<label htmlFor="unit">O&apos;lchov birligi</label>
									<select
										id="unit"
										value={form.unit}
										onChange={(e) => setForm({ ...form, unit: e.target.value })}
										className="admin-status-select"
									>
										{UNITS.map((u) => (
											<option key={u} value={u}>{u}</option>
										))}
									</select>
								</div>
								<div className="form-group">
									<label htmlFor="expiryDate">{t('adminExpiryDateLabel', lang)}</label>
									<input
										id="expiryDate"
										type="date"
										value={form.expiryDate}
										onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
									/>
								</div>
							</div>
							<div className="form-row form-row--checkboxes">
								<label className="admin-checkbox-label">
									<input
										type="checkbox"
										checked={form.isActive ?? false}
										onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
									/>
									Faol (sotuvda ko&apos;rinsin)
								</label>
							</div>
						</fieldset>

						{/* ── Rasmlar ── */}
						<fieldset className="form-section">
							<legend className="form-section-title">Rasmlar</legend>
							<p className="form-hint">
								Rasm URL manzillarini kiriting. &quot;Asosiy&quot; belgilangan rasm mahsulot kartasida ko&apos;rinadi.
							</p>
							{images.map((img, index) => (
								<div key={index} className="image-row">
									<div className="image-preview-box">
										{img.url ? (
											// eslint-disable-next-line @next/next/no-img-element
											<img
												src={img.url}
												alt={`Rasm ${index + 1}`}
												className="image-preview-thumb"
												onError={(e) => {
													(e.currentTarget as HTMLImageElement).style.display = 'none';
												}}
											/>
										) : (
											<span className="image-preview-empty">Oldindan ko&apos;rish</span>
										)}
									</div>

									<div className="image-upload-group">
										<input
											type="file"
											id={`file-input-${index}`}
											accept="image/jpeg,image/png,image/webp"
											style={{ display: 'none' }}
											onChange={(e) => {
												const file = e.target.files?.[0];
												if (file) void handleFileSelect(index, file);
												e.target.value = '';
											}}
										/>
										<button
											type="button"
											className="image-upload-btn"
											onClick={() =>
												(document.getElementById(`file-input-${index}`) as HTMLInputElement | null)?.click()
											}
											disabled={uploadingIndex !== null}
										>
											{uploadingIndex === index ? 'Yuklanmoqda...' : 'Fayl tanlash'}
										</button>
										<input
											type="url"
											placeholder="yoki URL manzilini kiriting..."
											value={img.url}
											onChange={(e) => handleImageUrlChange(index, e.target.value)}
											className="image-url-input"
										/>
									</div>

									<label className="admin-checkbox-label image-primary-label">
										<input
											type="radio"
											name="primaryImage"
											checked={img.isPrimary}
											onChange={() => handleSetPrimary(index)}
										/>
										Asosiy
									</label>
									{images.length > 1 && (
										<button
											type="button"
											className="image-remove-btn"
											onClick={() => handleRemoveImage(index)}
											title="Rasmni o'chir"
										>
											✕
										</button>
									)}
								</div>
							))}
							{images.length < 10 && (
								<button type="button" className="image-add-btn" onClick={handleAddImage}>
									+ Rasm qo&apos;shish
								</button>
							)}
						</fieldset>

						{/* ── Tugmalar ── */}
						<div className="form-actions">
							<button
								type="button"
								className="form-cancel-btn"
								onClick={handleCancel}
								disabled={saving}
							>
								Bekor qilish
							</button>
							<button type="submit" className="form-submit-btn" disabled={saving}>
								{saving ? 'Saqlanmoqda...' : editingId ? 'Saqlash' : "Qo'shish"}
							</button>
						</div>
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
								<th>{t('adminLabelColumn', lang)}</th>
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
									<td>{product.isActive ? 'Faol' : 'Nofaol'}</td>
									<td>
										<select
											value={product.label ?? ''}
											onChange={(e) => handleLabelChange(product.id, e.target.value)}
											className="admin-status-select"
										>
											{LABEL_OPTIONS.map((option) => (
												<option key={option} value={option}>
													{option === 'RECOMMENDED'
														? t('adminLabelRecommended', lang)
														: option === 'DISCOUNT'
															? t('adminLabelDiscount', lang)
															: t('adminLabelNone', lang)}
												</option>
											))}
										</select>
									</td>
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
