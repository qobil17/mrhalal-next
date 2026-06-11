export interface Member {
	id: string;
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	avatar: string;
	role: string;
	isActive: boolean;
}

export interface AuthPayload {
	accessToken: string;
	member: Member;
}
