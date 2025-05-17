import { useCreateRepay, useUpdateRepay } from "@/api/queries/repays";
import AmountField from "@/components/common/AmountField";
import { Button } from "@/components/common/Button";
import DatePicker from "@/components/common/DatePicker";
import InputField from "@/components/common/InputField";
import MemberSelect from "@/components/common/MemberSelect";
import { useTranslations } from "@/hooks/useTranslations";
import { useGroupStore } from "@/store/group";
import { useMemberStore } from "@/store/members";
import { ApiError } from "@/types/api/errors";
import { RepayRequest, RepayResponse } from "@/types/api/repays";
import { Repay, RepayInput, RepayInputSchema } from "@/types/schemas/repays";
import { handleApiError } from "@/utils/apiErrorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconChecks } from "@tabler/icons-react";
import { Form } from "react-aria-components";
import { Controller, useForm } from "react-hook-form";

type RepaysFormProps = {
    onSubmitSuccess?: (response?: RepayResponse) => void;
    repay?: Repay;
    defaultValue?: { from_id?: number; to_id?: number; amount?: number };
    disabled?: boolean;
};

export const RepaysForm = ({
    onSubmitSuccess,
    repay,
    defaultValue,
    disabled = false,
}: RepaysFormProps) => {
    const { t } = useTranslations();
    const group = useGroupStore((state) => state.group);
    const members = useMemberStore((state) => state.members);
    const createRepay = useCreateRepay();
    const updateRepay = useUpdateRepay();
    const isEditMode = !!repay && repay.hasOwnProperty("id");

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        watch,
    } = useForm<RepayInput>({
        defaultValues: {
            from_id: repay?.from_id || defaultValue?.from_id || undefined,
            to_id: repay?.to_id || defaultValue?.to_id || undefined,
            amount: repay?.amount || defaultValue?.amount || undefined,
            date: repay?.date || new Date().toISOString(),
            description: repay?.description || "",
        },
        resolver: zodResolver(RepayInputSchema(t)),
        mode: "all",
    });

    const fromId = watch("from_id");
    const toId = watch("to_id");

    const submit = async (data: RepayRequest) => {
        if (!group?.edit_token) return;

        try {
            let response;
            if (isEditMode) {
                response = await updateRepay.mutateAsync({
                    token: group.edit_token,
                    repayId: repay.id,
                    data,
                });
            } else {
                response = await createRepay.mutateAsync({
                    token: group.edit_token,
                    data,
                });
            }
            onSubmitSuccess?.(response);
        } catch (error: any) {
            handleApiError(error as ApiError, setError);
        }
    };

    return (
        <Form onSubmit={handleSubmit(submit)} className="space-y-4">
            <Controller
                control={control}
                name="from_id"
                render={({ field, fieldState }) => (
                    <MemberSelect
                        label={t("attributes.from")}
                        {...field}
                        members={members.filter((m) => m.id !== toId) || []}
                        value={field.value}
                        onChange={field.onChange}
                        error={fieldState.error}
                        isRequired
                        disabled={disabled || isSubmitting}
                    />
                )}
            />
            <Controller
                control={control}
                name="to_id"
                render={({ field, fieldState }) => (
                    <MemberSelect
                        label={t("attributes.to")}
                        {...field}
                        members={members.filter((m) => m.id !== fromId) || []}
                        value={field.value}
                        onChange={field.onChange}
                        error={fieldState.error}
                        isRequired
                        disabled={disabled || isSubmitting}
                    />
                )}
            />
            <Controller
                control={control}
                name="amount"
                render={({ field }) => (
                    <AmountField
                        label={t("attributes.amount")}
                        {...field}
                        isInvalid={!!errors.amount}
                        error={errors?.amount}
                        minValue={1}
                        disabled={disabled || isSubmitting}
                    />
                )}
            />
            <Controller
                control={control}
                name="description"
                render={({ field }) => (
                    <InputField
                        label={t("attributes.description")}
                        {...field}
                        isInvalid={!!errors.description}
                        error={errors?.description}
                        multiline
                        disabled={disabled || isSubmitting}
                    />
                )}
            />
            <Controller
                control={control}
                name="date"
                render={({ field }) => (
                    <DatePicker
                        label={t("attributes.date")}
                        {...field}
                        isInvalid={!!errors.date}
                        error={errors?.date}
                        // disabled={disabled || isSubmitting}
                    />
                )}
            />
            <Button type="submit" isDisabled={disabled || isSubmitting}>
                <IconChecks className="size-4 me-2" />
                {isEditMode ? t("update") : t("submit")}
            </Button>
        </Form>
    );
};
