import { updateGroup } from "@/api/endpoints/groups";
import { Button } from "@/components/common/Button";
import { Card, CardTitle } from "@/components/common/Card";
import DatePicker from "@/components/common/DatePicker";
import InputField from "@/components/common/InputField";
import Select from "@/components/common/Select";
import MemberForm from "@/components/features/members/MemberForm";
import MemberList from "@/components/features/members/MemberList";
import { useTranslations } from "@/hooks/useTranslations";
import { useGroupStore } from "@/store/group";
import { useMemberStore } from "@/store/members";
import { GroupEditInput, GroupEditInputSchema } from "@/types/schemas/group";
import { MemberInput } from "@/types/schemas/members";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconCircleX, IconClearAll, IconSettings } from "@tabler/icons-react";
import { useState } from "react";
import { Form } from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router";

const SettingsPage = () => {
    const { t, formatDate } = useTranslations();
    const { token } = useParams();
    const group = useGroupStore((state) => state.group);
    const updateGroupStore = useGroupStore((state) => state.updateGroup);
    const members = useMemberStore((state) => state.members);
    const [selectedMember, setSelectedMember] = useState<
        MemberInput["id"] | null
    >(null);
    const addMember = useMemberStore((state) => state.addMember);
    const updateMember = useMemberStore((state) => state.updateMember);
    const deleteMember = useMemberStore((state) => state.deleteMember);

    const currencyOptions = [
        {
            id: 1,
            label: t("ui.rial"),
            value: {
                code: "IRR",
                display_unit: "rial",
                conversion_factor: 1,
                decimal_precision: 0,
            },
        },
        {
            id: 2,
            label: t("ui.toman"),
            value: {
                code: "IRR",
                display_unit: "toman",
                conversion_factor: 10,
                decimal_precision: 0,
            },
        },
        {
            id: 3,
            label: t("ui.hezartoman"),
            value: {
                code: "IRR",
                display_unit: "hezartoman",
                conversion_factor: 10000,
                decimal_precision: 0,
            },
        },
        {
            id: 4,
            label: t("ui.dollar"),
            value: {
                display_unit: "dollar",
                code: "USD",
                conversion_factor: 1,
                decimal_precision: 2,
            },
        },
    ];

    const {
        control,
        handleSubmit,
        formState: { isDirty, dirtyFields, errors, isSubmitting },
        reset,
        setError,
        clearErrors,
    } = useForm({
        resolver: zodResolver(
            GroupEditInputSchema(
                t,
                formatDate,
                group as NonNullable<typeof group>
            )
        ),
        defaultValues: {
            title: group?.title,
            date: group?.date,
            description: group?.description,
            currency: group?.currency,
            closing_date: group?.closing_date,
        },
    });

    //TODO: add Loading
    if (!group) return null;

    const onSubmit = async (data: GroupEditInput) => {
        const changedFields = Object.keys(dirtyFields).reduce((acc, key) => {
            if (dirtyFields[key as keyof typeof dirtyFields]) {
                acc[key as keyof GroupEditInput] = data[
                    key as keyof GroupEditInput
                ] as any;
            }
            return acc;
        }, {} as Partial<GroupEditInput>);
        if (token) {
            clearErrors();
            try {
                const updatedData = await updateGroup(token, changedFields);

                updateGroupStore(updatedData.data);
                reset({
                    title: updatedData.data.title,
                    date: updatedData.data.date,
                    description: updatedData.data.description,
                    currency: updatedData.data.currency,
                    closing_date: updatedData.data.closing_date,
                });
            } catch (err: any) {
                // Handle API errors (e.g., validation errors)
                if (err.message.startsWith("Failed to fetch")) {
                    const errorData = err.cause || {};
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
                }
            }
        }
    };

    return (
        <div className="">
            <Card>
                <CardTitle className="flex items-center gap-2">
                    <IconSettings className="w-5 h-5" />
                    {t("ui.settings")}
                </CardTitle>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full border border-border shadow-input rounded p-4">
                        <h4>{t("ui.editGroup")}</h4>
                        <Form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4 h-full py-4"
                        >
                            <div className="flex flex-col gap-4 h-full">
                                <Controller
                                    name="title"
                                    control={control}
                                    render={({ field }) => (
                                        <InputField
                                            label={t("attributes.title")}
                                            {...field}
                                        />
                                    )}
                                />
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Controller
                                        name="date"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                label={t("attributes.date")}
                                                {...field}
                                                isInvalid={!!errors.date}
                                                error={errors?.date}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="closing_date"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="w-full flex items-center gap-2 relative">
                                                <DatePicker
                                                    label={t(
                                                        "attributes.closing_date"
                                                    )}
                                                    {...field}
                                                    isInvalid={
                                                        !!errors.closing_date
                                                    }
                                                    error={errors?.closing_date}
                                                />
                                                {field.value && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="p-1 mt-4 focus-visible:ring-0 focus:outline-none absolute end-10"
                                                        onPress={() => {
                                                            field.onChange(
                                                                null
                                                            );
                                                        }}
                                                        isDisabled={
                                                            !field.value
                                                        }
                                                    >
                                                        <IconCircleX className="size-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    />
                                </div>
                                <Controller
                                    name="currency"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            label={t("attributes.currency")}
                                            items={currencyOptions}
                                            {...field}
                                            {...field}
                                            isInvalid={!!errors.currency}
                                            error={errors?.currency}
                                        />
                                    )}
                                />
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <InputField
                                            label={t("attributes.description")}
                                            {...field}
                                            multiline
                                            value={field.value ?? ""}
                                            disabled={isSubmitting}
                                            isInvalid={!!errors.description}
                                            error={errors?.description}
                                        />
                                    )}
                                />
                                <Button
                                    className="mt-auto"
                                    type="submit"
                                    isDisabled={!isDirty}
                                >
                                    {t("ui.update")}
                                </Button>
                            </div>
                        </Form>
                    </div>
                    <div className="w-full overflow-auto border border-border shadow-input rounded p-4">
                        <h4>{t("ui.editMembers")}</h4>
                        <MemberForm
                            className="py-4"
                            member={
                                selectedMember !== null
                                    ? members.find(
                                          (m) => m.id === selectedMember
                                      )
                                    : undefined
                            }
                            onSubmitSuccess={(data) => {
                                if (selectedMember && data) {
                                    const memberData = {
                                        ...data,
                                        id: Number(data.id),
                                    };
                                    updateMember(memberData);
                                    setSelectedMember(null);
                                } else if (data) {
                                    const newMember = {
                                        ...data,
                                        id: Number(data.id),
                                        total_expenses: 0,
                                        payment_balance: 0,
                                    };
                                    addMember(newMember);
                                }
                            }}
                        />
                        <MemberList
                            className="max-h-60 h-60 border border-border rounded p-4 bg-surface"
                            members={members}
                            onSelectMember={setSelectedMember}
                            onDeleteMember={() => {}}
                            selectedMember={selectedMember || undefined}
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default SettingsPage;
