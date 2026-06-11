import { useQuery, useMutation } from '@apollo/client';
import { GET_MY_ADDRESSES } from '../../../apollo/user/query';
import { DELETE_ADDRESS, SET_DEFAULT_ADDRESS } from '../../../apollo/user/mutation';
import type { Address } from '../../types/address/address';

const ProfileAddress = () => {
	const { data, loading } = useQuery<{ getMyAddresses: Address[] }>(GET_MY_ADDRESSES);
	const [deleteAddress] = useMutation(DELETE_ADDRESS, { refetchQueries: [{ query: GET_MY_ADDRESSES }] });
	const [setDefaultAddress] = useMutation(SET_DEFAULT_ADDRESS, { refetchQueries: [{ query: GET_MY_ADDRESSES }] });

	const addresses = data?.getMyAddresses ?? [];

	const handleDelete = (id: string) => {
		deleteAddress({ variables: { id: Number(id) } });
	};

	const handleSetDefault = (id: string) => {
		setDefaultAddress({ variables: { id: Number(id) } });
	};

	return (
		<div className="profile-address">
			<h2>Manzillar</h2>

			{loading ? (
				<p className="loading-text">Yuklanmoqda...</p>
			) : addresses.length > 0 ? (
				<div className="address-list">
					{addresses.map((address) => (
						<div key={address.id} className={`address-card${address.isDefault ? ' default' : ''}`}>
							<p className="address-title">
								{address.recipientName}
								{address.isDefault && <span className="default-badge">Asosiy</span>}
							</p>
							<p className="address-content">
								{address.addressLine1}
								{address.addressLine2 ? `, ${address.addressLine2}` : ''}, {address.city}, {address.postalCode}
							</p>
							<p className="address-phone">{address.phone}</p>

							<div className="address-actions">
								{!address.isDefault && (
									<button type="button" className="address-action-btn" onClick={() => handleSetDefault(address.id)}>
										Asosiy qilish
									</button>
								)}
								<button type="button" className="address-action-btn" onClick={() => handleDelete(address.id)}>
									O&apos;chirish
								</button>
							</div>
						</div>
					))}
				</div>
			) : (
				<p className="empty-text">Manzillar mavjud emas</p>
			)}

			<button type="button" className="add-address-btn">
				Yangi manzil qo&apos;shish
			</button>
		</div>
	);
};

export default ProfileAddress;
