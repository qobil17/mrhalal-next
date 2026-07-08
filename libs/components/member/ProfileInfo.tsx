import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { useMutation, useReactiveVar } from '@apollo/client';
import Swal from 'sweetalert2';
import { UPDATE_MY_PROFILE } from '../../../apollo/user/mutation';
import { getJwtToken } from '../../auth';
import { userVar } from '../../../apollo/client';
import { langVar, t } from '../../i18n';
import type { Member } from '../../types/member/member';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface ProfileInfoProps {
	user: Member;
}

const ProfileInfo = ({ user }: ProfileInfoProps) => {
	const lang = useReactiveVar(langVar);
	const [firstName, setFirstName] = useState(user.firstName);
	const [lastName, setLastName] = useState(user.lastName ?? '');
	const [email, setEmail] = useState(user.email ?? '');
	const [message, setMessage] = useState('');
	const [avatarUploading, setAvatarUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [updateMyProfile, { loading }] = useMutation(UPDATE_MY_PROFILE);

	const openFilePicker = () => {
		fileInputRef.current?.click();
	};

	const handleAvatarClick = () => {
		if (user.avatar) {
			Swal.fire({
				imageUrl: user.avatar,
				imageAlt: `${user.firstName} ${user.lastName}`,
				showConfirmButton: false,
				showCloseButton: true,
			});
		} else {
			openFilePicker();
		}
	};

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		e.target.value = '';
		if (!file) return;

		if (!ALLOWED_TYPES.includes(file.type)) {
			Swal.fire({ icon: 'error', title: t('invalidFormat', lang), text: t('invalidFormatText', lang) });
			return;
		}
		if (file.size > MAX_FILE_SIZE) {
			Swal.fire({ icon: 'error', title: t('fileTooLarge', lang), text: t('fileTooLargeText', lang) });
			return;
		}

		setAvatarUploading(true);
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
				const data = (await res.json().catch(() => ({}))) as { message?: string };
				throw new Error(data.message ?? `Server xatosi: ${res.status}`);
			}

			const { url } = (await res.json()) as { url: string; publicId: string };
			const { data } = await updateMyProfile({ variables: { input: { avatar: url } } });
			const updatedAvatar = data?.updateMyProfile?.avatar;
			if (updatedAvatar) {
				userVar({ ...userVar(), avatar: updatedAvatar });
			}
		} catch (err) {
			Swal.fire({
				icon: 'error',
				title: t('uploadFailed', lang),
				text: err instanceof Error ? err.message : t('uploadFailedText', lang),
			});
		} finally {
			setAvatarUploading(false);
		}
	};

	const handleSave = async (e: FormEvent) => {
		e.preventDefault();
		setMessage('');

		try {
			await updateMyProfile({
				variables: { input: { firstName, lastName: lastName || undefined, email: email || undefined } },
			});
			setMessage(t('saveSuccess', lang));
		} catch (err) {
			setMessage(err instanceof Error ? err.message : t('genericError', lang));
		}
	};

	return (
		<div className="profile-info">
			<h2>{t('personalInfo', lang)}</h2>

			<div className="profile-avatar-wrap">
				<div
					className="profile-image-upload"
					onClick={handleAvatarClick}
					role="button"
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') handleAvatarClick();
					}}
				>
					{avatarUploading ? (
						<span className="avatar-spinner" />
					) : user.avatar ? (
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

				<button
					type="button"
					className="avatar-camera-btn"
					onClick={openFilePicker}
					disabled={avatarUploading}
					title={t('changePhoto', lang)}
				>
					📷
				</button>

				<input
					ref={fileInputRef}
					type="file"
					accept="image/jpeg,image/png,image/webp"
					style={{ display: 'none' }}
					onChange={handleFileChange}
				/>
			</div>

			<form className="profile-form" onSubmit={handleSave}>
				<div className="form-group">
					<label htmlFor="firstName">{t('firstName', lang)}</label>
					<input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
				</div>

				<div className="form-group">
					<label htmlFor="lastName">{t('lastName', lang)}</label>
					<input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
				</div>

				<div className="form-group">
					<label htmlFor="email">{t('email', lang)}</label>
					<input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
				</div>

				<div className="form-group">
					<label htmlFor="phone">{t('phone', lang)}</label>
					<input id="phone" type="text" value={user.phone} readOnly />
				</div>

				{message && <p className="form-message">{message}</p>}

				<button type="submit" className="form-save-btn" disabled={loading}>
					{loading ? t('saving', lang) : t('saveButton', lang)}
				</button>
			</form>
		</div>
	);
};

export default ProfileInfo;
