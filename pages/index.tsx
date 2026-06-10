import { useState } from 'react';
import type { NextPage } from 'next';
import { withLayoutHome } from '../libs/components/layout/LayoutHome';
import BannerSlider from '../libs/components/homepage/BannerSlider';
import CategoryScroll from '../libs/components/homepage/CategoryScroll';
import ProductCard from '../libs/components/products/ProductCard';
import { mockProducts } from '../libs/data/mockProducts';

const SHOW_MORE_STEP = 4;

const newProducts = mockProducts.slice(0, 8);
const recommendedProducts = mockProducts.slice(0, 8).reverse();
const allProducts = mockProducts;

const HomePage: NextPage = () => {
	const [visibleCount, setVisibleCount] = useState(8);

	const visibleProducts = allProducts.slice(0, visibleCount);

	return (
		<>
			<BannerSlider />

			<div className="category-section-wrap">
				<div className="container">
					<CategoryScroll />
				</div>
			</div>

			<div className="frame-wrap">
				<div className="container">
					<section className="home-section">
						<div className="section-header">
							<h2>Yangi mahsulotlar</h2>
						</div>

						<div className="products-grid products-grid--4col">
							{newProducts.map((product) => (
								<ProductCard key={product._id} product={product} />
							))}
						</div>
					</section>
				</div>
			</div>

			<div className="frame-wrap frame-wrap--white">
				<div className="container">
					<section className="home-section">
						<div className="section-header">
							<h2>Tavsiya etiladi</h2>
						</div>

						<div className="products-grid products-grid--4col">
							{recommendedProducts.map((product) => (
								<ProductCard key={product._id} product={product} />
							))}
						</div>
					</section>
				</div>
			</div>

			<div className="frame-wrap">
				<div className="container">
					<section className="home-section">
						<div className="section-header">
							<h2>Barcha mahsulotlar</h2>
						</div>

						<div className="products-grid products-grid--4col">
							{visibleProducts.map((product) => (
								<ProductCard key={product._id} product={product} />
							))}
						</div>

						{visibleCount < allProducts.length && (
							<div className="show-more-wrap">
								<button type="button" className="show-more-btn" onClick={() => setVisibleCount((prev) => prev + SHOW_MORE_STEP)}>
									Ko&apos;proq ko&apos;rish
								</button>
							</div>
						)}
					</section>
				</div>
			</div>
		</>
	);
};

export default withLayoutHome(HomePage);
