export interface WishlistItem {
	id: string;
	productId: string;
	createdAt: string;
	product: {
		id: string;
		nameUz: string;
		nameKo: string;
		price: number;
		unit: string;
		slug: string;
		stockQuantity: number;
		images: { url: string; isPrimary: boolean }[];
	};
}
