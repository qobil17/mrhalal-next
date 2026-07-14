import { gql } from '@apollo/client';

export const GET_ALL_PRODUCTS_BY_ADMIN = gql`
	query GetAllProductsByAdmin($input: ProductsInquiry!) {
		getAllProductsByAdmin(input: $input) {
			list {
				id
				nameUz
				nameKo
				nameEn
				categoryId
				price
				unit
				stockQuantity
				isActive
				label
				expiryDate
				images {
					id
					url
					isPrimary
				}
			}
			total
			page
			limit
		}
	}
`;

export const GET_EXPIRING_PRODUCTS = gql`
	query GetExpiringProducts {
		getExpiringProducts {
			id
			nameUz
			nameKo
			nameEn
			price
			expiryDate
		}
	}
`;

export const GET_ALL_CATEGORIES_BY_ADMIN = gql`
	query GetAllCategoriesByAdmin($input: CategoriesInquiry!) {
		getAllCategoriesByAdmin(input: $input) {
			list {
				id
				nameUz
				nameKo
				nameEn
				nameAr
				slug
				image
				sortOrder
				isActive
			}
			total
			page
			limit
		}
	}
`;

export const GET_ALL_ORDERS_BY_ADMIN = gql`
	query GetAllOrdersByAdmin($input: OrdersInquiry!) {
		getAllOrdersByAdmin(input: $input) {
			list {
				id
				orderNumber
				status
				total
				currency
				createdAt
				items {
					id
					productName
					quantity
				}
			}
			total
		}
	}
`;

export const GET_ALL_MEMBERS_BY_ADMIN = gql`
	query GetAllMembersByAdmin($input: MembersInquiry!) {
		getAllMembersByAdmin(input: $input) {
			list {
				id
				firstName
				lastName
				phone
				email
				role
				isActive
				createdAt
			}
			total
			page
			limit
		}
	}
`;
