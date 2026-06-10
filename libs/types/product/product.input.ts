import { ProductUnit } from '../../enums/product.enum';

export interface ProductsInquiry {
	page: number;
	limit: number;
	search?: string;
	productUnit?: ProductUnit;
}
