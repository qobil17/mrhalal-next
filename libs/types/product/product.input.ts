export interface ProductsInquiry {
	page: number;
	limit: number;
	search?: string;
	categoryId?: number;
	unit?: string;
	minPrice?: number;
	maxPrice?: number;
}
