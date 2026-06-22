import { ApolloClient, InMemoryCache, createHttpLink, from, makeVar } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/link-context';
import { getJwtToken, removeJwtToken } from '../libs/auth';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const userVar = makeVar<any>(null);
export const networkErrorVar = makeVar<string | null>(null);

// Stays false until the app has attempted to rehydrate the session from
// localStorage (see pages/_app.tsx). Auth-dependent guards/UI must wait for
// this to become true before treating `userVar === null` as "logged out" —
// otherwise they race the rehydration and flash/redirect incorrectly.
export const authReadyVar = makeVar<boolean>(false);

const httpLink = createHttpLink({
	uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/graphql',
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
		for (const { message, locations, path, extensions } of graphQLErrors) {
			console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);

			if (extensions?.code === 'UNAUTHENTICATED' && getJwtToken()) {
				removeJwtToken();
				userVar(null);
				if (typeof window !== 'undefined') window.location.href = '/auth';
			}
		}
	}

	if (networkError) {
		console.error(`[Network error]: ${networkError}`);
		networkErrorVar("Serverga ulanib bo'lmadi. Internet aloqasini tekshiring yoki birozdan so'ng qayta urinib ko'ring.");
	}
});

export const apolloClient = new ApolloClient({
	link: from([errorLink, authLink, httpLink]),
	cache: new InMemoryCache(),
});
