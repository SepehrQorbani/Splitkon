import { ROLES } from "@/constants/roles";
import { Member, MemberInput } from "@/types";

export function hasRole(
    role: keyof typeof ROLES,
    member: Member | MemberInput
) {
    const roleBit = ROLES[role];
    return (+(member?.role ?? 0) & roleBit) === roleBit;
}
