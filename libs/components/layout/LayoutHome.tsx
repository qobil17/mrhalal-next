import { ReactNode } from 'react';
import type { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
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
				<div className="container page-content">{children}</div>
				<Footer />
			</div>
		);
	}

	return (
		<div id="pc-wrap">
			<Top />
			<div className="container page-content">{children}</div>
			<Footer />
		</div>
	);
};

export const withLayoutHome = <P extends object>(Component: NextPage<P>): NextPage<P> => {
	const WithLayoutHome: NextPage<P> = (props) => (
		<LayoutHome>
			<Component {...props} />
		</LayoutHome>
	);

	WithLayoutHome.displayName = `withLayoutHome(${Component.displayName ?? Component.name ?? 'Component'})`;

	return WithLayoutHome;
};

export default LayoutHome;
