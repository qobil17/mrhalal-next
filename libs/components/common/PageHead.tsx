import Head from 'next/head';
import { useReactiveVar } from '@apollo/client';
import { langVar, t } from '../../i18n';

const SITE_NAME = 'Mr. Halal';

interface PageHeadProps {
	title?: string;
	noIndex?: boolean;
}

// Next.js dedupes <title> automatically and <meta> by `key`, so a page can render
// its own PageHead (e.g. with a product name) to override the layout's default.
const PageHead = ({ title, noIndex = false }: PageHeadProps) => {
	const lang = useReactiveVar(langVar);

	return (
		<Head>
			<title>{title ? `${title} | ${SITE_NAME}` : SITE_NAME}</title>
			<meta name="description" content={t('tagline', lang)} key="description" />
			{noIndex && <meta name="robots" content="noindex, nofollow" key="robots" />}
		</Head>
	);
};

export default PageHead;
