export interface ProductImage {
	id: string;
	url: string;
	isPrimary: boolean;
}

export interface Product {
	id: string;
	nameUz: string;
	nameKo: string;
	nameEn: string;
	nameAr: string;
	slug: string;
	price: number;
	comparePrice?: number;
	unit: string;
	stockQuantity: number;
	images: ProductImage[];
	categoryId: number;
	isActive: boolean;
	label?: 'RECOMMENDED' | 'DISCOUNT' | null;
	expiryDate?: string | null;
	soldCount: number;
	viewCount: number;
	averageRating: number;
	reviewCount: number;
	descriptionUz?: string;
	descriptionKo?: string;
	createdAt: string;
}

export interface ProductsResponse {
	list: Product[];
	total: number;
	page: number;
	limit: number;
}
