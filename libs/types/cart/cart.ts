export interface CartItem {
	id: string;
	quantity: number;
	subtotal: number;
	product: {
		id: string;
		nameUz: string;
		nameKo: string;
		price: number;
		unit: string;
		images: { url: string; isPrimary: boolean }[];
	};
}

export interface Cart {
	id: string;
	total: number;
	itemCount: number;
	currency: string;
	items: CartItem[];
}
