export interface OrderItemInput {
	itemQuantity: number;
	productId: string;
}

export interface OrderInput {
	orderItems: OrderItemInput[];
}
