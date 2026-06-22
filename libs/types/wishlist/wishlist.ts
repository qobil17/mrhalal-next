export interface WishlistItem {
	id: string;
	productId: number;
	createdAt: string;
	product: {
		id: string;
		nameUz: string;
		nameKo: string;
		nameEn?: string;
		price: number;
		unit: string;
		slug: string;
		stockQuantity: number;
		images: { url: string; isPrimary: boolean }[];
	};
}
