import type { NextPage } from 'next';
import { withLayoutHome } from '../libs/components/layout/LayoutHome';

const HomePage: NextPage = () => {
	return (
		<section className="hero">
			<h1>Koreyadagi halol go&apos;sht do&apos;koni</h1>
			<p>Beef · Lamb · Chicken — fresh &amp; certified halal</p>
			<a href="/products" className="hero-btn">
				Mahsulotlarni ko&apos;rish
			</a>
		</section>
	);
};

export default withLayoutHome(HomePage);
