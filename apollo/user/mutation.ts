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
