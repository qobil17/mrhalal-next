import { useState } from 'react';
import type { FormEvent } from 'react';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import Swal from 'sweetalert2';
import { GET_MY_ADDRESSES } from '../../../apollo/user/query';
import { CREATE_ADDRESS, DELETE_ADDRESS, SET_DEFAULT_ADDRESS, UPDATE_ADDRESS } from '../../../apollo/user/mutation';
import { langVar, t } from '../../i18n';
import type { Address } from '../../types/address/address';

interface AddressFormState {
	recipientName: string;
	phone: string;
	addressLine1: string;
	addressLine2: string;
	city: string;
	postalCode: string;
}

const EMPTY_FORM: AddressFormState = {
	recipientName: '',
	phone: '',
	addressLine1: '',
	addressLine2: '',
	city: '',
	postalCode: '',
};

const REFETCH = [{ query: GET_MY_ADDRESSES }];

const ProfileAddress = () => {
	const lang = useReactiveVar(langVar);
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form, setForm] = useState<AddressFormState>(EMPTY_FORM);

	const { data, loading } = useQuery<{ getMyAddresses: Address[] }>(GET_MY_ADDRESSES);
	const [createAddress, { loading: creating }] = useMutation(CREATE_ADDRESS, { refetchQueries: REFETCH });
	const [updateAddress, { loading: updating }] = useMutation(UPDATE_ADDRESS, { refetchQueries: REFETCH });
	const [deleteAddress] = useMutation(DELETE_ADDRESS, { refetchQueries: REFETCH });
	const [setDefaultAddress] = useMutation(SET_DEFAULT_ADDRESS, { refetchQueries: REFETCH });

	const addresses = data?.getMyAddresses ?? [];

	const resetForm = () => {
		setForm(EMPTY_FORM);
		setEditingId(null);
		setShowForm(false);
	};

	const handleDelete = (id: string) => {
		deleteAddress({ variables: { id: Number(id) } });
	};

	const handleSetDefault = (id: string) => {
		setDefaultAddress({ variables: { id: Number(id) } });
	};

	const handleEdit = (address: Address) => {
		setEditingId(address.id);
		setForm({
			recipientName: address.recipientName,
			phone: address.phone,
			addressLine1: address.addressLine1,
			addressLine2: address.addressLine2 ?? '',
			city: address.city,
			postalCode: address.postalCode,
		});
		setShowForm(true);
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		try {
			const input = { ...form, addressLine2: form.addressLine2 || undefined };
			if (editingId) {
				await updateAddress({ variables: { input: { id: Number(editingId), ...input } } });
			} else {
				await createAddress({ variables: { input } });
			}
			resetForm();
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : t('genericError', lang);
			Swal.fire({ icon: 'error', title: t('errorTitle', lang), text: message });
		}
	};

	const handleToggleForm = () => {
		if (showForm) {
			resetForm();
		} else {
			setShowForm(true);
		}
	};

	const saving = creating || updating;

	return (
		<div className="profile-address">
			<h2>{t('addresses', lang)}</h2>

			{loading ? (
				<p className="loading-text">{t('loading', lang)}</p>
			) : addresses.length > 0 ? (
				<div className="address-list">
					{addresses.map((address) => (
						<div key={address.id} className={`address-card${address.isDefault ? ' default' : ''}`}>
							<p className="address-title">
								{address.recipientName}
								{address.isDefault && <span className="default-badge">{t('defaultBadge', lang)}</span>}
							</p>
							<p className="address-content">
								{address.addressLine1}
								{address.addressLine2 ? `, ${address.addressLine2}` : ''}, {address.city}, {address.postalCode}
							</p>
							<p className="address-phone">{address.phone}</p>

							<div className="address-actions">
								<button type="button" className="address-action-btn" onClick={() => handleEdit(address)}>
									{t('editAddress', lang)}
								</button>
								{!address.isDefault && (
									<button type="button" className="address-action-btn" onClick={() => handleSetDefault(address.id)}>
										{t('makeDefault', lang)}
									</button>
								)}
								<button type="button" className="address-action-btn" onClick={() => handleDelete(address.id)}>
									{t('deleteAddress', lang)}
								</button>
							</div>
						</div>
					))}
				</div>
			) : (
				<p className="empty-text">{t('noAddresses', lang)}</p>
			)}

			{showForm && (
				<form className="profile-form" onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="recipientName">{t('recipientName', lang)}</label>
						<input
							id="recipientName"
							value={form.recipientName}
							onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
							required
						/>
					</div>
					<div className="form-group">
						<label htmlFor="addrPhone">{t('phoneLabel', lang)}</label>
						<input
							id="addrPhone"
							value={form.phone}
							onChange={(e) => setForm({ ...form, phone: e.target.value })}
							required
						/>
					</div>
					<div className="form-group">
						<label htmlFor="addressLine1">{t('addressLabel', lang)}</label>
						<input
							id="addressLine1"
							value={form.addressLine1}
							onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
							required
						/>
					</div>
					<div className="form-group">
						<label htmlFor="addressLine2">{t('addressLine2', lang)}</label>
						<input
							id="addressLine2"
							value={form.addressLine2}
							onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
						/>
					</div>
					<div className="form-group">
						<label htmlFor="city">{t('city', lang)}</label>
						<input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
					</div>
					<div className="form-group">
						<label htmlFor="postalCode">{t('postalCode', lang)}</label>
						<input
							id="postalCode"
							value={form.postalCode}
							onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
							required
						/>
					</div>
					<button type="submit" className="form-save-btn" disabled={saving}>
						{saving ? t('saving', lang) : t('saveButton', lang)}
					</button>
				</form>
			)}

			<button type="button" className="add-address-btn" onClick={handleToggleForm}>
				{showForm ? t('cancel', lang) : t('addNewAddress', lang)}
			</button>
		</div>
	);
};

export default ProfileAddress;
