export interface OrderItem {
	id: string;
	productId: string;
	productName: string;
	quantity: number;
	price: number;
	subtotal: number;
}

export interface Order {
	id: string;
	orderNumber: string;
	status: string;
	subtotal: number;
	deliveryFee: number;
	total: number;
	currency: string;
	paymentMethod?: string;
	notes?: string;
	createdAt: string;
	items: OrderItem[];
}

export interface OrdersResponse {
	list: Order[];
	total: number;
}
