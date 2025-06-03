import { useCreateGroup } from "@/api/queries/groups";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import CheckmarkAnimation from "@/components/common/CheckmarkAnimation";
import DatePicker from "@/components/common/DatePicker";
import InputField from "@/components/common/InputField";
import Select from "@/components/common/Select";
import MemberListWithForm from "@/components/features/members/MemberListWithForm";
import ShareForm from "@/components/features/share/ShareForm";
import { useTranslations } from "@/hooks/useTranslations";
import { useGroupStore } from "@/store";
import { ApiError } from "@/types/api/errors";
import { GroupRequest } from "@/types/api/group";
import { GroupInput, GroupInputSchema } from "@/types/schemas/group";
import { handleApiError } from "@/utils/apiErrorHandler";
import { cn } from "@/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    IconArrowLeft,
    IconArrowRight,
    IconChecks,
    IconInfoHexagon,
    IconSquareRoundedPlus,
    IconUserPlus,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Form } from "react-aria-components";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const TITLE = ["ui.groupInfo", "ui.addMembers", "ui.saveLinks"] as const;
const ICON = [
    <IconInfoHexagon className="size-4" />,
    <IconUserPlus className="size-4" />,
    <IconChecks className="size-4" />,
] as const;

function New() {
    const { t, direction } = useTranslations();
    const createGroup = useCreateGroup();
    const group = useGroupStore((state) => state.group);
    const setGroup = useGroupStore((state) => state.setGroup);
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
        setError,
        clearErrors,
        trigger,
    } = useForm<GroupInput>({
        defaultValues: {
            title: "",
            description: "",
            date: undefined,
            currency: {
                display_unit: "toman",
                code: "IRR",
                conversion_factor: 10,
                decimal_precision: 0,
            },
            members: [],
        },
        resolver: zodResolver(GroupInputSchema(t)),
        mode: "all",
    });

    const {
        fields: members,
        append,
        update,
        remove,
    } = useFieldArray({
        control,
        name: "members",
    });
    const onStep1Submit = async () => {
        const isStep1Valid = await trigger([
            "title",
            "date",
            "currency",
            "description",
        ]);
        if (isStep1Valid) {
            setStep(2);
        }
    };

    const onSubmit = async (data: GroupRequest) => {
        clearErrors();
        try {
            const result = await createGroup.mutateAsync({ data });
            setGroup(result.data);
            setStep(3);
            window.history.pushState({}, "", `/${result.data.edit_token}`);
        } catch (error: any) {
            handleApiError(error as ApiError, setError);
        }
    };

    // TODO: Extract all direction based icon
    const nextIcon =
        direction === "rtl" ? (
            <IconArrowLeft className="size-4" />
        ) : (
            <IconArrowRight className="size-4" />
        );
    const prevIcon =
        direction === "rtl" ? (
            <IconArrowRight className="size-4" />
        ) : (
            <IconArrowLeft className="size-4" />
        );

    return (
        <div className="w-full max-w-lg mx-auto mb-8 flex flex-col justify-center min-h-main">
            <div className="mb-6 text-xl font-medium flex items-center gap-2">
                <IconSquareRoundedPlus />
                <h1>{t("ui.create") + t("pages.new.title")}</h1>
            </div>

            <Card className="mb-4">
                <div className="flex item-center justify-between relative flex-nowrap text-nowrap">
                    <IconInfoHexagon
                        className={cn(
                            "flex shrink-0 item-center justify-center text-sm size-6 p-1 rounded transition-all",
                            step >= 1
                                ? "bg-action text-action-fg"
                                : "bg-action-soft text-action-fg"
                        )}
                    />
                    <div
                        className={cn(
                            "w-full h-full mt-2.5 border-b transition-all",
                            step >= 1 ? "border-action" : "border-action-soft"
                        )}
                    />
                    <div
                        className={cn(
                            "w-full h-full mt-2.5 border-b transition-all",
                            step >= 2 ? "border-action" : "border-action-soft"
                        )}
                    />
                    <IconUserPlus
                        className={cn(
                            "flex shrink-0 item-center justify-center text-sm size-6 p-1 rounded transition-all",
                            step >= 2
                                ? "bg-action text-action-fg"
                                : "bg-action-soft text-action-fg"
                        )}
                    />
                    <div
                        className={cn(
                            "w-full h-full mt-2.5 border-b transition-all",
                            step >= 2 ? "border-action" : "border-action-soft"
                        )}
                    />
                    <div
                        className={cn(
                            "w-full h-full mt-2.5 border-b transition-all",
                            step >= 3 ? "border-action" : "border-action-soft"
                        )}
                    />
                    <IconChecks
                        className={cn(
                            "flex shrink-0 item-center justify-center text-sm size-6 p-1 rounded transition-all",
                            step >= 3
                                ? "bg-action text-action-fg"
                                : "bg-action-soft text-action-fg"
                        )}
                    />
                </div>
            </Card>

            <Card className="overflow-x-clip">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={`step-${step}`}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-1">
                                {ICON[step - 1]}
                                <h2>{t(TITLE[step - 1])}</h2>
                            </div>
                            <span className="text-muted text-xs">{step}/3</span>
                        </div>
                        {step === 1 && (
                            <Form
                                className="space-y-6"
                                onSubmit={handleSubmit(onStep1Submit)}
                            >
                                <Controller
                                    control={control}
                                    name="title"
                                    render={({ field }) => (
                                        <InputField
                                            label={t("attributes.title")}
                                            {...field}
                                            disabled={isSubmitting}
                                            isRequired
                                            isInvalid={!!errors.title}
                                            error={errors?.title}
                                        />
                                    )}
                                />
                                <div className="flex gap-4">
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
                                        name="currency"
                                        render={({ field }) => (
                                            <Select
                                                items={[
                                                    {
                                                        id: 1,
                                                        label: t("ui.rial"),
                                                        value: {
                                                            display_unit:
                                                                "rial",
                                                            code: "IRR",
                                                            conversion_factor: 1,
                                                            decimal_precision: 0,
                                                        },
                                                    },
                                                    {
                                                        id: 2,
                                                        label: t("ui.toman"),
                                                        value: {
                                                            display_unit:
                                                                "toman",
                                                            code: "IRR",
                                                            conversion_factor: 10,
                                                            decimal_precision: 0,
                                                        },
                                                    },
                                                    {
                                                        id: 3,
                                                        label: t(
                                                            "ui.hezartoman"
                                                        ),
                                                        value: {
                                                            display_unit:
                                                                "hezartoman",
                                                            code: "IRR",
                                                            conversion_factor: 10000,
                                                            decimal_precision: 0,
                                                        },
                                                    },
                                                    {
                                                        id: 4,
                                                        label: t("ui.dollar"),
                                                        value: {
                                                            display_unit:
                                                                "dollar",
                                                            code: "USD",
                                                            conversion_factor: 1,
                                                            decimal_precision: 2,
                                                        },
                                                    },
                                                ]}
                                                label={t("attributes.currency")}
                                                {...field}
                                                isInvalid={!!errors.currency}
                                                error={errors?.currency}
                                            />
                                        )}
                                    />
                                </div>
                                <Controller
                                    control={control}
                                    name="description"
                                    render={({ field }) => (
                                        <InputField
                                            label={t("attributes.description")}
                                            {...field}
                                            inputClassName="min-h-32"
                                            multiline
                                            disabled={isSubmitting}
                                            isInvalid={!!errors.description}
                                            error={errors?.description}
                                        />
                                    )}
                                />

                                <Button
                                    isDisabled={!isDirty || isSubmitting}
                                    className="w-full justify-between"
                                    type="submit"
                                >
                                    {t("ui.next")}
                                    {nextIcon}
                                </Button>
                            </Form>
                        )}
                        {step === 2 && (
                            <>
                                <MemberListWithForm
                                    members={members}
                                    onAdd={append}
                                    onUpdate={update}
                                    onDelete={remove}
                                    disabled={isSubmitting}
                                    className=""
                                />
                                {errors.members && (
                                    <div className="text-red-500">
                                        {errors.members.message}
                                    </div>
                                )}
                                <div className="w-full flex gap-2">
                                    <Button
                                        // intent="neutral"
                                        variant="outline"
                                        onPress={() => {
                                            setStep(1);
                                        }}
                                    >
                                        {prevIcon}
                                    </Button>
                                    <Button
                                        isDisabled={isSubmitting}
                                        className="w-full justify-between"
                                        onPress={() => handleSubmit(onSubmit)()}
                                    >
                                        {isSubmitting
                                            ? t("ui.creating")
                                            : t("ui.create") +
                                              t("attributes.group")}
                                        <IconChecks className="size-4" />
                                    </Button>
                                </div>
                            </>
                        )}
                        {step === 3 && (
                            <>
                                <div className="flex flex-col items-center justify-center">
                                    <CheckmarkAnimation />{" "}
                                    <p className="mt-2">
                                        {t("ui.groupCreateSuccess", {
                                            name: group?.title || "",
                                        })}
                                    </p>
                                </div>
                                <div className="w-full flex gap-2 border border-border rounded px-2 py-4 text-xs bg-muted-faint text-action mb-6">
                                    <IconChecks className="size-4 shrink-0" />
                                    <p>{t("ui.groupAccessInfo")}</p>
                                </div>
                                <ShareForm />
                                <Button
                                    className="w-full justify-between"
                                    onPress={() => {
                                        navigate(`/${group?.edit_token}`, {
                                            replace: true,
                                        });
                                    }}
                                >
                                    <span>{t("ui.goToDashboard")}</span>
                                    {nextIcon}
                                </Button>
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </Card>
        </div>
    );
}

export default New;
