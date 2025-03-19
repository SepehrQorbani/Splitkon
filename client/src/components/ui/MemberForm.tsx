import {
    IconCheck,
    IconRestore,
    IconEdit,
    IconUsersPlus,
} from "@tabler/icons-react";
import { Button } from "./Button";
import { MemberInputFields } from "./MemberInputFields";
import { Member, createMemberSchema, SelectedMember } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "@/hooks/useTranslations";
import { createMember, updateMember, deleteMember } from "@/utils/api";
import { cn } from "@/utils/cn";
import { MemberList } from "./MemberList";
import { AnimatePresence, motion } from "motion/react";
import { Card, CardTitle } from "@/components/ui/Card";

interface MemberFormProps {
    members?: Member[]; // Optional: controlled by parent
    onAdd?: (member: Member) => void; // Optional: parent callback
    onUpdate?: (index: number, member: Member) => void; // Optional: parent callback
    onDelete?: (index: number) => void; // Optional: parent callback
    disabled?: boolean;
    className?: string;
}

const MemberForm = ({
    members: controlledMembers,
    onAdd,
    onUpdate,
    onDelete,
    disabled = false,
    className,
}: MemberFormProps) => {
    const { t } = useTranslations();
    const [selectedMember, setSelectedMember] = useState<SelectedMember | null>(
        null
    );
    const [showForm, setShowForm] = useState(false);
    const [internalMembers, setInternalMembers] = useState<Member[]>(
        controlledMembers || []
    );

    const {
        control,
        reset,
        formState: { errors },
        setValue,
    } = useForm<Member>({
        defaultValues: { name: "", avatar: "", ratio: 1 },
        resolver: zodResolver(createMemberSchema(t)),
        mode: "onChange",
    });

    const isControlled =
        controlledMembers !== undefined && onAdd && onUpdate && onDelete;
    const activeMembers = isControlled ? controlledMembers : internalMembers;

    useEffect(() => {
        if (selectedMember) {
            setValue("name", selectedMember.name);
            setValue("avatar", selectedMember.avatar);
            setValue("ratio", selectedMember.ratio);
            setValue("id", selectedMember.id);
        } else {
            reset({ name: "", avatar: "", ratio: 1, id: "" });
        }
    }, [selectedMember, setValue, reset]);

    useEffect(() => {
        if (isControlled && controlledMembers !== internalMembers) {
            setInternalMembers(controlledMembers);
        }
    }, [controlledMembers, isControlled]);

    const handleSave = async (data: Member) => {
        if (disabled) return;

        if (isControlled) {
            if (selectedMember) {
                onUpdate(selectedMember.index, data);
            } else {
                onAdd(data);
            }
        } else {
            try {
                if (selectedMember) {
                    const updatedMember = await updateMember(data);
                    setInternalMembers((prev) =>
                        prev.map((m, i) =>
                            i === selectedMember.index ? updatedMember : m
                        )
                    );
                } else {
                    const newMember = await createMember(data);
                    setInternalMembers((prev) => [...prev, newMember]);
                }
            } catch (error) {
                console.error("Error saving member:", error);
            }
        }
        setSelectedMember(null);
        reset({ name: "", avatar: "", ratio: 1, id: "" });
    };

    const handleSelectMember = (id: string | number | undefined) => {
        if (disabled) return;

        if (id) {
            const member = activeMembers.findIndex((m) => m.id === id);
            setSelectedMember({
                ...activeMembers[member],
                index: member,
            });
            if (!showForm) {
                setShowForm(true);
            }
        } else {
            setSelectedMember(null);
        }
    };

    const handleDeleteMember = async (id: number | string) => {
        if (disabled) return;

        if (isControlled) {
            const index = activeMembers.findIndex((m) => m.id === id);

            if (index !== -1) {
                onDelete(index);
            }
        } else {
            try {
                await deleteMember(id);
                setInternalMembers((prev) => prev.filter((m) => m.id !== id));
            } catch (error) {
                console.error("Error deleting member:", error);
            }
        }

        if (selectedMember?.id === id) {
            setSelectedMember(null);
            // reset({ name: "", avatar: "", ratio: 1, id: "" });
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
                            <MemberInputFields
                                control={control}
                                errors={errors}
                                disabled={disabled}
                            />
                            <div className="flex gap-2">
                                <Button
                                    className="w-full h-10 p-0"
                                    onPress={() =>
                                        control.handleSubmit(handleSave)()
                                    }
                                    isDisabled={disabled}
                                >
                                    {selectedMember ? (
                                        <IconEdit className="w-4 h-4" />
                                    ) : (
                                        <IconCheck className="w-4 h-4" />
                                    )}
                                </Button>
                                <Button
                                    className="w-10 h-10 p-0 shrink-0"
                                    onPress={() => {
                                        setSelectedMember(null);
                                        reset({
                                            name: "",
                                            avatar: "",
                                            ratio: 1,
                                            id: "",
                                        });
                                    }}
                                    variant="ghost"
                                    isDisabled={disabled}
                                >
                                    <IconRestore className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* <motion.div
                layout
                transition={{ duration: 0.3, ease: "easeInOut" }}
            > */}
            <div>
                <MemberList
                    members={activeMembers}
                    selectedMember={selectedMember?.id}
                    onSelectMember={handleSelectMember}
                    onDeleteMember={handleDeleteMember}
                    disabled={disabled}
                />
            </div>
            {/* </motion.div> */}

            {/* <ul>
                <AnimatePresence initial={false}>
                    {activeMembers.map((member) => (
                        <motion.li
                            key={member.id}
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            style={{ overflow: "hidden" }}
                        >
                            <button onClick={() => {}}>{member.name}</button>
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul> */}
        </Card>
    );
};

export default MemberForm;
