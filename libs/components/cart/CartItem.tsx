import Image from 'next/image';
import { CartItem as CartItemType } from '../../types/cart/cart';

interface CartItemProps {
	item: CartItemType;
	onQuantityChange: (id: string, quantity: number) => void;
	onRemove: (id: string) => void;
}

const UNIT_EMOJI: Record<string, string> = {
	KG: '🥩',
	G: '🥩',
	L: '🧴',
	ML: '🧴',
	PIECE: '📦',
};

const DEFAULT_EMOJI = '🛒';

const CartItem = ({ item, onQuantityChange, onRemove }: CartItemProps) => {
	const { id, quantity, subtotal, product } = item;

	const primaryImage = product.images.find((image) => image.isPrimary)?.url ?? product.images[0]?.url;
	const fallbackEmoji = UNIT_EMOJI[product.unit] ?? DEFAULT_EMOJI;

	return (
		<div className="cart-item">
			<div className="cart-item-image">
				{primaryImage ? (
					<Image
						src={primaryImage}
						alt={product.nameUz}
						width={80}
						height={80}
						style={{ width: '100%', height: '100%', objectFit: 'cover' }}
					/>
				) : (
					<span>{fallbackEmoji}</span>
				)}
			</div>

			<div className="cart-item-info">
				<p className="cart-item-name">{product.nameUz}</p>
				<span className="cart-item-unit">{product.unit}</span>
			</div>

			<div className="cart-item-quantity">
				<button type="button" onClick={() => onQuantityChange(id, Math.max(1, quantity - 1))}>
					−
				</button>
				<span>{quantity}</span>
				<button type="button" onClick={() => onQuantityChange(id, Math.min(99, quantity + 1))}>
					+
				</button>
			</div>

			<div className="cart-item-price">₩{subtotal.toLocaleString()}</div>

			<button type="button" className="cart-item-remove" onClick={() => onRemove(id)}>
				✕
			</button>
		</div>
	);
};

export default CartItem;
