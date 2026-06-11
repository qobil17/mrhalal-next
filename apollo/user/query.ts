import { gql } from '@apollo/client';

/** MEMBER **/
export const GET_MY_INFO = gql`
	query GetMyInfo {
		getMyInfo {
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
