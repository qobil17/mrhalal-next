import { MemberRole, MemberStatus } from '../../enums/member.enum';

export interface Member {
	id: string;
	memberType: MemberRole;
	memberStatus: MemberStatus;
	memberPhone: string;
	memberFirstName?: string;
	memberLastName?: string;
	memberImage?: string;
	createdAt: Date;
	updatedAt: Date;
}
