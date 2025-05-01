import { createExpense, updateExpense } from "@/api/endpoints/expenses";
import AmountField from "@/components/common/AmountField";
import { Button } from "@/components/common/Button";
import DatePicker from "@/components/common/DatePicker";
import InputField from "@/components/common/InputField";
import MemberSelect from "@/components/common/MemberSelect";
import MembersSelect from "@/components/common/MembersSelect";
import { useTranslations } from "@/hooks/useTranslations";
import { useExpenseStore } from "@/store/expenses";
import { useGroupStore } from "@/store/group";
import { useMemberStore } from "@/store/members";
import { ExpenseRequest, ExpenseResponse } from "@/types/api/expenses";
import {
    Expense,
    ExpenseInput,
    ExpenseInputSchema,
} from "@/types/schemas/expenses";
import { Member } from "@/types/schemas/members";
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
    const updateMembers = useMemberStore((state) => state.updateMembers);
    const addExpenseStore = useExpenseStore((state) => state.addExpense);
    const updateExpenseStore = useExpenseStore((state) => state.updateExpense);
    const isEditMode = !!expense;

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<ExpenseInput>({
        defaultValues: {
            title: expense?.title || "",
            date: expense?.date ? expense.date.replace(/T.*/, "") : undefined,
            amount: expense?.amount || undefined,
            spender_id: expense?.spender.id || undefined,
            members: expense?.members || members || [],
            description: expense?.description || "",
        },
        resolver: zodResolver(ExpenseInputSchema(t)),
        mode: "all",
    });

    const submit = async (data: ExpenseRequest) => {
        if (!group?.edit_token) return;

        try {
            let response;
            if (isEditMode && expense?.id) {
                response = await updateExpense(group.edit_token, expense.id, {
                    ...data,
                });
                updateExpenseStore(response.data);
            } else {
                response = await createExpense(group.edit_token, { ...data });
                addExpenseStore(response.data);
            }
            const members = response.data.members.map((member: Member) => ({
                id: member.id,
                total_expenses: member.total_expenses,
                payment_balance: member.payment_balance,
            }));
            updateMembers(members);
            onSubmitSuccess?.(response);
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
                console.error("Failed to submit expense:", error);
            }
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
