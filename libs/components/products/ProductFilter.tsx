import { useState } from 'react';
import { ProductUnit } from '../../enums/product.enum';

export interface ProductFilters {
	categories: string[];
	units: string[];
	minPrice: string;
	maxPrice: string;
}

interface ProductFilterProps {
	onFilter: (filters: ProductFilters) => void;
}

const CATEGORIES = ["Mol go'shti", "Qo'y go'shti", 'Tovuq', 'Baliq', 'Oziq-ovqat', 'Ziravorlar'];
const UNITS = Object.values(ProductUnit);

export const initialProductFilters: ProductFilters = {
	categories: [],
	units: [],
	minPrice: '',
	maxPrice: '',
};

const ProductFilter = ({ onFilter }: ProductFilterProps) => {
	const [categories, setCategories] = useState<string[]>([]);
	const [units, setUnits] = useState<string[]>([]);
	const [minPrice, setMinPrice] = useState('');
	const [maxPrice, setMaxPrice] = useState('');

	const toggleCategory = (category: string) => {
		const next = categories.includes(category) ? categories.filter((item) => item !== category) : [...categories, category];

		setCategories(next);
		onFilter({ categories: next, units, minPrice, maxPrice });
	};

	const toggleUnit = (unit: string) => {
		const next = units.includes(unit) ? units.filter((item) => item !== unit) : [...units, unit];

		setUnits(next);
		onFilter({ categories, units: next, minPrice, maxPrice });
	};

	const handleMinPrice = (value: string) => {
		setMinPrice(value);
		onFilter({ categories, units, minPrice: value, maxPrice });
	};

	const handleMaxPrice = (value: string) => {
		setMaxPrice(value);
		onFilter({ categories, units, minPrice, maxPrice: value });
	};

	const handleClear = () => {
		setCategories([]);
		setUnits([]);
		setMinPrice('');
		setMaxPrice('');
		onFilter(initialProductFilters);
	};

	return (
		<div className="product-filter">
			<h4>Kategoriya</h4>
			{CATEGORIES.map((category) => (
				<label key={category} className="filter-item">
					<input type="checkbox" checked={categories.includes(category)} onChange={() => toggleCategory(category)} />
					{category}
				</label>
			))}

			<h4>Birlik</h4>
			{UNITS.map((unit) => (
				<label key={unit} className="filter-item">
					<input type="checkbox" checked={units.includes(unit)} onChange={() => toggleUnit(unit)} />
					{unit}
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
