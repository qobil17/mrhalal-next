import { useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { withLayoutHome } from '../../libs/components/layout/LayoutHome';
import { mockProducts, MockProduct } from '../../libs/data/mockProducts';

const DEFAULT_EMOJI = '🛒';
const DELIVERY_FEE = 3000;

interface ProductDetailPageProps {
	product: MockProduct | null;
}

const ProductDetailPage: NextPage<ProductDetailPageProps> = ({ product }) => {
	const [quantity, setQuantity] = useState(1);

	if (!product) {
		return (
			<div className="product-detail-page">
				<div className="container">
					<p>Mahsulot topilmadi</p>
				</div>
			</div>
		);
	}

	const { productName, productUnit, productPrice, productImage, productLeftCount } = product;

	const isImagePath = productImage.startsWith('/') || productImage.startsWith('http');

	const handleDecrease = () => setQuantity((prev) => Math.max(1, prev - 1));
	const handleIncrease = () => setQuantity((prev) => Math.min(productLeftCount, prev + 1));

	return (
		<div className="product-detail-page">
			<div className="container">
				<div className="product-detail-layout">
					<div className="product-detail-image">
						{isImagePath ? (
							<Image
								src={productImage}
								alt={productName}
								width={600}
								height={600}
								style={{ width: '100%', height: '100%', objectFit: 'cover' }}
							/>
						) : (
							<span>{productImage || DEFAULT_EMOJI}</span>
						)}
					</div>

					<div className="product-detail-info">
						<span className="product-detail-unit">{productUnit}</span>
						<h1 className="product-detail-name">{productName}</h1>
						<div className="product-detail-price">₩{productPrice.toLocaleString()}</div>
						<div className="product-detail-stock">Omborda: {productLeftCount} ta</div>

						<div className="quantity-selector">
							<button type="button" onClick={handleDecrease} disabled={quantity <= 1}>
								−
							</button>
							<span>{quantity}</span>
							<button type="button" onClick={handleIncrease} disabled={quantity >= productLeftCount}>
								+
							</button>
						</div>

						<button type="button" className="detail-add-to-cart">
							Savatga qo&apos;shish
						</button>

						<div className="detail-delivery">🚚 Yetkazib berish: {DELIVERY_FEE.toLocaleString()} ₩</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<ProductDetailPageProps> = async ({ params }) => {
	const id = typeof params?.id === 'string' ? params.id : '';
	const product = mockProducts.find((item) => item._id === id) ?? null;

	return { props: { product } };
};

export default withLayoutHome(ProductDetailPage);
