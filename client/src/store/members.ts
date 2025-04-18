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
    setMembers: (members: Members) => set({ members }),
    addMember: (member: Member) =>
        set((state) => ({
            members: [...state.members, member],
        })),
    getMember: (id: number) => get().members.find((member) => member.id === id),
    updateMember: (updatedMember: Partial<Member> & { id: number }) =>
        set((state) => ({
            members: state.members.map((member) =>
                member.id === updatedMember.id
                    ? { ...member, ...updatedMember }
                    : member
            ),
        })),
    updateMembers: (updatedMembers: (Partial<Member> & { id: number })[]) =>
        set((state) => ({
            members: state.members.map((member) => {
                const update = updatedMembers.find((u) => u.id === member.id);
                return update ? { ...member, ...update } : member;
            }),
        })),
    deleteMember: (id: number) =>
        set((state) => ({
            members: state.members.filter((member) => member.id !== id),
        })),
}));
