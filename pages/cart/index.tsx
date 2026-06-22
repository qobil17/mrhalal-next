import { useState } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { withLayoutHome } from '../../libs/components/layout/LayoutHome';
import CartItem from '../../libs/components/cart/CartItem';
import { GET_MY_CART, GET_MY_ORDERS } from '../../apollo/user/query';
import { UPDATE_CART_ITEM, REMOVE_FROM_CART, CLEAR_CART, CREATE_ORDER } from '../../apollo/user/mutation';
import { authReadyVar, userVar } from '../../apollo/client';
import type { Member } from '../../libs/types/member/member';
import type { Cart } from '../../libs/types/cart/cart';

const DELIVERY_FEE = 3000;

const CartPage: NextPage = () => {
	const router = useRouter();
	const authReady = useReactiveVar(authReadyVar);
	const user = useReactiveVar(userVar) as Member | null;
	const [checkoutError, setCheckoutError] = useState('');

	const { data, loading } = useQuery<{ getMyCart: Cart }>(GET_MY_CART, {
		skip: !user,
	});

	const [updateCartItem] = useMutation(UPDATE_CART_ITEM, { refetchQueries: [{ query: GET_MY_CART }] });
	const [removeFromCart] = useMutation(REMOVE_FROM_CART, { refetchQueries: [{ query: GET_MY_CART }] });
	const [clearCart] = useMutation(CLEAR_CART, { refetchQueries: [{ query: GET_MY_CART }] });
	const [createOrder, { loading: placingOrder }] = useMutation(CREATE_ORDER, {
		refetchQueries: [{ query: GET_MY_CART }, { query: GET_MY_ORDERS, variables: { input: { page: 1, limit: 20 } } }],
	});

	const handleQuantityChange = (id: string, quantity: number) => {
		updateCartItem({ variables: { input: { itemId: Number(id), quantity } } });
	};

	const handleRemoveItem = (id: string) => {
		removeFromCart({ variables: { itemId: Number(id) } });
	};

	const handleClearCart = () => {
		clearCart();
	};

	const handleCheckout = async () => {
		setCheckoutError('');

		try {
			await createOrder({ variables: { input: {} } });
			router.push('/profile?tab=orders');
		} catch (err) {
			setCheckoutError(
				err instanceof Error ? err.message : 'Buyurtma berishda xatolik yuz berdi, qayta urinib koʻring',
			);
		}
	};

	if (!authReady) {
		return (
			<div className="cart-page">
				<div className="container">
					<h1 className="cart-title">Savat</h1>
					<p className="loading-text">Yuklanmoqda...</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="cart-page">
				<div className="container">
					<h1 className="cart-title">Savat</h1>
					<div className="cart-empty">
						<span>🔒</span>
						<p>Savatni ko&apos;rish uchun tizimga kiring</p>
						<Link href="/auth">Tizimga kirish</Link>
					</div>
				</div>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="cart-page">
				<div className="container">
					<h1 className="cart-title">Savat</h1>
					<p className="loading-text">Yuklanmoqda...</p>
				</div>
			</div>
		);
	}

	const cart = data?.getMyCart;
	const items = cart?.items ?? [];
	const subtotal = cart?.total ?? 0;
	const total = subtotal + DELIVERY_FEE;

	return (
		<div className="cart-page">
			<div className="container">
				<h1 className="cart-title">Savat</h1>

				{items.length > 0 && (
					<div className="cart-layout">
						<div className="cart-items">
							{items.map((item) => (
								<CartItem key={item.id} item={item} onQuantityChange={handleQuantityChange} onRemove={handleRemoveItem} />
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

							{checkoutError && <p className="form-message" style={{ color: '#cc1b1b' }}>{checkoutError}</p>}

							<button type="button" className="checkout-btn" onClick={handleCheckout} disabled={placingOrder}>
								{placingOrder ? 'Yuborilmoqda...' : 'Buyurtma berish'}
							</button>

							<Link href="/products" className="continue-shopping">
								← Xaridni davom ettirish
							</Link>
						</div>
					</div>
				)}

				{items.length === 0 && (
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
