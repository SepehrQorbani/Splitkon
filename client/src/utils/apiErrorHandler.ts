import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ApiError, ApiErrorResponse } from "@/types/api/errors";

export const handleApiError = <T extends FieldValues>(
    error: ApiError,
    setError: UseFormSetError<T>,
    context: string = "submission"
) => {
    const errorData = error.cause?.data || ({} as ApiErrorResponse);
    const status = error.cause?.status;
    if (status === 422 && errorData.errors) {
        Object.entries(errorData.errors).forEach(([field, messages]) => {
            setError(field as Path<T>, {
                type: "server",
                message: Array.isArray(messages) ? messages[0] : messages,
            });
        });
    } else {
        const message = errorData.message;
        // TODO:
        console.error(message);
    }

    //TODO:
    if (!status || status >= 500) {
        console.error(`Failed to ${context}:`, error);
    }
};
