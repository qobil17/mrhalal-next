import type { NextPage } from 'next';
import { withLayoutHome } from '../libs/components/layout/LayoutHome';

const HomePage: NextPage = () => {
	return (
		<main>
			<h1>Hello, Mr. Halal!</h1>
		</main>
	);
};

export default withLayoutHome(HomePage);
