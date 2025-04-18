import { Form } from "react-aria-components";
import { useTranslations } from "@/hooks/useTranslations";
import { useGroupStore } from "@/store/group";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/common/Button";
import DatePicker from "@/components/common/DatePicker";
import InputField from "@/components/common/InputField";
import MemberSelect from "@/components/common/MemberSelect";
import NumberField from "@/components/common/NumberField";
import { createRepay, updateRepay } from "@/api/endpoints/repays";
import { RepayInput, RepayInputSchema } from "@/types/schemas/repays";
import { Repay } from "@/types/schemas/repays";
import { IconChecks } from "@tabler/icons-react";
import { RepayRequest, RepayResponse } from "@/types/api/repays";
import { useRepayStore } from "@/store/repays";
import { useMemberStore } from "@/store/members";

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
    const updateMembers = useMemberStore((state) => state.updateMembers);
    const addRepayStore = useRepayStore((state) => state.addRepay);
    const updateRepayStore = useRepayStore((state) => state.updateRepay);
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
            date: repay?.date || undefined,
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
                response = await updateRepay(group.edit_token, repay.id, {
                    ...data,
                });
                updateRepayStore(response.data);
            } else {
                response = await createRepay(group.edit_token, { ...data });
                addRepayStore(response.data);
            }

            const updatedMembers = [
                {
                    id: response.data.from.id,
                    payment_balance: response.data.from.payment_balance,
                    total_expenses: response.data.from.total_expenses,
                },
                {
                    id: response.data.to.id,
                    payment_balance: response.data.to.payment_balance,
                    total_expenses: response.data.to.total_expenses,
                },
            ];
            updateMembers(updatedMembers);
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
                console.error("Failed to submit repayment:", error);
            }
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
                    <NumberField
                        label={t("attributes.amount")}
                        {...field}
                        isInvalid={!!errors.amount}
                        error={errors?.amount}
                        minValue={1}
                        formatOptions={{}}
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
