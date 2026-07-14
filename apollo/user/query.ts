import { gql } from '@apollo/client';

/** MEMBER **/
export const GET_MY_PROFILE = gql`
	query GetMyProfile {
		getMyProfile {
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

/** PRODUCT **/
export const GET_ALL_PRODUCTS = gql`
	query GetAllProducts($input: ProductsInquiry!) {
		getAllProducts(input: $input) {
			list {
				id
				nameUz
				nameKo
				nameEn
				price
				comparePrice
				unit
				stockQuantity
				slug
				isActive
				soldCount
				averageRating
				reviewCount
				images {
					id
					url
					isPrimary
				}
				categoryId
			}
			total
			page
			limit
		}
	}
`;

export const GET_FEATURED_PRODUCTS = gql`
	query GetFeaturedProducts {
		getFeaturedProducts {
			id
			nameUz
			nameKo
			nameEn
			price
			comparePrice
			unit
			stockQuantity
			slug
			isActive
			soldCount
			averageRating
			reviewCount
			images {
				id
				url
				isPrimary
			}
			categoryId
		}
	}
`;

export const GET_DISCOUNTED_PRODUCTS = gql`
	query GetDiscountedProducts {
		getDiscountedProducts {
			id
			nameUz
			nameKo
			nameEn
			price
			comparePrice
			unit
			stockQuantity
			slug
			isActive
			soldCount
			averageRating
			reviewCount
			images {
				id
				url
				isPrimary
			}
			categoryId
		}
	}
`;

export const GET_PRODUCT_BY_SLUG = gql`
	query GetProductBySlug($slug: String!) {
		getProductBySlug(slug: $slug) {
			id
			nameUz
			nameKo
			nameEn
			nameAr
			slug
			price
			comparePrice
			unit
			stockQuantity
			images {
				id
				url
				isPrimary
			}
			categoryId
			isActive
			soldCount
			viewCount
			averageRating
			reviewCount
			descriptionUz
			descriptionKo
			createdAt
		}
	}
`;

/** CATEGORY **/
export const GET_ALL_CATEGORIES = gql`
	query GetAllCategories {
		getAllCategories {
			id
			nameUz
			nameKo
			nameEn
			slug
			image
			isActive
			sortOrder
		}
	}
`;

/** CART **/
export const GET_MY_CART = gql`
	query GetMyCart {
		getMyCart {
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
		}
	}
`;

/** ORDER **/
export const GET_MY_ORDERS = gql`
	query GetMyOrders($input: OrdersInquiry!) {
		getMyOrders(input: $input) {
			list {
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
			}
			total
		}
	}
`;

/** REVIEW **/
export const GET_PRODUCT_REVIEWS = gql`
	query GetProductReviews($productId: Int!, $input: ReviewsInquiry!) {
		getProductReviews(productId: $productId, input: $input) {
			list {
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
			total
		}
	}
`;

/** ADDRESS **/
export const GET_MY_ADDRESSES = gql`
	query GetMyAddresses {
		getMyAddresses {
			id
			recipientName
			phone
			addressLine1
			addressLine2
			city
			postalCode
			isDefault
		}
	}
`;

/** WISHLIST **/
export const GET_MY_WISHLIST = gql`
	query GetMyWishlist {
		getMyWishlist {
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
		}
	}
`;
