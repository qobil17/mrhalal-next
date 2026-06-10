import type { NextPage } from 'next';
import { withLayoutHome } from '../libs/components/layout/LayoutHome';
import BannerSlider from '../libs/components/homepage/BannerSlider';
import CategoryScroll from '../libs/components/homepage/CategoryScroll';

const HomePage: NextPage = () => {
	return (
		<>
			<BannerSlider />
			<div className="container">
				<CategoryScroll />
			</div>
		</>
	);
};

export default withLayoutHome(HomePage);
