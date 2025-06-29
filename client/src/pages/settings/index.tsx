// TODO: Check permission
import { useUpdateGroup } from "@/api/queries/groups";
import { Button, getButtonStyles } from "@/components/common/Button";
import { Card, CardTitle } from "@/components/common/Card";
import DatePicker from "@/components/common/DatePicker";
import InputField from "@/components/common/InputField";
import Select from "@/components/common/Select";
import MemberForm from "@/components/features/members/MemberForm";
import MemberList from "@/components/features/members/MemberList";
import { useTranslations } from "@/hooks/useTranslations";
import { useGroupStore } from "@/store/group";
import { useMemberStore } from "@/store/members";
import { ApiError } from "@/types/api/errors";
import { GroupEditInput, GroupEditInputSchema } from "@/types/schemas/group";
import { MemberInput } from "@/types/schemas/members";
import { handleApiError } from "@/utils/apiErrorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    IconCircleX,
    IconCopyPlus,
    IconObjectScan,
    IconSettings,
    IconUserScan,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Form } from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
import { Link, useParams } from "react-router";

const SettingsPage = () => {
    const { t, formatDate } = useTranslations();
    const { token } = useParams();
    const group = useGroupStore((state) => state.group);
    const updateGroup = useUpdateGroup();
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

    useEffect(() => {
        if (group) {
            reset({
                title: group.title,
                date: group.date,
                description: group.description,
                currency: group.currency,
                closing_date: group.closing_date,
            });
        }
    }, [group, reset]);

    //TODO: add Loading
    if (!group) return null;

    const onSubmit = async (data: GroupEditInput) => {
        const changedFields = Object.fromEntries(
            Object.entries(dirtyFields)
                .filter(([_, dirty]) => dirty)
                .map(([key]) => [key, data[key as keyof GroupEditInput]])
        ) as Partial<GroupEditInput>;

        if (token) {
            clearErrors();
            try {
                const updatedData = await updateGroup.mutateAsync({
                    token,
                    data: changedFields,
                });

                reset({
                    title: updatedData.data.title,
                    date: updatedData.data.date,
                    description: updatedData.data.description,
                    currency: updatedData.data.currency,
                    closing_date: updatedData.data.closing_date,
                });
            } catch (error: any) {
                handleApiError(error as ApiError, setError);
            }
        }
    };

    return (
        <div className="">
            <Card>
                <CardTitle className="flex items-center gap-2">
                    <IconSettings className="w-5 h-5" />
                    <h2>{t("ui.settings")}</h2>
                </CardTitle>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full border border-border shadow-input rounded p-4">
                        <h3>{t("ui.editGroup")}</h3>
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
                        <h3>{t("ui.editMembers")}</h3>
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
                            className="max-h-60 h-60 p-4 bg-surface"
                            members={members}
                            onSelectMember={setSelectedMember}
                            onDeleteMember={() => {}}
                            selectedMember={selectedMember || undefined}
                        />
                    </div>
                </div>
                <div className="w-full space-y-6 md:flex md:justify-between md:items-center md:space-y-0 border border-border shadow-input rounded p-4">
                    <div className="flex gap-2 items-center">
                        <IconCopyPlus className="size-4" />
                        <h3>{t("cloneTitle")}</h3>
                    </div>
                    <div className="flex flex-col gap-4 xs:flex-row">
                        <Link
                            to={`/new?originalGroup=${group.view_token}`}
                            className={getButtonStyles({
                                className: "text-xs font-light gap-2",
                            })}
                        >
                            <IconObjectScan className="shrink-0 size-4" />
                            {t("cloneGroup")}
                        </Link>
                        <Link
                            to={`/new?originalMembers=${group.view_token}`}
                            className={getButtonStyles({
                                className: "text-xs font-light gap-2",
                            })}
                        >
                            <IconUserScan className="shrink-0 size-4" />
                            {t("cloneMembers")}
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default SettingsPage;
