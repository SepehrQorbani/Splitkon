import { Drawer } from "@/components/common/Drawer";
import { useTranslations } from "@/hooks/useTranslations";
import { IconDownload } from "@tabler/icons-react";
import Export from "./Export";
import ExportMember from "./ExportMember";

function ExportModal() {
    const { t } = useTranslations();

    return (
        <Drawer modalKey="export">
            {({ data, close }) => {
                let isLoading = false;

                if (data && typeof data === "object" && "member" in data) {
                    return {
                        isLoading: isLoading,
                        title: (
                            <div className="flex items-center gap-2">
                                <IconDownload className="size-4" />
                                {t("ui.export")}
                            </div>
                        ),
                        body: <ExportMember member={data.member} />,
                    };
                }

                return {
                    isLoading: isLoading,
                    title: (
                        <div className="flex items-center gap-2">
                            <IconDownload className="size-4" />
                            {t("ui.export")}
                        </div>
                    ),
                    body: <Export />,
                };
            }}
        </Drawer>
    );
}

export default ExportModal;
