import { useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { withLayoutHome } from '../../libs/components/layout/LayoutHome';
import { GET_PRODUCT_BY_SLUG, GET_MY_CART } from '../../apollo/user/query';
import { ADD_TO_CART } from '../../apollo/user/mutation';
import { userVar } from '../../apollo/client';
import type { Member } from '../../libs/types/member/member';
import type { Product } from '../../libs/types/product/product';

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
	const [quantity, setQuantity] = useState(1);
	const [message, setMessage] = useState('');

	const { data, loading } = useQuery<{ getProductBySlug: Product | null }>(GET_PRODUCT_BY_SLUG, {
		variables: { slug },
		skip: !slug,
	});

	const [addToCart, { loading: addingToCart }] = useMutation(ADD_TO_CART, {
		refetchQueries: [{ query: GET_MY_CART }],
	});

	if (!router.isReady || loading) {
		return (
			<div className="product-detail-page">
				<div className="container">
					<p className="loading-text">Yuklanmoqda...</p>
				</div>
			</div>
		);
	}

	const product = data?.getProductBySlug;

	if (!product) {
		return (
			<div className="product-detail-page">
				<div className="container">
					<p>Mahsulot topilmadi</p>
				</div>
			</div>
		);
	}

	const { nameUz, unit, price, stockQuantity, images, descriptionUz } = product;

	const primaryImage = images.find((image) => image.isPrimary)?.url ?? images[0]?.url;
	const fallbackEmoji = UNIT_EMOJI[unit] ?? DEFAULT_EMOJI;

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
			setMessage("Mahsulot savatga qo'shildi");
		} catch {
			setMessage('Xatolik yuz berdi, qayta urinib koʻring');
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
								alt={nameUz}
								width={600}
								height={600}
								style={{ width: '100%', height: '100%', objectFit: 'cover' }}
							/>
						) : (
							<span>{fallbackEmoji}</span>
						)}
					</div>

					<div className="product-detail-info">
						<span className="product-detail-unit">{unit}</span>
						<h1 className="product-detail-name">{nameUz}</h1>
						<div className="product-detail-price">₩{price.toLocaleString()}</div>
						<div className="product-detail-stock">Omborda: {stockQuantity} ta</div>

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
							Savatga qo&apos;shish
						</button>

						<div className="detail-delivery">🚚 Yetkazib berish: {DELIVERY_FEE.toLocaleString()} ₩</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withLayoutHome(ProductDetailPage);
