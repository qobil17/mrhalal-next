export interface Category {
	id: string;
	nameUz: string;
	nameKo: string;
	nameEn: string;
	nameAr?: string;
	slug: string;
	image?: string;
	isActive: boolean;
	sortOrder: number;
}
