export interface Address {
	id: string;
	recipientName: string;
	phone: string;
	addressLine1: string;
	addressLine2?: string;
	city: string;
	postalCode: string;
	isDefault: boolean;
}
