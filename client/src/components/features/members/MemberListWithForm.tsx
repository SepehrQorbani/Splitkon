import { Card, CardTitle } from "@/components/common/Card";
import { useTranslations } from "@/hooks/useTranslations";
import { MemberResponse } from "@/types/api/members";
import { MemberInput } from "@/types/schemas/members";
import { cn } from "@/utils/cn";
import { IconUsersPlus } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "../../common/Button";
import MemberForm from "./MemberForm";
import { MemberList } from "./MemberList";

interface MemberListWithFormProps {
    members: MemberInput[];
    onAdd: (member: MemberInput) => void;
    onUpdate: (index: number, member: MemberInput) => void;
    onDelete: (index: number) => void;
    disabled?: boolean;
    className?: string;
}

const MemberListWithForm = ({
    members,
    onAdd,
    onUpdate,
    onDelete,
    disabled = false,
    className,
}: MemberListWithFormProps) => {
    const { t } = useTranslations();
    const [selectedMember, setSelectedMember] = useState<MemberInput | null>(
        null
    );
    const [showForm, setShowForm] = useState(true);

    const handleFormSubmit = (data?: MemberInput | MemberResponse["data"]) => {
        if (disabled || !data) return;

        if (selectedMember && selectedMember.index !== undefined) {
            onUpdate(selectedMember.index, data);
        } else {
            onAdd(data);
        }
        setSelectedMember(null);
        // setShowForm(false);
    };

    const handleSelectMember = (id: string | number | undefined) => {
        if (disabled) return;

        const memberIndex = members.findIndex((m) => m.id === id);
        if (memberIndex !== -1) {
            setSelectedMember({ ...members[memberIndex], index: memberIndex });
            if (!showForm) {
                setShowForm(true);
            }
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

    return (
        <Card className={cn("w-full p-1 shadow-input", className)}>
            <CardTitle className="flex items-center gap-2 justify-between p-2 border-b border-border">
                <h3 className="text-sm font-semibold">
                    {t("attributes.members")}
                </h3>
                <Button
                    className="h-8 w-8 p-0"
                    onPress={() => setShowForm(!showForm)}
                    isDisabled={disabled}
                >
                    <IconUsersPlus className="w-4 h-4" />
                </Button>
            </CardTitle>
            <AnimatePresence mode="wait">
                {showForm && (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden p-1"
                    >
                        <div className="flex flex-col gap-4 mt-2">
                            <MemberForm
                                member={
                                    selectedMember !== null
                                        ? selectedMember
                                        : undefined
                                }
                                disabled={disabled}
                                useServer={false}
                                onSubmitSuccess={handleFormSubmit}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div>
                <MemberList
                    members={members}
                    selectedMember={selectedMember?.id}
                    onSelectMember={handleSelectMember}
                    onDeleteMember={handleDeleteMember}
                    disabled={disabled}
                />
            </div>
        </Card>
    );
};

export default MemberListWithForm;
