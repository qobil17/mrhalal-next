import { gql } from '@apollo/client';

/** AUTH **/
export const LOGIN = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
			accessToken
			member {
				id
				firstName
				lastName
				phone
				email
				avatar
				role
				isActive
			}
		}
	}
`;

export const REGISTER = gql`
	mutation Register($input: RegisterInput!) {
		register(input: $input) {
			accessToken
			member {
				id
				firstName
				lastName
				phone
				email
				avatar
				role
				isActive
			}
		}
	}
`;

/** CART **/
const CART_FIELDS = `
	id
	total
	itemCount
	currency
	items {
		id
		quantity
		subtotal
		product {
			id
			nameUz
			nameKo
			nameEn
			price
			unit
			images {
				url
				isPrimary
			}
		}
	}
`;

export const ADD_TO_CART = gql`
	mutation AddToCart($input: AddToCartInput!) {
		addToCart(input: $input) {
			${CART_FIELDS}
		}
	}
`;

export const UPDATE_CART_ITEM = gql`
	mutation UpdateCartItem($input: UpdateCartItemInput!) {
		updateCartItem(input: $input) {
			${CART_FIELDS}
		}
	}
`;

export const REMOVE_FROM_CART = gql`
	mutation RemoveFromCart($itemId: Int!) {
		removeFromCart(itemId: $itemId) {
			${CART_FIELDS}
		}
	}
`;

export const CLEAR_CART = gql`
	mutation ClearCart {
		clearCart
	}
`;

/** WISHLIST **/
const WISHLIST_FIELDS = `
	items {
		id
		productId
		createdAt
		product {
			id
			nameUz
			nameKo
			nameEn
			price
			unit
			slug
			stockQuantity
			images {
				url
				isPrimary
			}
		}
	}
	total
`;

export const ADD_TO_WISHLIST = gql`
	mutation AddToWishlist($productId: Int!) {
		addToWishlist(productId: $productId) {
			${WISHLIST_FIELDS}
		}
	}
`;

export const REMOVE_FROM_WISHLIST = gql`
	mutation RemoveFromWishlist($productId: Int!) {
		removeFromWishlist(productId: $productId) {
			${WISHLIST_FIELDS}
		}
	}
`;

/** REVIEW **/
export const CREATE_REVIEW = gql`
	mutation CreateReview($input: CreateReviewInput!) {
		createReview(input: $input) {
			id
			rating
			comment
			createdAt
			member {
				id
				firstName
				avatar
			}
		}
	}
`;

/** MEMBER **/
export const UPDATE_MY_PROFILE = gql`
	mutation UpdateMyProfile($input: MemberUpdateInput!) {
		updateMyProfile(input: $input) {
			id
			firstName
			lastName
			phone
			email
			avatar
			role
			isActive
		}
	}
`;

/** ADDRESS **/
const ADDRESS_FIELDS = `
	id
	recipientName
	phone
	addressLine1
	addressLine2
	city
	postalCode
	isDefault
`;

export const CREATE_ADDRESS = gql`
	mutation CreateAddress($input: CreateAddressInput!) {
		createAddress(input: $input) {
			${ADDRESS_FIELDS}
		}
	}
`;

export const UPDATE_ADDRESS = gql`
	mutation UpdateAddress($input: UpdateAddressInput!) {
		updateAddress(input: $input) {
			${ADDRESS_FIELDS}
		}
	}
`;

export const DELETE_ADDRESS = gql`
	mutation DeleteAddress($id: Int!) {
		deleteAddress(id: $id)
	}
`;

export const SET_DEFAULT_ADDRESS = gql`
	mutation SetDefaultAddress($id: Int!) {
		setDefaultAddress(id: $id) {
			${ADDRESS_FIELDS}
		}
	}
`;

/** ORDER **/
const ORDER_FIELDS = `
	id
	orderNumber
	status
	subtotal
	deliveryFee
	total
	currency
	paymentMethod
	notes
	createdAt
	items {
		id
		productId
		productName
		quantity
		price
		subtotal
	}
`;

export const CREATE_ORDER = gql`
	mutation CreateOrder($input: CreateOrderInput!) {
		createOrder(input: $input) {
			${ORDER_FIELDS}
		}
	}
`;

export const CANCEL_MY_ORDER = gql`
	mutation CancelMyOrder($id: Int!) {
		cancelMyOrder(id: $id) {
			${ORDER_FIELDS}
		}
	}
`;
