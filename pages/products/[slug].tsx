import { useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { withLayoutHome } from '../../libs/components/layout/LayoutHome';
import ReviewSection from '../../libs/components/products/ReviewSection';
import { GET_PRODUCT_BY_SLUG, GET_MY_CART, GET_MY_WISHLIST } from '../../apollo/user/query';
import { ADD_TO_CART, ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from '../../apollo/user/mutation';
import { userVar } from '../../apollo/client';
import { getLocalizedName, langVar, t } from '../../libs/i18n';
import type { Member } from '../../libs/types/member/member';
import type { Product } from '../../libs/types/product/product';
import type { WishlistItem } from '../../libs/types/wishlist/wishlist';

const DEFAULT_EMOJI = '🛒';
const DELIVERY_FEE = 3000;

const UNIT_EMOJI: Record<string, string> = {
	KG: '🥩',
	G: '🥩',
	L: '🧴',
	ML: '🧴',
	PIECE: '📦',
};

const ProductDetailPage: NextPage = () => {
	const router = useRouter();
	const slug = typeof router.query.slug === 'string' ? router.query.slug : '';
	const user = useReactiveVar(userVar) as Member | null;
	const lang = useReactiveVar(langVar);
	const [quantity, setQuantity] = useState(1);
	const [message, setMessage] = useState('');

	const { data, loading } = useQuery<{ getProductBySlug: Product | null }>(GET_PRODUCT_BY_SLUG, {
		variables: { slug },
		skip: !slug,
	});

	const [addToCart, { loading: addingToCart }] = useMutation(ADD_TO_CART, {
		refetchQueries: [{ query: GET_MY_CART }],
	});

	const { data: wishlistData } = useQuery<{ getMyWishlist: { items: WishlistItem[] } }>(GET_MY_WISHLIST, {
		skip: !user,
	});
	const [addToWishlist, { loading: addingToWishlist }] = useMutation(ADD_TO_WISHLIST, {
		refetchQueries: [{ query: GET_MY_WISHLIST }],
	});
	const [removeFromWishlist, { loading: removingFromWishlist }] = useMutation(REMOVE_FROM_WISHLIST, {
		refetchQueries: [{ query: GET_MY_WISHLIST }],
	});

	if (!router.isReady || loading) {
		return (
			<div className="product-detail-page">
				<div className="container">
					<p className="loading-text">{t('loading', lang)}</p>
				</div>
			</div>
		);
	}

	const product = data?.getProductBySlug;

	if (!product) {
		return (
			<div className="product-detail-page">
				<div className="container">
					<p>{t('productNotFound', lang)}</p>
				</div>
			</div>
		);
	}

	const { unit, price, stockQuantity, images, descriptionUz } = product;
	const name = getLocalizedName(product, lang);

	const primaryImage = images.find((image) => image.isPrimary)?.url ?? images[0]?.url;
	const fallbackEmoji = UNIT_EMOJI[unit] ?? DEFAULT_EMOJI;

	const isWishlisted =
		wishlistData?.getMyWishlist?.items?.some((item) => String(item.productId) === String(product.id)) ?? false;

	const handleDecrease = () => setQuantity((prev) => Math.max(1, prev - 1));
	const handleIncrease = () => setQuantity((prev) => Math.min(stockQuantity, prev + 1));

	const handleAddToCart = async () => {
		if (!user) {
			router.push('/auth');
			return;
		}

		setMessage('');

		try {
			await addToCart({ variables: { input: { productId: Number(product.id), quantity } } });
			setMessage(t('addedToCart', lang));
		} catch {
			setMessage(t('genericError', lang));
		}
	};

	const handleToggleWishlist = async () => {
		if (!user) {
			router.push('/auth');
			return;
		}

		if (isWishlisted) {
			await removeFromWishlist({ variables: { productId: Number(product.id) } });
		} else {
			await addToWishlist({ variables: { productId: Number(product.id) } });
		}
	};

	return (
		<div className="product-detail-page">
			<div className="container">
				<div className="product-detail-layout">
					<div className="product-detail-image">
						{primaryImage ? (
							<Image
								src={primaryImage}
								alt={name}
								width={600}
								height={600}
								style={{ width: '100%', height: '100%', objectFit: 'cover' }}
							/>
						) : (
							<span>{fallbackEmoji}</span>
						)}
					</div>

					<div className="product-detail-info">
						<div className="product-detail-name-row">
							<h1 className="product-detail-name">{name}</h1>
							<button
								type="button"
								className={`wishlist-toggle-btn${isWishlisted ? ' active' : ''}`}
								onClick={handleToggleWishlist}
								disabled={addingToWishlist || removingFromWishlist}
								aria-label={t('wishlist', lang)}
							>
								{isWishlisted ? '❤️' : '🤍'}
							</button>
						</div>
						<span className="product-detail-unit">{unit}</span>
						<div className="product-detail-price">₩{price.toLocaleString()}</div>
						<div className="product-detail-stock">{t('stock', lang)}: {stockQuantity} ta</div>
						<div className="product-detail-rating">
							⭐ {product.averageRating.toFixed(1)} ({product.reviewCount} {t('reviews', lang)})
						</div>

						{descriptionUz && <p className="product-detail-desc">{descriptionUz}</p>}

						<div className="quantity-selector">
							<button type="button" onClick={handleDecrease} disabled={quantity <= 1}>
								−
							</button>
							<span>{quantity}</span>
							<button type="button" onClick={handleIncrease} disabled={quantity >= stockQuantity}>
								+
							</button>
						</div>

						{message && <p className="product-detail-message">{message}</p>}

						<button
							type="button"
							className="detail-add-to-cart"
							onClick={handleAddToCart}
							disabled={addingToCart || stockQuantity === 0}
						>
							{t('addToCart', lang)}
						</button>

						<div className="detail-delivery">🚚 {t('deliveryFee', lang)}: {DELIVERY_FEE.toLocaleString()} ₩</div>
					</div>
				</div>

				<ReviewSection productId={product.id} slug={slug} />
			</div>
		</div>
	);
};

export default withLayoutHome(ProductDetailPage);
