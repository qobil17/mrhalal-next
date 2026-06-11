import { useQuery, useMutation } from '@apollo/client';
import ProductCard from '../products/ProductCard';
import { GET_MY_WISHLIST } from '../../../apollo/user/query';
import { REMOVE_FROM_WISHLIST } from '../../../apollo/user/mutation';
import type { WishlistItem } from '../../types/wishlist/wishlist';

interface WishlistResponse {
	items: WishlistItem[];
	total: number;
}

const ProfileWishlist = () => {
	const { data, loading } = useQuery<{ getMyWishlist: WishlistResponse }>(GET_MY_WISHLIST);
	const [removeFromWishlist] = useMutation(REMOVE_FROM_WISHLIST, { refetchQueries: [{ query: GET_MY_WISHLIST }] });

	const items = data?.getMyWishlist?.items ?? [];

	const handleRemove = (productId: string) => {
		removeFromWishlist({ variables: { productId: Number(productId) } });
	};

	return (
		<div className="profile-wishlist">
			<h2>Wishlist</h2>

			{loading ? (
				<p className="loading-text">Yuklanmoqda...</p>
			) : items.length > 0 ? (
				<div className="wishlist-grid">
					{items.map((item) => (
						<div key={item.id} className="wishlist-item">
							<ProductCard product={item.product} />
							<button type="button" className="wishlist-remove-btn" onClick={() => handleRemove(item.productId)}>
								Ro&apos;yxatdan o&apos;chirish
							</button>
						</div>
					))}
				</div>
			) : (
				<p className="empty-text">Wishlist bo&apos;sh</p>
			)}
		</div>
	);
};

export default ProfileWishlist;
