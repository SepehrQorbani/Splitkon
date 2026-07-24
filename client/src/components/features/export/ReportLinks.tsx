import {
    IconDownload,
    IconFileExcel,
    IconFileTypeCsv,
    IconFileTypePdf,
} from "@tabler/icons-react";
import { useParams } from "react-router";
import { useTranslations } from "@/hooks/useTranslations";

function ReportLinks() {
    const { t } = useTranslations();
    const { token } = useParams();
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
    const exportUrl = `${baseUrl}/api/groups/${token}/export`;

    const links = [
        {
            url: `${exportUrl}?format=csv`,
            fileIcon: IconFileTypeCsv,
            fileType: "CSV",
        },
        {
            url: `${exportUrl}?format=xlsx`,
            fileIcon: IconFileExcel,
            fileType: "Excel",
        },
        {
            url: `${exportUrl}?format=pdf`,
            fileIcon: IconFileTypePdf,
            fileType: "PDF",
        },
    ];
    return (
        <div className="flex flex-col gap-2 p-2 mb-4">
            {links.map((link) => (
                <a
                    key={link.fileType}
                    href={link.url}
                    className="border border-border rounded px-2 py-4 cursor-pointer flex items-center justify-between shadow-input hover:bg-action hover:text-action-fg transition-all"
                >
                    <div className="flex items-center gap-2 text-xs">
                        <link.fileIcon className="size-4" />
                        <span>{t("ui.download")} {link.fileType}</span>
                    </div>
                    <IconDownload className="size-4" />
                </a>
            ))}
        </div>
    );
}

export default ReportLinks;
