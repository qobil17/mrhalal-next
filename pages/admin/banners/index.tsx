import { useState } from 'react';
import type { FormEvent } from 'react';
import type { NextPage } from 'next';
import { useMutation, useQuery } from '@apollo/client';
import Swal from 'sweetalert2';
import { getJwtToken } from '../../../libs/auth';
import { withLayoutAdmin } from '../../../libs/components/layout/LayoutAdmin';
import { GET_ALL_BANNERS_BY_ADMIN } from '../../../apollo/admin/query';
import {
	CREATE_BANNER_BY_ADMIN,
	DELETE_BANNER_BY_ADMIN,
	UPDATE_BANNER_BY_ADMIN,
} from '../../../apollo/admin/mutation';
import type { Banner, BannersResponse } from '../../../libs/types/banner/banner';

interface BannerFormState {
	title: string;
	imageUrl: string;
	sortOrder: string;
	isActive: boolean;
}

const EMPTY_FORM: BannerFormState = {
	title: '',
	imageUrl: '',
	sortOrder: '0',
	isActive: true,
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const AdminBannersPage: NextPage = () => {
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form, setForm] = useState<BannerFormState>(EMPTY_FORM);
	const [uploading, setUploading] = useState(false);

	const { data, loading, refetch } = useQuery<{ getAllBannersByAdmin: BannersResponse }>(
		GET_ALL_BANNERS_BY_ADMIN,
		{ variables: { input: { page: 1, limit: 100 } } },
	);

	const [createBanner, { loading: creating }] = useMutation(CREATE_BANNER_BY_ADMIN);
	const [updateBanner, { loading: updating }] = useMutation(UPDATE_BANNER_BY_ADMIN);
	const [deleteBanner] = useMutation(DELETE_BANNER_BY_ADMIN);

	const banners = data?.getAllBannersByAdmin?.list ?? [];
	const saving = creating || updating;

	const resetForm = () => {
		setForm(EMPTY_FORM);
		setShowForm(false);
		setEditingId(null);
	};

	const startEdit = (banner: Banner) => {
		setEditingId(banner.id);
		setShowForm(true);
		setForm({
			title: banner.title,
			imageUrl: banner.imageUrl,
			sortOrder: String(banner.sortOrder),
			isActive: banner.isActive,
		});
	};

	const handleFileSelect = async (file: File) => {
		setUploading(true);
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
			setForm((prev) => ({ ...prev, imageUrl: url }));
		} catch (err: unknown) {
			Swal.fire({
				icon: 'error',
				title: 'Yuklanmadi',
				text: err instanceof Error ? err.message : 'Rasm yuklanmadi',
			});
		} finally {
			setUploading(false);
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		const input = {
			title: form.title,
			imageUrl: form.imageUrl,
			sortOrder: Number(form.sortOrder) || 0,
			isActive: form.isActive,
		};

		try {
			if (editingId) {
				await updateBanner({ variables: { input: { id: Number(editingId), ...input } } });
			} else {
				await createBanner({ variables: { input } });
			}
			resetForm();
			await refetch();
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Xatolik yuz berdi';
			Swal.fire({ icon: 'error', title: 'Xatolik', text: message });
		}
	};

	const handleDelete = async (id: string) => {
		const result = await Swal.fire({
			icon: 'warning',
			title: "O'chirishni tasdiqlang",
			text: "Banner butunlay o'chiriladi. Bu amalni orqaga qaytarib bo'lmaydi.",
			showCancelButton: true,
			confirmButtonText: "Ha, o'chir",
			cancelButtonText: "Yo'q",
			confirmButtonColor: '#ef4444',
			cancelButtonColor: '#6b7280',
		});
		if (!result.isConfirmed) return;
		await deleteBanner({ variables: { id: Number(id) } });
		await refetch();
	};

	return (
		<div className="admin-page">
			<h1 className="admin-page-title">Bannerlar</h1>
			<div className="admin-table-wrap">
				<div className="admin-table-header">
					<h2>Bannerlar ro&apos;yxati</h2>
					{!showForm && (
						<button type="button" className="add-btn" onClick={() => setShowForm(true)}>
							Yangi banner
						</button>
					)}
				</div>

				{showForm && (
					<form className="admin-product-form" onSubmit={handleSubmit}>
						<fieldset className="form-section">
							<legend className="form-section-title">Sarlavha va tartib</legend>
							<div className="form-row">
								<div className="form-group">
									<label htmlFor="title">Sarlavha *</label>
									<input
										id="title"
										placeholder="Masalan: Ramazon aksiyasi"
										value={form.title}
										onChange={(e) => setForm({ ...form, title: e.target.value })}
										required
									/>
								</div>
								<div className="form-group">
									<label htmlFor="sortOrder">Tartib raqami</label>
									<input
										id="sortOrder"
										type="number"
										placeholder="0"
										min="0"
										value={form.sortOrder}
										onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
									/>
								</div>
							</div>
							<div className="form-row form-row--checkboxes">
								<label className="admin-checkbox-label">
									<input
										type="checkbox"
										checked={form.isActive}
										onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
									/>
									Faol (bosh sahifada ko&apos;rinsin)
								</label>
							</div>
						</fieldset>

						<fieldset className="form-section">
							<legend className="form-section-title">Rasm</legend>
							<p className="form-hint">
								Banner rasmini yuklang yoki URL manzilini kiriting.
							</p>
							<div className="image-row">
								<div className="image-preview-box">
									{form.imageUrl ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img
											src={form.imageUrl}
											alt="Banner"
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
										id="banner-file-input"
										accept="image/jpeg,image/png,image/webp"
										style={{ display: 'none' }}
										onChange={(e) => {
											const file = e.target.files?.[0];
											if (file) void handleFileSelect(file);
											e.target.value = '';
										}}
									/>
									<button
										type="button"
										className="image-upload-btn"
										onClick={() =>
											(document.getElementById('banner-file-input') as HTMLInputElement | null)?.click()
										}
										disabled={uploading}
									>
										{uploading ? 'Yuklanmoqda...' : 'Fayl tanlash'}
									</button>
									<input
										type="url"
										placeholder="yoki URL manzilini kiriting..."
										value={form.imageUrl}
										onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
										className="image-url-input"
										required
									/>
								</div>
							</div>
						</fieldset>

						<div className="form-actions">
							<button type="button" className="form-cancel-btn" onClick={resetForm} disabled={saving}>
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
								<th>Rasm</th>
								<th>Sarlavha</th>
								<th>Tartib</th>
								<th>Holat</th>
								<th>Amallar</th>
							</tr>
						</thead>
						<tbody>
							{banners.map((banner, index) => (
								<tr key={banner.id}>
									<td>{index + 1}</td>
									<td>
										<div className="image-preview-box">
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img
												src={banner.imageUrl}
												alt={banner.title}
												className="image-preview-thumb"
												onError={(e) => {
													(e.currentTarget as HTMLImageElement).style.display = 'none';
												}}
											/>
										</div>
									</td>
									<td>{banner.title}</td>
									<td>{banner.sortOrder}</td>
									<td>{banner.isActive ? 'Faol' : 'Nofaol'}</td>
									<td>
										<button type="button" className="action-btn edit-btn" onClick={() => startEdit(banner)}>
											✏️
										</button>
										<button type="button" className="action-btn delete-btn" onClick={() => handleDelete(banner.id)}>
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

export default withLayoutAdmin(AdminBannersPage);
