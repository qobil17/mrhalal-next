import { useMemo, useState } from 'react';
import type { NextPage } from 'next';
import { withLayoutHome } from '../../libs/components/layout/LayoutHome';
import ProductCard from '../../libs/components/products/ProductCard';
import ProductFilter, { initialProductFilters, ProductFilters } from '../../libs/components/products/ProductFilter';
import { ProductCard as ProductCardType } from '../../libs/types/product/product';

interface MockProduct extends ProductCardType {
	category: string;
}

const mockProducts: MockProduct[] = [
	{ _id: 'beef-1', productName: "Mol go'shti (Antrekot)", productUnit: 'KG', productPrice: 45000, productImage: '🥩', productLeftCount: 10, productStatus: 'ACTIVE', category: "Mol go'shti" },
	{ _id: 'beef-2', productName: "Mol go'shti (Filey)", productUnit: 'KG', productPrice: 62000, productImage: '🥩', productLeftCount: 10, productStatus: 'ACTIVE', category: "Mol go'shti" },
	{ _id: 'beef-3', productName: "Mol go'shti (Farsh)", productUnit: 'KG', productPrice: 38000, productImage: '🥩', productLeftCount: 10, productStatus: 'ACTIVE', category: "Mol go'shti" },

	{ _id: 'lamb-1', productName: "Qo'y go'shti (Koreyka)", productUnit: 'KG', productPrice: 58000, productImage: '🐑', productLeftCount: 10, productStatus: 'ACTIVE', category: "Qo'y go'shti" },
	{ _id: 'lamb-2', productName: "Qo'y go'shti (Oyoq)", productUnit: 'KG', productPrice: 49000, productImage: '🐑', productLeftCount: 10, productStatus: 'ACTIVE', category: "Qo'y go'shti" },
	{ _id: 'lamb-3', productName: "Qo'y go'shti (Qovurg'a)", productUnit: 'KG', productPrice: 53000, productImage: '🐑', productLeftCount: 10, productStatus: 'ACTIVE', category: "Qo'y go'shti" },

	{ _id: 'chicken-1', productName: "Tovuq go'shti (Butun)", productUnit: 'KG', productPrice: 22000, productImage: '🍗', productLeftCount: 10, productStatus: 'ACTIVE', category: 'Tovuq' },
	{ _id: 'chicken-2', productName: "Tovuq filesi (Ko'krak)", productUnit: 'KG', productPrice: 27000, productImage: '🍗', productLeftCount: 10, productStatus: 'ACTIVE', category: 'Tovuq' },
	{ _id: 'chicken-3', productName: 'Tovuq qanoti', productUnit: 'KG', productPrice: 19000, productImage: '🍗', productLeftCount: 10, productStatus: 'ACTIVE', category: 'Tovuq' },

	{ _id: 'grocery-1', productName: 'Guruch (Premium)', productUnit: 'KG', productPrice: 32000, productImage: '🛒', productLeftCount: 10, productStatus: 'ACTIVE', category: 'Oziq-ovqat' },
	{ _id: 'grocery-2', productName: 'Un (Premium)', productUnit: 'KG', productPrice: 18000, productImage: '🛒', productLeftCount: 10, productStatus: 'ACTIVE', category: 'Oziq-ovqat' },
	{ _id: 'grocery-3', productName: "O'simlik yog'i", productUnit: 'KG', productPrice: 24000, productImage: '🛒', productLeftCount: 10, productStatus: 'ACTIVE', category: 'Oziq-ovqat' },
];

const ProductsPage: NextPage = () => {
	const [filters, setFilters] = useState<ProductFilters>(initialProductFilters);

	const filteredProducts = useMemo(() => {
		const min = filters.minPrice ? Number(filters.minPrice) : null;
		const max = filters.maxPrice ? Number(filters.maxPrice) : null;

		return mockProducts.filter((product) => {
			if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
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
	}, [filters]);

	return (
		<div className="products-page">
			<div className="container">
				<div className="products-layout">
					<aside className="filter-aside">
						<ProductFilter onFilter={setFilters} />
					</aside>

					<main className="products-main">
						<div className="products-header">
							<h2>Mahsulotlar</h2>
							<span>{filteredProducts.length} ta mahsulot</span>
						</div>

						<div className="products-grid">
							{filteredProducts.map((product) => (
								<ProductCard key={product._id} product={product} />
							))}
						</div>
					</main>
				</div>
			</div>
		</div>
	);
};

export default withLayoutHome(ProductsPage);
