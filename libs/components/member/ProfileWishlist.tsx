import { useState } from 'react';
import ProductCard from '../products/ProductCard';
import { mockProducts } from '../../data/mockProducts';

const ProfileWishlist = () => {
	const [wishlist, setWishlist] = useState(mockProducts.slice(0, 4));

	const handleRemove = (id: string) => {
		setWishlist((prev) => prev.filter((product) => product._id !== id));
	};

	return (
		<div className="profile-wishlist">
			<h2>Wishlist</h2>

			{wishlist.length > 0 ? (
				<div className="wishlist-grid">
					{wishlist.map((product) => (
						<div key={product._id} className="wishlist-item">
							<ProductCard product={product} />
							<button type="button" className="wishlist-remove-btn" onClick={() => handleRemove(product._id)}>
								Ro&apos;yxatdan o&apos;chirish
							</button>
						</div>
					))}
				</div>
			) : (
				<p>Wishlist bo&apos;sh</p>
			)}
		</div>
	);
};

export default ProfileWishlist;
