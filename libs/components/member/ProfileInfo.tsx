import Image from 'next/image';

interface ProfileInfoUser {
	firstName: string;
	lastName: string;
	phone: string;
	memberImage: string;
}

interface ProfileInfoProps {
	user: ProfileInfoUser;
}

const ProfileInfo = ({ user }: ProfileInfoProps) => {
	const { firstName, lastName, phone, memberImage } = user;

	return (
		<div className="profile-info">
			<h2>Shaxsiy ma&apos;lumotlar</h2>

			<div className="profile-image-upload">
				{memberImage ? (
					<Image
						src={memberImage}
						alt={`${firstName} ${lastName}`}
						width={96}
						height={96}
						style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
					/>
				) : (
					<span className="upload-placeholder">📷</span>
				)}
			</div>

			<form className="profile-form">
				<div className="form-group">
					<label htmlFor="firstName">Ism</label>
					<input id="firstName" type="text" value={firstName} readOnly />
				</div>

				<div className="form-group">
					<label htmlFor="lastName">Familiya</label>
					<input id="lastName" type="text" value={lastName} readOnly />
				</div>

				<div className="form-group">
					<label htmlFor="phone">Telefon raqam</label>
					<input id="phone" type="text" value={phone} readOnly />
				</div>

				<button type="submit" className="form-save-btn" disabled>
					Ma&apos;lumotlarni saqlash
				</button>
			</form>
		</div>
	);
};

export default ProfileInfo;
