export interface ApiErrorResponse {
    errors?: Record<string, string | string[]>;
    message?: string;
}

export interface ApiError extends Error {
    cause?: {
        status?: number;
        data?: ApiErrorResponse;
    };
}
