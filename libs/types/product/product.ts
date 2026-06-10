import { ProductUnit, ProductStatus } from '../../enums/product.enum';

export interface Product {
	id: string;
	productName: string;
	productUnit: ProductUnit;
	productPrice: number;
	productImage: string;
	productDesc?: string;
	productStatus: ProductStatus;
	productLeftCount: number;
	createdAt: Date;
}

export interface ProductCard {
	_id: string;
	productName: string;
	productUnit: string;
	productPrice: number;
	productImage: string;
	productLeftCount: number;
	productStatus: string;
}
