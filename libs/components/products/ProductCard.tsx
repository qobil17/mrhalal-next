import Image from 'next/image';
import { ProductCard as ProductCardType } from '../../types/product/product';

interface ProductCardProps {
	product: ProductCardType;
}

const DEFAULT_EMOJI = '🛒';

const ProductCard = ({ product }: ProductCardProps) => {
	const { productName, productUnit, productPrice, productImage, productLeftCount } = product;

	const isImagePath = productImage.startsWith('/') || productImage.startsWith('http');

	return (
		<div className="product-card">
			<div className="product-card-image">
				{isImagePath ? (
					<Image
						src={productImage}
						alt={productName}
						width={300}
						height={300}
						style={{ width: '100%', height: '100%', objectFit: 'cover' }}
					/>
				) : (
					<span>{productImage || DEFAULT_EMOJI}</span>
				)}
			</div>

			<div className="product-card-body">
				<p className="product-card-name">{productName}</p>
				<span className="product-card-unit">{productUnit}</span>
				<p className="product-card-price">₩{productPrice.toLocaleString()}</p>
				<p className="product-card-stock">Omborda: {productLeftCount} ta</p>

				<button type="button" className="add-to-cart-btn">
					Savatga
				</button>
			</div>
		</div>
	);
};

export default ProductCard;
