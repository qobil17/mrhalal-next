export interface CartItemType {
	_id: string;
	productId: string;
	productName: string;
	productUnit: string;
	productPrice: number;
	quantity: number;
	productImage: string;
	emoji: string;
}

interface CartItemProps {
	item: CartItemType;
	onQuantityChange: (id: string, delta: number) => void;
	onRemove: (id: string) => void;
}

const CartItem = ({ item, onQuantityChange, onRemove }: CartItemProps) => {
	const { _id, productName, productUnit, productPrice, quantity, emoji } = item;

	return (
		<div className="cart-item">
			<div className="cart-item-image">{emoji}</div>

			<div className="cart-item-info">
				<p className="cart-item-name">{productName}</p>
				<span className="cart-item-unit">{productUnit}</span>
			</div>

			<div className="cart-item-quantity">
				<button type="button" onClick={() => onQuantityChange(_id, -1)}>
					−
				</button>
				<span>{quantity}</span>
				<button type="button" onClick={() => onQuantityChange(_id, 1)}>
					+
				</button>
			</div>

			<div className="cart-item-price">₩{(productPrice * quantity).toLocaleString()}</div>

			<button type="button" className="cart-item-remove" onClick={() => onRemove(_id)}>
				✕
			</button>
		</div>
	);
};

export default CartItem;
