import { ReactNode } from "react";

interface AsyncContentProps {
    isLoading: boolean;
    error: unknown;
    loadingMessage?: string;
    errorMessage?: string;
    skeleton?: ReactNode;
    children: ReactNode;
}

export function AsyncContent({
    isLoading,
    error,
    loadingMessage = "در حال بارگذاری...",
    errorMessage = "خطا در دریافت داده‌ها",
    skeleton,
    children,
}: AsyncContentProps) {
    if (isLoading) {
        return skeleton ? <>{skeleton}</> : <div>{loadingMessage}</div>;
    }

    if (error) {
        return (
            <div>
                {errorMessage}: {(error as Error).message}
            </div>
        );
    }

    return <>{children}</>;
}
