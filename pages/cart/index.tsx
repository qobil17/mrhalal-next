import { useState } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { withLayoutHome } from '../../libs/components/layout/LayoutHome';
import CartItem, { CartItemType } from '../../libs/components/cart/CartItem';

const DELIVERY_FEE = 3000;

const initialCartItems: CartItemType[] = [
	{
		_id: '1',
		productId: 'p1',
		productName: "Mol go'shti (faqat go'sht)",
		productUnit: '1 kg',
		productPrice: 85000,
		quantity: 2,
		productImage: '',
		emoji: '🥩',
	},
	{
		_id: '2',
		productId: 'p2',
		productName: 'Tovuq filesi',
		productUnit: '1 kg',
		productPrice: 45000,
		quantity: 1,
		productImage: '',
		emoji: '🍗',
	},
	{
		_id: '3',
		productId: 'p3',
		productName: 'Guruch (Lazer)',
		productUnit: '5 kg',
		productPrice: 120000,
		quantity: 1,
		productImage: '',
		emoji: '🛒',
	},
];

const CartPage: NextPage = () => {
	const [cartItems, setCartItems] = useState<CartItemType[]>(initialCartItems);

	const handleQuantityChange = (id: string, delta: number) => {
		setCartItems((prev) =>
			prev.map((item) => (item._id === id ? { ...item, quantity: Math.min(99, Math.max(1, item.quantity + delta)) } : item)),
		);
	};

	const handleRemoveItem = (id: string) => {
		setCartItems((prev) => prev.filter((item) => item._id !== id));
	};

	const handleClearCart = () => {
		setCartItems([]);
	};

	const subtotal = cartItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
	const total = subtotal + DELIVERY_FEE;

	return (
		<div className="cart-page">
			<div className="container">
				<h1 className="cart-title">Savat</h1>

				{cartItems.length > 0 && (
					<div className="cart-layout">
						<div className="cart-items">
							{cartItems.map((item) => (
								<CartItem key={item._id} item={item} onQuantityChange={handleQuantityChange} onRemove={handleRemoveItem} />
							))}

							<button type="button" className="cart-clear-btn" onClick={handleClearCart}>
								Savatni tozalash
							</button>
						</div>

						<div className="cart-summary">
							<h3>Buyurtma xulosasi</h3>

							<div className="summary-row">
								<span>Mahsulotlar</span>
								<span>₩{subtotal.toLocaleString()}</span>
							</div>

							<div className="summary-row">
								<span>Yetkazib berish</span>
								<span>₩{DELIVERY_FEE.toLocaleString()}</span>
							</div>

							<div className="summary-divider" />

							<div className="summary-row summary-total">
								<span>Jami</span>
								<span>₩{total.toLocaleString()}</span>
							</div>

							<button type="button" className="checkout-btn">
								Buyurtma berish
							</button>

							<Link href="/products" className="continue-shopping">
								← Xaridni davom ettirish
							</Link>
						</div>
					</div>
				)}

				{cartItems.length === 0 && (
					<div className="cart-empty">
						<span>🛒</span>
						<p>Savat bo&apos;sh</p>
						<Link href="/products">Mahsulotlarga o&apos;tish</Link>
					</div>
				)}
			</div>
		</div>
	);
};

export default withLayoutHome(CartPage);
