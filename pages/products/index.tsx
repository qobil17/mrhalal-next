import { useMemo, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { withLayoutHome } from '../../libs/components/layout/LayoutHome';
import CategoryScroll from '../../libs/components/homepage/CategoryScroll';
import ProductCard from '../../libs/components/products/ProductCard';
import ProductFilter, { initialProductFilters, ProductFilters } from '../../libs/components/products/ProductFilter';
import { mockProducts } from '../../libs/data/mockProducts';

const CATEGORY_SLUG_TO_NAME: Record<string, string> = {
	beef: "Mol go'shti",
	lamb: "Qo'y go'shti",
	chicken: 'Tovuq',
	fish: 'Baliq',
	grocery: 'Oziq-ovqat',
	spices: 'Ziravorlar',
};

const ProductsPage: NextPage = () => {
	const router = useRouter();
	const [filters, setFilters] = useState<ProductFilters>(initialProductFilters);
	const [visibleCount, setVisibleCount] = useState(8);

	const handleFilter = (next: ProductFilters) => {
		setFilters(next);
		setVisibleCount(8);
	};

	const categorySlug = typeof router.query.category === 'string' ? router.query.category : '';
	const activeCategory = CATEGORY_SLUG_TO_NAME[categorySlug];

	const filteredProducts = useMemo(() => {
		const min = filters.minPrice ? Number(filters.minPrice) : null;
		const max = filters.maxPrice ? Number(filters.maxPrice) : null;
		const categories = filters.categories.length > 0 ? filters.categories : activeCategory ? [activeCategory] : [];

		return mockProducts.filter((product) => {
			if (categories.length > 0 && !categories.includes(product.category)) {
				return false;
			}

			if (filters.units.length > 0 && !filters.units.includes(product.productUnit)) {
				return false;
			}

			if (min !== null && product.productPrice < min) {
				return false;
			}

			if (max !== null && product.productPrice > max) {
				return false;
			}

			return true;
		});
	}, [filters, activeCategory]);

	return (
		<div className="products-page">
			<div className="container">
				<CategoryScroll />

				<div className="products-layout">
					<aside className="filter-aside">
						<ProductFilter onFilter={handleFilter} />
					</aside>

					<main className="products-main">
						<div className="products-header">
							<h2>Mahsulotlar</h2>
							<span>{filteredProducts.length} ta mahsulot</span>
						</div>

						<div className="products-grid">
							{filteredProducts.slice(0, visibleCount).map((product) => (
								<ProductCard key={product._id} product={product} />
							))}
						</div>

						<div className="show-more-wrap">
							{visibleCount < filteredProducts.length && (
								<button type="button" className="show-more-btn" onClick={() => setVisibleCount((prev) => prev + 8)}>
									Ko&apos;proq ko&apos;rish
								</button>
							)}
						</div>
					</main>
				</div>
			</div>
		</div>
	);
};

export default withLayoutHome(ProductsPage);
