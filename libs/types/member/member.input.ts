export interface LoginInput {
	phone: string;
	password: string;
}

export interface RegisterInput {
	firstName: string;
	lastName?: string;
	phone: string;
	password: string;
	email?: string;
}
