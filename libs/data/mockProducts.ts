import { ProductCard as ProductCardType } from '../types/product/product';

export interface MockProduct extends ProductCardType {
	category: string;
}

export const mockProducts: MockProduct[] = [
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
