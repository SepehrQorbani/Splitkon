import { useCreateGroup } from "@/api/queries/groups";
import { Button } from "@/components/common/Button";
import { Card, CardTitle } from "@/components/common/Card";
import DatePicker from "@/components/common/DatePicker";
import InputField from "@/components/common/InputField";
import Select from "@/components/common/Select";
import MemberListWithForm from "@/components/features/members/MemberListWithForm";
import { useTranslations } from "@/hooks/useTranslations";
import { ApiError } from "@/types/api/errors";
import { GroupRequest } from "@/types/api/group";
import { GroupInput, GroupInputSchema } from "@/types/schemas/group";
import { handleApiError } from "@/utils/apiErrorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-aria-components";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

function New() {
    const { t } = useTranslations();
    const createGroup = useCreateGroup();
    const navigate = useNavigate();
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        clearErrors,
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
        mode: "onBlur",
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

    const onSubmit = async (data: GroupRequest) => {
        clearErrors();
        try {
            const result = await createGroup.mutateAsync({ data });
            navigate(`/${result.data.edit_token}`);
        } catch (error: any) {
            handleApiError(error as ApiError, setError);
        }
    };

    return (
        <Card className="w-full max-w-lg mx-auto mb-8">
            <CardTitle>
                <h1>{t("pages.new.title")}</h1>
            </CardTitle>

            <Form className="space-y-6">
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
                                            display_unit: "rial",
                                            code: "IRR",
                                            conversion_factor: 1,
                                            decimal_precision: 0,
                                        },
                                    },
                                    {
                                        id: 2,
                                        label: t("ui.toman"),
                                        value: {
                                            display_unit: "toman",
                                            code: "IRR",
                                            conversion_factor: 10,
                                            decimal_precision: 0,
                                        },
                                    },
                                    {
                                        id: 3,
                                        label: t("ui.hezartoman"),
                                        value: {
                                            display_unit: "hezartoman",
                                            code: "IRR",
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

                {errors.members && (
                    <div className="text-red-500">{errors.members.message}</div>
                )}
            </Form>
            <MemberListWithForm
                members={members}
                onAdd={append}
                onUpdate={update}
                onDelete={remove}
                disabled={isSubmitting}
                className="my-8"
            />
            <Button
                isDisabled={isSubmitting}
                className="w-full"
                onPress={() => handleSubmit(onSubmit)()}
            >
                {isSubmitting
                    ? t("ui.creating")
                    : t("ui.create") + t("attributes.group")}
            </Button>
        </Card>
    );
}

export default New;
