import { useEffect } from "react";
import { useTranslations } from "./useTranslations";

const useDocumentTitle = (title: string | null | undefined) => {
    const { t } = useTranslations();

    useEffect(() => {
        const originalTitle = document.title;
        const appName = t("ui.appName");
        document.title = title ? `${appName} - ${title}` : appName;

        return () => {
            document.title = originalTitle;
        };
    }, [title]);
};

export default useDocumentTitle;
