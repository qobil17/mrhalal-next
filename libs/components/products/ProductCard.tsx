import type { MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation, useReactiveVar } from '@apollo/client';
import Swal from 'sweetalert2';
import { userVar } from '../../../apollo/client';
import { ADD_TO_CART } from '../../../apollo/user/mutation';
import { GET_MY_CART } from '../../../apollo/user/query';
import { getLocalizedName, langVar, t } from '../../i18n';
import type { Member } from '../../types/member/member';

export interface ProductCardData {
	id: string;
	nameUz: string;
	nameKo: string;
	nameEn?: string | null;
	price: number;
	unit: string;
	stockQuantity: number;
	slug: string;
	images: { url: string; isPrimary: boolean }[];
}

interface ProductCardProps {
	product: ProductCardData;
}

const UNIT_EMOJI: Record<string, string> = {
	KG: '🥩',
	G: '🥩',
	L: '🧴',
	ML: '🧴',
	PIECE: '📦',
};

const DEFAULT_EMOJI = '🛒';

const ProductCard = ({ product }: ProductCardProps) => {
	const router = useRouter();
	const user = useReactiveVar(userVar) as Member | null;
	const lang = useReactiveVar(langVar);
	const { id, price, unit, stockQuantity, images, slug } = product;
	const name = getLocalizedName(product, lang);

	const [addToCart, { loading: addingToCart }] = useMutation(ADD_TO_CART, {
		refetchQueries: [{ query: GET_MY_CART }],
	});

	const primaryImage = images.find((image) => image.isPrimary)?.url ?? images[0]?.url;
	const fallbackEmoji = UNIT_EMOJI[unit] ?? DEFAULT_EMOJI;

	const handleAddToCart = async (e: MouseEvent) => {
		e.preventDefault();

		if (!user) {
			router.push('/auth');
			return;
		}

		try {
			await addToCart({ variables: { input: { productId: Number(id), quantity: 1 } } });
			await Swal.fire({ icon: 'success', title: t('addedToCart', lang), timer: 1200, showConfirmButton: false });
		} catch {
			await Swal.fire({ icon: 'error', title: t('genericError', lang) });
		}
	};

	return (
		<Link href={`/products/${slug}`} className="product-card">
			<div className="product-card-image">
				{primaryImage ? (
					<Image
						src={primaryImage}
						alt={name}
						width={300}
						height={300}
						style={{ width: '100%', height: '100%', objectFit: 'cover' }}
					/>
				) : (
					<span>{fallbackEmoji}</span>
				)}
			</div>

			<div className="product-card-body">
				<p className="product-card-name">{name}</p>
				<span className="product-card-unit">{unit}</span>
				<p className="product-card-price">₩{price.toLocaleString()}</p>
				<p className="product-card-stock">{t('stock', lang)}: {stockQuantity} ta</p>

				<button
					type="button"
					className="add-to-cart-btn"
					onClick={handleAddToCart}
					disabled={addingToCart || stockQuantity === 0}
				>
					{t('addToCart', lang)}
				</button>
			</div>
		</Link>
	);
};

export default ProductCard;
