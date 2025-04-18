import { Member, MemberInput } from "@/types/schemas/members";

export type MemberRequest = MemberInput;
export type MemberResponse = { data: Member };
export type MembersResponse = { data: Member[] };
