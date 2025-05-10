import { useTranslations } from "@/hooks/useTranslations";
import Error from "@/pages/Error";
import NotFound from "@/pages/NotFound";
import { ReactNode } from "react";

interface AsyncContentProps {
    isLoading: boolean;
    error: any;
    loadingMessage?: string;
    errorMessage?: string;
    skeleton?: ReactNode;
    children: ReactNode;
    refetch: () => void;
}

export default function AsyncContent({
    isLoading,
    error,
    loadingMessage = "loading",
    errorMessage = "errorFetchingData",
    skeleton,
    children,
    refetch,
}: AsyncContentProps) {
    const { t } = useTranslations();
    if (isLoading) {
        return skeleton || <div>{t(loadingMessage)}</div>;
    }

    if (error) {
        if (error.status === 404) {
            return <NotFound />;
        }
        return <Error message={t(errorMessage)} refetch={refetch} />;
    }

    return <>{children}</>;
}
