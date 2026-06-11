import { useState } from 'react';
import type { FormEvent } from 'react';
import Image from 'next/image';
import { useMutation } from '@apollo/client';
import { UPDATE_MY_PROFILE } from '../../../apollo/user/mutation';
import type { Member } from '../../types/member/member';

interface ProfileInfoProps {
	user: Member;
}

const ProfileInfo = ({ user }: ProfileInfoProps) => {
	const [firstName, setFirstName] = useState(user.firstName);
	const [lastName, setLastName] = useState(user.lastName);
	const [email, setEmail] = useState(user.email);
	const [message, setMessage] = useState('');

	const [updateMyProfile, { loading }] = useMutation(UPDATE_MY_PROFILE);

	const handleSave = async (e: FormEvent) => {
		e.preventDefault();
		setMessage('');

		try {
			await updateMyProfile({ variables: { input: { firstName, lastName, email } } });
			setMessage("Ma'lumotlar saqlandi");
		} catch {
			setMessage('Xatolik yuz berdi, qayta urinib koʻring');
		}
	};

	return (
		<div className="profile-info">
			<h2>Shaxsiy ma&apos;lumotlar</h2>

			<div className="profile-image-upload">
				{user.avatar ? (
					<Image
						src={user.avatar}
						alt={`${user.firstName} ${user.lastName}`}
						width={96}
						height={96}
						style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
					/>
				) : (
					<span className="upload-placeholder">📷</span>
				)}
			</div>

			<form className="profile-form" onSubmit={handleSave}>
				<div className="form-group">
					<label htmlFor="firstName">Ism</label>
					<input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
				</div>

				<div className="form-group">
					<label htmlFor="lastName">Familiya</label>
					<input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
				</div>

				<div className="form-group">
					<label htmlFor="email">Email</label>
					<input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
				</div>

				<div className="form-group">
					<label htmlFor="phone">Telefon raqam</label>
					<input id="phone" type="text" value={user.phone} readOnly />
				</div>

				{message && <p className="form-message">{message}</p>}

				<button type="submit" className="form-save-btn" disabled={loading}>
					{loading ? 'Saqlanmoqda...' : "Ma'lumotlarni saqlash"}
				</button>
			</form>
		</div>
	);
};

export default ProfileInfo;
