import { ReactNode } from 'react';
import type { NextPage } from 'next';
import { useReactiveVar } from '@apollo/client';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { langVar, t, type TranslationKey } from '../../i18n';
import PageHead from '../common/PageHead';
import Top from './Top';
import Footer from './Footer';

interface LayoutHomeProps {
	children: ReactNode;
}

const LayoutHome = ({ children }: LayoutHomeProps) => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<div id="mobile-wrap">
				<Top />
				{children}
				<Footer />
			</div>
		);
	}

	return (
		<div id="pc-wrap">
			<Top />
			{children}
			<Footer />
		</div>
	);
};

// `titleKey` sets the page's <title>; pages with a dynamic title (e.g. a product
// name) can render their own <PageHead>, which overrides this one.
export const withLayoutHome = <P extends object>(Component: NextPage<P>, titleKey?: TranslationKey): NextPage<P> => {
	const WithLayoutHome: NextPage<P> = (props) => {
		const lang = useReactiveVar(langVar);

		return (
			<>
				<PageHead title={titleKey ? t(titleKey, lang) : undefined} />
				<LayoutHome>
					<Component {...props} />
				</LayoutHome>
			</>
		);
	};

	WithLayoutHome.displayName = `withLayoutHome(${Component.displayName ?? Component.name ?? 'Component'})`;

	return WithLayoutHome;
};

export default LayoutHome;
