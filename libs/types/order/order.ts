import { OrderStatus } from '../../enums/order.enum';
import { Product } from '../product/product';

export interface OrderItem {
	id: string;
	itemQuantity: number;
	itemPrice: number;
	productId: string;
	product?: Product;
}

export interface Order {
	id: string;
	orderStatus: OrderStatus;
	orderTotal: number;
	orderDeliveryFee: number;
	createdAt: Date;
	orderItems: OrderItem[];
}
