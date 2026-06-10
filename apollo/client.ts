import { ApolloClient, InMemoryCache, createHttpLink, from, makeVar } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/link-context';
import { getJwtToken } from '../libs/auth';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const userVar = makeVar<any>(null);

const httpLink = createHttpLink({
	uri: 'http://localhost:3000/graphql',
});

const authLink = setContext((_, { headers }) => {
	const token = getJwtToken();

	return {
		headers: {
			...headers,
			...(token && { Authorization: `Bearer ${token}` }),
		},
	};
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		graphQLErrors.forEach(({ message, locations, path }) =>
			console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
		);
	}

	if (networkError) {
		console.error(`[Network error]: ${networkError}`);
	}
});

export const apolloClient = new ApolloClient({
	link: from([errorLink, authLink, httpLink]),
	cache: new InMemoryCache(),
});
