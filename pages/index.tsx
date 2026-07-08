import { useState } from 'react';
import type { NextPage } from 'next';
import { useQuery, useReactiveVar } from '@apollo/client';
import { withLayoutHome } from '../libs/components/layout/LayoutHome';
import BannerSlider from '../libs/components/homepage/BannerSlider';
import CategoryScroll from '../libs/components/homepage/CategoryScroll';
import ProductCard from '../libs/components/products/ProductCard';
import { GET_ALL_PRODUCTS, GET_FEATURED_PRODUCTS } from '../apollo/user/query';
import { langVar, t } from '../libs/i18n';
import type { Product, ProductsResponse } from '../libs/types/product/product';

const SHOW_MORE_STEP = 4;
const INITIAL_VISIBLE = 8;

const HomePage: NextPage = () => {
	const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
	const lang = useReactiveVar(langVar);

	const { data: productsData, loading: productsLoading } = useQuery<{ getAllProducts: ProductsResponse }>(GET_ALL_PRODUCTS, {
		variables: { input: { page: 1, limit: visibleCount } },
	});

	const { data: featuredData, loading: featuredLoading } = useQuery<{ getFeaturedProducts: Product[] }>(GET_FEATURED_PRODUCTS);

	const allProducts = productsData?.getAllProducts?.list ?? [];
	const totalProducts = productsData?.getAllProducts?.total ?? 0;
	const featuredProducts = featuredData?.getFeaturedProducts ?? [];
	const newProducts = allProducts.slice(0, 8);

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
							<h2>{t('newProducts', lang)}</h2>
						</div>

						{productsLoading ? (
							<p className="loading-text">{t('loading', lang)}</p>
						) : (
							<div className="products-grid products-grid--4col">
								{newProducts.map((product) => (
									<ProductCard key={product.id} product={product} />
								))}
							</div>
						)}
					</section>
				</div>
			</div>

			<div className="frame-wrap frame-wrap--white">
				<div className="container">
					<section className="home-section">
						<div className="section-header">
							<h2>{t('featured', lang)}</h2>
						</div>

						{featuredLoading ? (
							<p className="loading-text">{t('loading', lang)}</p>
						) : (
							<div className="products-grid products-grid--4col">
								{featuredProducts.map((product) => (
									<ProductCard key={product.id} product={product} />
								))}
							</div>
						)}
					</section>
				</div>
			</div>

			<div className="frame-wrap">
				<div className="container">
					<section className="home-section">
						<div className="section-header">
							<h2>{t('allProducts', lang)}</h2>
						</div>

						{productsLoading ? (
							<p className="loading-text">{t('loading', lang)}</p>
						) : (
							<div className="products-grid products-grid--4col">
								{allProducts.map((product) => (
									<ProductCard key={product.id} product={product} />
								))}
							</div>
						)}

						{visibleCount < totalProducts && (
							<div className="show-more-wrap">
								<button type="button" className="show-more-btn" onClick={() => setVisibleCount((prev) => prev + SHOW_MORE_STEP)}>
									{t('showMore', lang)}
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
