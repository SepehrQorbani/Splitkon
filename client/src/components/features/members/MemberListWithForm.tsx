import { useTranslations } from "@/hooks/useTranslations";
import { MemberResponse } from "@/types/api/members";
import { Member, MemberInput } from "@/types/schemas/members";
import { useState } from "react";
import MemberForm from "./MemberForm";
import { MemberList } from "./MemberList";
import { useGroupStore } from "@/store";
import { useUpdateMember } from "@/api/queries/members";

interface MemberListWithFormProps {
    members: MemberInput[];
    onAdd: (member: MemberInput) => void;
    onUpdate: (member: MemberInput) => void;
    onDelete: (index: number) => void;
    useServer: boolean;
    disabled?: boolean;
    className?: string;
}

const MemberListWithForm = ({
    members,
    onAdd,
    onUpdate,
    onDelete,
    useServer,
    disabled = false,
    className,
}: MemberListWithFormProps) => {
    const { t } = useTranslations();
    const [selectedMember, setSelectedMember] = useState<MemberInput | null>(
        null
    );

    const group = useGroupStore((state) => state.group);
    const updateMember = useUpdateMember();

    const handleFormSubmit = (data?: MemberInput | MemberResponse["data"]) => {
        if (disabled || !data) return;
        if (selectedMember) {
            onUpdate({ ...selectedMember, ...data });
        } else {
            onAdd(data);
        }
        setSelectedMember(null);
    };

    const handleSelectMember = (
        member: MemberInput | Member | null | undefined
    ) => {
        if (disabled) return;

        if (member) {
            setSelectedMember(member);
        } else {
            setSelectedMember(null);
        }
    };

    const handleDeleteMember = (id?: number | string) => {
        if (disabled || !id) return;

        const index = members.findIndex((m) => m.id === id);
        if (index !== -1) {
            onDelete(index);
            if (selectedMember?.id === id) {
                setSelectedMember(null);
            }
        }
    };

    const handleAddMember = (member: MemberInput) => {
        if (disabled) return;
        onAdd(member);
    };

    async function handleUpdateMemberOnServer(member: Member | MemberInput) {
        if (!group?.edit_token) return;
        try {
            const response = await updateMember.mutateAsync({
                token: group.edit_token,
                memberId: member.id as number,
                data: member,
            });
            onUpdate(response.data);
            setSelectedMember(null);
        } catch (error: any) {
            // handleApiError(error as ApiError, setError);
            console.error(error);
        }
    }

    const handleUpdateMember = (member: Member | MemberInput) => {
        if (disabled || !selectedMember) return;

        if (useServer) {
            handleUpdateMemberOnServer(member);
        } else {
            onUpdate(member);
            setSelectedMember(null);
        }
    };

    return (
        <>
            <MemberForm
                member={selectedMember !== null ? selectedMember : undefined}
                disabled={disabled}
                useServer={useServer}
                onSubmitSuccess={handleFormSubmit}
                onCancel={() => handleSelectMember(null)}
            />

            <MemberList
                members={members}
                selectedMember={selectedMember}
                onSelectMember={handleSelectMember}
                onAddMember={handleAddMember}
                onUpdateMember={handleUpdateMember}
                onDeleteMember={handleDeleteMember}
                disabled={disabled}
                className="max-h-52 h-52"
            />
        </>
    );
};

export default MemberListWithForm;
