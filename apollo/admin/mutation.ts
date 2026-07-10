import { gql } from '@apollo/client';

/** PRODUCT **/
export const CREATE_PRODUCT_BY_ADMIN = gql`
	mutation CreateProductByAdmin($input: CreateProductInput!) {
		createProductByAdmin(input: $input) {
			id
		}
	}
`;

export const UPDATE_PRODUCT_BY_ADMIN = gql`
	mutation UpdateProductByAdmin($input: UpdateProductInput!) {
		updateProductByAdmin(input: $input) {
			id
			label
			images {
				id
				url
				isPrimary
			}
		}
	}
`;

export const DELETE_PRODUCT_BY_ADMIN = gql`
	mutation DeleteProductByAdmin($id: Int!) {
		deleteProductByAdmin(id: $id)
	}
`;

/** CATEGORY **/
export const CREATE_CATEGORY_BY_ADMIN = gql`
	mutation CreateCategoryByAdmin($input: CreateCategoryInput!) {
		createCategoryByAdmin(input: $input) {
			id
		}
	}
`;

export const UPDATE_CATEGORY_BY_ADMIN = gql`
	mutation UpdateCategoryByAdmin($input: UpdateCategoryInput!) {
		updateCategoryByAdmin(input: $input) {
			id
		}
	}
`;

export const DELETE_CATEGORY_BY_ADMIN = gql`
	mutation DeleteCategoryByAdmin($id: Int!) {
		deleteCategoryByAdmin(id: $id)
	}
`;

/** ORDER **/
export const UPDATE_ORDER_STATUS_BY_ADMIN = gql`
	mutation UpdateOrderStatusByAdmin($input: UpdateOrderStatusInput!) {
		updateOrderStatusByAdmin(input: $input) {
			id
			status
		}
	}
`;

/** MEMBER **/
export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin($input: MemberByAdminUpdate!) {
		updateMemberByAdmin(input: $input) {
			id
			role
			isActive
		}
	}
`;

export const DELETE_MEMBER_BY_ADMIN = gql`
	mutation DeleteMemberByAdmin($id: Int!) {
		deleteMemberByAdmin(id: $id)
	}
`;
