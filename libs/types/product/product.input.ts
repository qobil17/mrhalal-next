export interface ProductsInquiry {
	page: number;
	limit: number;
	search?: string;
	categoryId?: number;
	minPrice?: number;
	maxPrice?: number;
}
