import { Drawer } from "@/components/common/Drawer";
import { useMemberStore } from "@/store";
import MemberForm from "../members/MemberForm";
import { IconUserEdit, IconUserPlus, IconX } from "@tabler/icons-react";
import { useTranslations } from "@/hooks/useTranslations";
import { Button } from "@/components/common/Button";
import { Member } from "@/types";

function MemberFormModal() {
    const { t } = useTranslations();
    console.log("member form modal");
    return (
        <Drawer modalKey="member-form">
            {({ data, close }) => {
                const members = useMemberStore((state) => state.members);
                let isLoading = false;
                let member;

                if (typeof data === "number" || typeof data === "string") {
                    member = members?.find((e) => e.id === +data);
                    isLoading = !member;
                } else if (typeof data === "object" && data !== null) {
                    member = data;
                }

                return {
                    isLoading: data === true ? false : !members,
                    title: (
                        <div className="flex items-center justify-between">
                            {data === true ? (
                                <div className="flex gap-1 items-center">
                                    <IconUserPlus className="size-4" />
                                    <span>{t("ui.addMember")}</span>
                                </div>
                            ) : (
                                <div className="flex gap-1 items-center">
                                    <IconUserEdit className="size-4" />
                                    <span>{t("ui.editMember")}</span>
                                </div>
                            )}
                            <Button
                                variant="ghost"
                                className="size-8 p-1 text-muted"
                                onPress={close}
                            >
                                <IconX className="size-4" />
                            </Button>
                        </div>
                    ),
                    body: (
                        <div className="px-2">
                            <MemberForm
                                onSubmitSuccess={close}
                                member={
                                    member && typeof member === "object"
                                        ? (member as Member)
                                        : undefined
                                }
                            />
                        </div>
                    ),
                };
            }}
        </Drawer>
    );
}

export default MemberFormModal;
