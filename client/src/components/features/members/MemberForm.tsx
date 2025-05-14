import { createMember, updateMember } from "@/api/endpoints/members";
import InputField from "@/components/common/InputField";
import NumberField from "@/components/common/NumberField";
import { useTranslations } from "@/hooks/useTranslations";
import { useGroupStore } from "@/store/group";
import { MemberResponse } from "@/types/api/members";
import {
    Member,
    MemberInput,
    MemberInputSchema,
} from "@/types/schemas/members";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconChecks, IconPlus } from "@tabler/icons-react";
import { useEffect } from "react";
import { Form } from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
import AvatarSelect from "../../common/AvatarSelect";
import BankAccountInputField from "../../common/BankAccountInputField";
import { Button } from "../../common/Button";
import { cn } from "@/utils/cn";

type Props = {
    disabled?: boolean;
    onSubmitSuccess?: (data?: MemberResponse["data"] | MemberInput) => void;
    member?: Member | MemberInput;
    useServer?: boolean;
    className?: string;
};

const MemberForm = ({
    disabled = false,
    onSubmitSuccess,
    member,
    useServer = true,
    className,
}: Props) => {
    const { t } = useTranslations();
    const group = useGroupStore((state) => state.group);
    const isEditMode = !!member;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<MemberInput>({
        defaultValues: {
            name: member?.name || "",
            avatar: member?.avatar || "",
            ratio: member?.ratio || 1,
            bank_info: member?.bank_info || "",
        },
        resolver: zodResolver(MemberInputSchema(t)),
        mode: "onChange",
    });

    useEffect(() => {
        reset({
            name: member?.name || "",
            avatar: member?.avatar || "",
            ratio: member?.ratio || 1,
            bank_info: member?.bank_info || "",
        });
    }, [member, reset]);

    const submit = async (data: MemberInput) => {
        if (useServer) {
            if (!group?.edit_token) return;
            try {
                let response;
                if (isEditMode && member?.id) {
                    response = await updateMember(
                        group.edit_token,
                        member.id as number,
                        data
                    );
                } else {
                    response = await createMember(group.edit_token, data);
                }
                reset({
                    name: member?.name || "",
                    avatar: member?.avatar || "",
                    ratio: member?.ratio || 1,
                    bank_info: member?.bank_info || undefined,
                });
                onSubmitSuccess?.(response.data);
            } catch (error: any) {
                if (error.message.startsWith("Failed to fetch")) {
                    const errorData = error.cause || {};
                    if (errorData.errors) {
                        Object.entries(errorData.errors).forEach(
                            ([field, messages]) => {
                                setError(field as any, {
                                    type: "server",
                                    message: Array.isArray(messages)
                                        ? messages[0]
                                        : messages,
                                });
                            }
                        );
                    } else {
                        setError("root", {
                            type: "server",
                            message: t("ui.submissionError"),
                        });
                    }
                } else {
                    console.error("Failed to submit member:", error);
                }
            }
        } else {
            onSubmitSuccess?.(data);
            reset();
        }
    };

    return (
        <Form
            onSubmit={handleSubmit(submit)}
            className={cn("space-y-4", className)}
        >
            <div className="flex items-center gap-2">
                <Controller
                    control={control}
                    name="avatar"
                    render={({ field }) => (
                        <AvatarSelect
                            {...field}
                            isRequired
                            isInvalid={!!errors?.avatar}
                            error={errors?.avatar}
                            className="max-w-20 shrink-0"
                            disabled={disabled || isSubmitting}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <InputField
                            label={t("attributes.name")}
                            {...field}
                            className="w-full form-field"
                            isRequired
                            isInvalid={!!errors?.name}
                            error={errors?.name}
                            disabled={disabled || isSubmitting}
                        />
                    )}
                />
            </div>
            <div className="flex items-center gap-2 flex-col sm:flex-row">
                <Controller
                    control={control}
                    name="ratio"
                    render={({ field }) => (
                        <NumberField
                            label={t("attributes.ratio")}
                            {...field}
                            minValue={1}
                            maxValue={100}
                            className="w-full sm:w-32 form-field shrink-0"
                            isInvalid={!!errors?.ratio}
                            error={errors?.ratio}
                            disabled={disabled || isSubmitting}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="bank_info"
                    render={({ field }) => (
                        <BankAccountInputField
                            label={t("attributes.bank_info")}
                            {...field}
                            isInvalid={!!errors?.bank_info}
                            error={errors?.bank_info}
                            disabled={disabled || isSubmitting}
                        />
                    )}
                />
            </div>
            <Button
                type="submit"
                size="md"
                variant="outline"
                isDisabled={disabled || isSubmitting}
            >
                {useServer ? (
                    <>
                        <IconChecks className="size-4 me-2" />
                        {isEditMode ? t("update") : t("submit")}
                    </>
                ) : (
                    <>
                        <IconPlus className="size-4 me-2" />
                        {t("add")}
                    </>
                )}
            </Button>
        </Form>
    );
};

export default MemberForm;
