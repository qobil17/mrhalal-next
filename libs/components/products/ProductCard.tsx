import Image from 'next/image';
import Link from 'next/link';

export interface ProductCardData {
	nameUz: string;
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
	const { nameUz, price, unit, stockQuantity, images, slug } = product;

	const primaryImage = images.find((image) => image.isPrimary)?.url ?? images[0]?.url;
	const fallbackEmoji = UNIT_EMOJI[unit] ?? DEFAULT_EMOJI;

	return (
		<Link href={`/products/${slug}`} className="product-card">
			<div className="product-card-image">
				{primaryImage ? (
					<Image
						src={primaryImage}
						alt={nameUz}
						width={300}
						height={300}
						style={{ width: '100%', height: '100%', objectFit: 'cover' }}
					/>
				) : (
					<span>{fallbackEmoji}</span>
				)}
			</div>

			<div className="product-card-body">
				<p className="product-card-name">{nameUz}</p>
				<span className="product-card-unit">{unit}</span>
				<p className="product-card-price">₩{price.toLocaleString()}</p>
				<p className="product-card-stock">Omborda: {stockQuantity} ta</p>

				<button
					type="button"
					className="add-to-cart-btn"
					onClick={(e) => {
						e.preventDefault();
					}}
				>
					Savatga
				</button>
			</div>
		</Link>
	);
};

export default ProductCard;
