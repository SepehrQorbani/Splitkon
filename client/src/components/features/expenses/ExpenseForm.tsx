import { useCreateExpense, useUpdateExpense } from "@/api/queries/expenses";
import AmountField from "@/components/common/AmountField";
import { Button } from "@/components/common/Button";
import DatePicker from "@/components/common/DatePicker";
import InputField from "@/components/common/InputField";
import MemberSelect from "@/components/common/MemberSelect";
import MembersSelect from "@/components/common/MembersSelect";
import { useTranslations } from "@/hooks/useTranslations";
import { useGroupStore } from "@/store/group";
import { useMemberStore } from "@/store/members";
import { ApiError } from "@/types/api/errors";
import { ExpenseRequest, ExpenseResponse } from "@/types/api/expenses";
import {
    Expense,
    ExpenseInput,
    ExpenseInputSchema,
} from "@/types/schemas/expenses";
import { handleApiError } from "@/utils/apiErrorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconChecks } from "@tabler/icons-react";
import { Form } from "react-aria-components";
import { Controller, useForm } from "react-hook-form";

type ExpenseFormProps = {
    onSubmitSuccess?: (response?: ExpenseResponse) => void;
    expense?: Expense;
    disabled?: boolean;
};

export const ExpenseForm = ({
    onSubmitSuccess,
    expense,
    disabled = false,
}: ExpenseFormProps) => {
    const { t } = useTranslations();
    const group = useGroupStore((state) => state.group);
    const members = useMemberStore((state) => state.members);
    const isEditMode = !!expense;

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<ExpenseInput>({
        defaultValues: {
            title: expense?.title || "",
            date: expense?.date || new Date().toISOString(),
            amount: expense?.amount || undefined,
            spender_id: expense?.spender.id || undefined,
            members: expense?.members || members || [],
            description: expense?.description || "",
        },
        resolver: zodResolver(ExpenseInputSchema(t)),
        mode: "all",
    });
    const createExpense = useCreateExpense();
    const updateExpense = useUpdateExpense();
    const submit = async (data: ExpenseRequest) => {
        if (!group?.edit_token) return;

        try {
            let response;
            if (isEditMode && expense?.id) {
                response = await updateExpense.mutateAsync({
                    token: group.edit_token,
                    expenseId: expense.id,
                    data,
                });
            } else {
                response = await createExpense.mutateAsync({
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
                name="title"
                render={({ field }) => (
                    <InputField
                        label={t("attributes.title")}
                        {...field}
                        isRequired
                        isInvalid={!!errors.title}
                        error={errors?.title}
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
                name="spender_id"
                render={({ field, fieldState }) => (
                    <MemberSelect
                        label={t("attributes.spender")}
                        {...field}
                        members={members || []}
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
                name="members"
                render={({ field }) => (
                    <>
                        <MembersSelect
                            members={members || []}
                            label={t("attributes.members")}
                            {...field}
                            value={field.value}
                            onChange={field.onChange}
                            isInvalid={!!errors?.members}
                            error={errors?.members}
                            isRequired
                            disabled={disabled || isSubmitting}
                        />
                    </>
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
