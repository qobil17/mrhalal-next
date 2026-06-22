import { useMemo, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { withLayoutHome } from '../../libs/components/layout/LayoutHome';
import CategoryScroll from '../../libs/components/homepage/CategoryScroll';
import ProductCard from '../../libs/components/products/ProductCard';
import ProductFilter, { initialProductFilters, ProductFilters } from '../../libs/components/products/ProductFilter';
import { GET_ALL_PRODUCTS, GET_ALL_CATEGORIES } from '../../apollo/user/query';
import type { Product, ProductsResponse } from '../../libs/types/product/product';
import type { Category } from '../../libs/types/category/category';

const PAGE_SIZE = 12;

const ProductsPage: NextPage = () => {
	const router = useRouter();
	const [filters, setFilters] = useState<ProductFilters>(initialProductFilters);
	const [limit, setLimit] = useState(PAGE_SIZE);

	const { data: categoriesData } = useQuery<{ getAllCategories: Category[] }>(GET_ALL_CATEGORIES);
	const categories = useMemo(() => categoriesData?.getAllCategories ?? [], [categoriesData]);

	const categorySlug = typeof router.query.category === 'string' ? router.query.category : '';

	const urlCategoryId = useMemo(() => {
		if (!categorySlug) {
			return undefined;
		}

		const matched = categories.find((category) => category.slug === categorySlug);
		return matched ? Number(matched.id) : undefined;
	}, [categorySlug, categories]);

	const categoryId = filters.categoryId ?? urlCategoryId;

	const handleFilter = (next: ProductFilters) => {
		setFilters(next);
		setLimit(PAGE_SIZE);
	};

	const { data: productsData, loading } = useQuery<{ getAllProducts: ProductsResponse }>(GET_ALL_PRODUCTS, {
		variables: {
			input: {
				page: 1,
				limit,
				...(categoryId !== undefined && { categoryId }),
				...(filters.minPrice && { minPrice: Number(filters.minPrice) }),
				...(filters.maxPrice && { maxPrice: Number(filters.maxPrice) }),
				...(filters.search && { search: filters.search }),
			},
		},
	});

	const products: Product[] = productsData?.getAllProducts?.list ?? [];
	const total = productsData?.getAllProducts?.total ?? 0;

	return (
		<div className="products-page">
			<div className="container">
				<CategoryScroll categories={categories} />

				<div className="products-layout">
					<aside className="filter-aside">
						<ProductFilter categories={categories} onFilter={handleFilter} />
					</aside>

					<main className="products-main">
						<div className="products-header">
							<h2>Mahsulotlar</h2>
							<span>{total} ta mahsulot</span>
						</div>

						{loading ? (
							<p className="loading-text">Yuklanmoqda...</p>
						) : (
							<div className="products-grid">
								{products.map((product) => (
									<ProductCard key={product.id} product={product} />
								))}
							</div>
						)}

						{!loading && limit < total && (
							<div className="show-more-wrap">
								<button type="button" className="show-more-btn" onClick={() => setLimit((prev) => prev + PAGE_SIZE)}>
									Ko&apos;proq ko&apos;rish
								</button>
							</div>
						)}
					</main>
				</div>
			</div>
		</div>
	);
};

export default withLayoutHome(ProductsPage);
