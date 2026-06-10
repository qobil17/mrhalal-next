import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '../apollo/client';
import '../scss/app.scss';

type AppPropsWithLayout = AppProps & {
	Component: NextPage;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
	return (
		<ApolloProvider client={apolloClient}>
			<Component {...pageProps} />
		</ApolloProvider>
	);
}
