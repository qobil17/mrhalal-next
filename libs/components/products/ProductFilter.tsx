import { useState } from 'react';
import { Category } from '../../types/category/category';

export interface ProductFilters {
	categoryId?: number;
	unit?: string;
	minPrice: string;
	maxPrice: string;
	search: string;
}

interface ProductFilterProps {
	categories: Category[];
	onFilter: (filters: ProductFilters) => void;
}

const UNITS = ['KG', 'G', 'L', 'ML', 'PIECE'];

export const initialProductFilters: ProductFilters = {
	categoryId: undefined,
	unit: undefined,
	minPrice: '',
	maxPrice: '',
	search: '',
};

const ProductFilter = ({ categories, onFilter }: ProductFilterProps) => {
	const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
	const [unit, setUnit] = useState<string | undefined>(undefined);
	const [minPrice, setMinPrice] = useState('');
	const [maxPrice, setMaxPrice] = useState('');
	const [search, setSearch] = useState('');

	const selectCategory = (id: number | undefined) => {
		setCategoryId(id);
		onFilter({ categoryId: id, unit, minPrice, maxPrice, search });
	};

	const selectUnit = (value: string | undefined) => {
		setUnit(value);
		onFilter({ categoryId, unit: value, minPrice, maxPrice, search });
	};

	const handleMinPrice = (value: string) => {
		setMinPrice(value);
		onFilter({ categoryId, unit, minPrice: value, maxPrice, search });
	};

	const handleMaxPrice = (value: string) => {
		setMaxPrice(value);
		onFilter({ categoryId, unit, minPrice, maxPrice: value, search });
	};

	const handleSearch = (value: string) => {
		setSearch(value);
		onFilter({ categoryId, unit, minPrice, maxPrice, search: value });
	};

	const handleClear = () => {
		setCategoryId(undefined);
		setUnit(undefined);
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

			<h4>Birlik</h4>
			<label className="filter-item">
				<input type="radio" name="unit" checked={unit === undefined} onChange={() => selectUnit(undefined)} />
				Barchasi
			</label>
			{UNITS.map((unitOption) => (
				<label key={unitOption} className="filter-item">
					<input type="radio" name="unit" checked={unit === unitOption} onChange={() => selectUnit(unitOption)} />
					{unitOption}
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
