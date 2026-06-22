import { useState } from 'react';
import { Category } from '../../types/category/category';

export interface ProductFilters {
	categoryId?: number;
	minPrice: string;
	maxPrice: string;
	search: string;
}

interface ProductFilterProps {
	categories: Category[];
	onFilter: (filters: ProductFilters) => void;
}

export const initialProductFilters: ProductFilters = {
	categoryId: undefined,
	minPrice: '',
	maxPrice: '',
	search: '',
};

const ProductFilter = ({ categories, onFilter }: ProductFilterProps) => {
	const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
	const [minPrice, setMinPrice] = useState('');
	const [maxPrice, setMaxPrice] = useState('');
	const [search, setSearch] = useState('');

	const selectCategory = (id: number | undefined) => {
		setCategoryId(id);
		onFilter({ categoryId: id, minPrice, maxPrice, search });
	};

	const handleMinPrice = (value: string) => {
		setMinPrice(value);
		onFilter({ categoryId, minPrice: value, maxPrice, search });
	};

	const handleMaxPrice = (value: string) => {
		setMaxPrice(value);
		onFilter({ categoryId, minPrice, maxPrice: value, search });
	};

	const handleSearch = (value: string) => {
		setSearch(value);
		onFilter({ categoryId, minPrice, maxPrice, search: value });
	};

	const handleClear = () => {
		setCategoryId(undefined);
		setMinPrice('');
		setMaxPrice('');
		setSearch('');
		onFilter(initialProductFilters);
	};

	return (
		<div className="product-filter">
			<h4>Qidiruv</h4>
			<input
				type="text"
				className="filter-search"
				placeholder="Mahsulot qidirish..."
				value={search}
				onChange={(e) => handleSearch(e.target.value)}
			/>

			<h4>Kategoriya</h4>
			<label className="filter-item">
				<input type="radio" name="category" checked={categoryId === undefined} onChange={() => selectCategory(undefined)} />
				Barchasi
			</label>
			{categories.map((category) => (
				<label key={category.id} className="filter-item">
					<input
						type="radio"
						name="category"
						checked={categoryId === Number(category.id)}
						onChange={() => selectCategory(Number(category.id))}
					/>
					{category.nameUz}
				</label>
			))}

			<h4>Narx</h4>
			<div className="price-inputs">
				<input
					type="number"
					className="price-input"
					placeholder="Min ₩"
					value={minPrice}
					onChange={(e) => handleMinPrice(e.target.value)}
				/>
				<span>-</span>
				<input
					type="number"
					className="price-input"
					placeholder="Max ₩"
					value={maxPrice}
					onChange={(e) => handleMaxPrice(e.target.value)}
				/>
			</div>

			<button type="button" className="filter-clear-btn" onClick={handleClear}>
				Filterni tozalash
			</button>
		</div>
	);
};

export default ProductFilter;
