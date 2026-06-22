import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import { ApolloProvider } from '@apollo/client';
import { apolloClient, authReadyVar } from '../apollo/client';
import { getJwtToken, updateUserInfo } from '../libs/auth';
import { initLangFromStorage } from '../libs/i18n';
import ErrorBoundary from '../libs/components/common/ErrorBoundary';
import NetworkErrorToast from '../libs/components/common/NetworkErrorToast';
import '../scss/app.scss';

type AppPropsWithLayout = AppProps & {
	Component: NextPage;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
	useEffect(() => {
		const token = getJwtToken();
		if (token) updateUserInfo(token);

		initLangFromStorage();

		// Session rehydration attempt is complete (success or not) - auth-dependent
		// guards can now safely distinguish "logged out" from "still loading".
		authReadyVar(true);
	}, []);

	return (
		<ApolloProvider client={apolloClient}>
			<ErrorBoundary>
				<NetworkErrorToast />
				<Component {...pageProps} />
			</ErrorBoundary>
		</ApolloProvider>
	);
}
