interface Address {
	_id: string;
	addressTitle: string;
	addressContent: string;
	isDefault: boolean;
}

const mockAddresses: Address[] = [
	{ _id: '1', addressTitle: 'Uy', addressContent: '서울시 마포구 월드컵로 240, 101동 1502호', isDefault: true },
	{ _id: '2', addressTitle: 'Ish joyi', addressContent: '서울시 강남구 테헤란로 152, 강남파이낸스센터 20층', isDefault: false },
];

const ProfileAddress = () => {
	return (
		<div className="profile-address">
			<h2>Manzillar</h2>

			<div className="address-list">
				{mockAddresses.map((address) => (
					<div key={address._id} className={`address-card${address.isDefault ? ' default' : ''}`}>
						<p className="address-title">
							{address.addressTitle}
							{address.isDefault && <span className="default-badge">Asosiy</span>}
						</p>
						<p className="address-content">{address.addressContent}</p>
					</div>
				))}
			</div>

			<button type="button" className="add-address-btn">
				Yangi manzil qo&apos;shish
			</button>
		</div>
	);
};

export default ProfileAddress;
