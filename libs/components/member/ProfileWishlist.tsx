import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import ProductCard from '../products/ProductCard';
import { GET_MY_WISHLIST } from '../../../apollo/user/query';
import { REMOVE_FROM_WISHLIST } from '../../../apollo/user/mutation';
import { langVar, t } from '../../i18n';
import type { WishlistItem } from '../../types/wishlist/wishlist';

interface WishlistResponse {
	items: WishlistItem[];
	total: number;
}

const ProfileWishlist = () => {
	const lang = useReactiveVar(langVar);
	const { data, loading } = useQuery<{ getMyWishlist: WishlistResponse }>(GET_MY_WISHLIST);
	const [removeFromWishlist] = useMutation(REMOVE_FROM_WISHLIST, { refetchQueries: [{ query: GET_MY_WISHLIST }] });

	const items = data?.getMyWishlist?.items ?? [];

	const handleRemove = (productId: number) => {
		removeFromWishlist({ variables: { productId } });
	};

	return (
		<div className="profile-wishlist">
			<h2>{t('wishlist', lang)}</h2>

			{loading ? (
				<p className="loading-text">{t('loading', lang)}</p>
			) : items.length > 0 ? (
				<div className="wishlist-grid">
					{items.map((item) => (
						<div key={item.id} className="wishlist-item">
							<ProductCard product={item.product} />
							<button type="button" className="wishlist-remove-btn" onClick={() => handleRemove(item.productId)}>
								{t('removeFromWishlist', lang)}
							</button>
						</div>
					))}
				</div>
			) : (
				<p className="empty-text">{t('emptyWishlist', lang)}</p>
			)}
		</div>
	);
};

export default ProfileWishlist;
