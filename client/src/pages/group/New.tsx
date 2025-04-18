import { createGroup } from "@/api/endpoints/groups";
import { Button } from "@/components/common/Button";
import { Card, CardTitle } from "@/components/common/Card";
import DatePicker from "@/components/common/DatePicker";
import InputField from "@/components/common/InputField";
import MemberListWithForm from "@/components/features/members/MemberListWithForm";
import { useTranslations } from "@/hooks/useTranslations";
import { GroupRequest } from "@/types/api/group";
import { GroupInput, GroupInputSchema } from "@/types/schemas/group";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-aria-components";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

function New() {
    const { t } = useTranslations();
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
            const result = await createGroup(data);
            navigate(`/${result.data.edit_token}`);
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
