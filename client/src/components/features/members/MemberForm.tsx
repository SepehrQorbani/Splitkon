import { useCreateMember, useUpdateMember } from "@/api/queries/members";
import InputField from "@/components/common/InputField";
import NumberField from "@/components/common/NumberField";
import { useTranslations } from "@/hooks/useTranslations";
import { useGroupStore } from "@/store/group";
import { ApiError } from "@/types/api/errors";
import { MemberResponse } from "@/types/api/members";
import {
    Member,
    MemberInput,
    MemberInputSchema,
} from "@/types/schemas/members";
import { handleApiError } from "@/utils/apiErrorHandler";
import { cn } from "@/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconChecks, IconPlus } from "@tabler/icons-react";
import { useEffect } from "react";
import { Form } from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
import AvatarSelect from "../../common/AvatarSelect";
import BankAccountInputField from "../../common/BankAccountInputField";
import { Button } from "../../common/Button";

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
    const createMember = useCreateMember();
    const updateMember = useUpdateMember();
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
                    response = await updateMember.mutateAsync({
                        token: group.edit_token,
                        memberId: member.id as number,
                        data,
                    });
                } else {
                    response = await createMember.mutateAsync({
                        token: group.edit_token,
                        data,
                    });
                }
                reset({
                    name: member?.name || "",
                    avatar: member?.avatar || "",
                    ratio: member?.ratio || 1,
                    bank_info: member?.bank_info || undefined,
                });
                onSubmitSuccess?.(response.data);
            } catch (error: any) {
                handleApiError(error as ApiError, setError);
            }
        } else {
            onSubmitSuccess?.(data);
            reset();
        }
    };

    return (
        <Form
            onSubmit={handleSubmit(submit)}
            className={cn("space-y-6", className)}
        >
            <div className="flex items-center gap-2">
                <Controller
                    control={control}
                    name="avatar"
                    render={({ field }) => (
                        <AvatarSelect
                            {...field}
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
            <div className="w-full flex">
                <Button
                    type="submit"
                    size="md"
                    // variant="outline"
                    className="ms-auto text-xs"
                    isDisabled={disabled || isSubmitting}
                >
                    {useServer ? (
                        <>
                            <IconChecks className="size-4 me-2" />
                            {isEditMode ? t("update") : t("submit")}
                        </>
                    ) : (
                        <>
                            {isEditMode ? (
                                <IconChecks className="size-4 me-2" />
                            ) : (
                                <IconPlus className="size-4 me-2" />
                            )}
                            {isEditMode
                                ? t("ui.updateMember")
                                : t("ui.addToMember")}
                        </>
                    )}
                </Button>
            </div>
        </Form>
    );
};

export default MemberForm;
