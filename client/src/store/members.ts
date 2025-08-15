import { Member, Members } from "@/types/schemas/members";
import { create } from "zustand";

interface MemberStore {
    members: Members;
    setMembers: (members: Members) => void;
    addMember: (member: Member) => void;
    getMember: (id: number) => Member | undefined;
    updateMember: (updatedMember: Partial<Member> & { id: number }) => void;
    updateMembers: (
        updatedMembers: (Partial<Member> & { id: number })[]
    ) => void;
    deleteMember: (id: number) => void;
}

export const useMemberStore = create<MemberStore>((set, get) => ({
    members: [],
    setMembers: (members: Members) =>
        set({
            members: members.map((member) => ({
                ...member,
                status: computeMemberStatus(member),
            })),
        }),
    addMember: (member: Member) =>
        set((state) => ({
            members: [
                ...state.members,
                { ...member, status: computeMemberStatus(member) },
            ],
        })),
    getMember: (id: number) => get().members.find((member) => member.id === id),
    updateMember: (updatedMember: Partial<Member> & { id: number }) =>
        set((state) => ({
            members: state.members.map((member) =>
                member.id === updatedMember.id
                    ? {
                          ...member,
                          ...updatedMember,
                          status: computeMemberStatus({
                              ...member,
                              ...updatedMember,
                          }),
                      }
                    : member
            ),
        })),
    updateMembers: (updatedMembers: (Partial<Member> & { id: number })[]) =>
        set((state) => ({
            members: state.members.map((member) => {
                const update = updatedMembers.find((u) => u.id === member.id);
                return update
                    ? {
                          ...member,
                          ...update,
                          status: computeMemberStatus({
                              ...member,
                              ...update,
                          }),
                      }
                    : member;
            }),
        })),
    deleteMember: (id: number) =>
        set((state) => ({
            members: state.members.filter((member) => member.id !== id),
        })),
}));

export const computeMemberStatus = (member: Member) => {
    const net = member.payment_balance - member.total_expenses;
    const title =
        net === 0
            ? "settled"
            : net > 0
            ? "creditor"
            : ("debtor" as "settled" | "creditor" | "debtor");
    const percent =
        net === 0
            ? 100
            : net > 0 && member.payment_balance !== 0
            ? Math.abs(net / member.payment_balance) * 100
            : net < 0 && member.total_expenses !== 0
            ? Math.abs(net / member.total_expenses) * 100
            : 100;
    return { title, net, percent };
};
