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
import { cn } from "@/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconChecks } from "@tabler/icons-react";
import { useEffect } from "react";
import { Form } from "react-aria-components";
import { Controller, useForm } from "react-hook-form";

type RepaysFormProps = {
    onSubmitSuccess?: (response?: RepayResponse) => void;
    repay?: Repay;
    defaultValue?: { from_id?: number; to_id?: number; amount?: number };
    disabled?: boolean;
    className?: string;
};

export const RepaysForm = ({
    onSubmitSuccess,
    repay,
    defaultValue,
    disabled = false,
    className,
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
        reset,
    } = useForm<RepayInput>({
        defaultValues: {
            from_id: undefined,
            to_id: undefined,
            amount: undefined,
            date: new Date().toISOString(),
            description: "",
        },
        resolver: zodResolver(RepayInputSchema(t)),
        mode: "all",
    });
    useEffect(() => {
        if (repay) {
            reset({
                from_id: repay?.from.id || repay?.from_id,
                to_id: repay?.to.id || repay?.to_id,
                amount: repay?.amount,
                date: repay?.date,
                description: repay?.description,
            });
        } else if (defaultValue) {
            reset({
                from_id: defaultValue?.from_id,
                to_id: defaultValue?.to_id,
                amount: defaultValue?.amount,
            });
        }
    }, [repay, defaultValue, reset]);

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
        <Form
            onSubmit={handleSubmit(submit)}
            className={cn("space-y-4", className)}
        >
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
                        error={errors?.amount}
                        minValue={1}
                        disabled={disabled || isSubmitting}
                        allowClear={true}
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

            <div className="sticky bottom-0 bg-surface py-2 border-t border-border">
                <Button
                    type="submit"
                    isDisabled={disabled || isSubmitting}
                    className="w-full text-xs"
                >
                    <IconChecks className="size-4 me-2" />
                    {isEditMode ? t("update") : t("submit")}
                </Button>
            </div>
        </Form>
    );
};
