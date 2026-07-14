export interface Banner {
	id: string;
	title: string;
	imageUrl: string;
	sortOrder: number;
	isActive: boolean;
}

export interface BannersResponse {
	list: Banner[];
	total: number;
	page: number;
	limit: number;
}
