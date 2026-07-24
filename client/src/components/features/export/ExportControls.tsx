import { Button } from "@/components/common/Button";
import ToggleButtonGroup from "@/components/common/ToggleButtonGroup";
import { useTranslations } from "@/hooks/useTranslations";
import { useGroupStore } from "@/store";
import {
    IconAdjustments,
    IconEye,
    IconLayoutList,
    IconPalette,
    IconPencil,
    IconPhotoDown,
    IconQrcode,
    IconReceipt,
} from "@tabler/icons-react";
import { Label } from "react-aria-components";

export const ExportControls = ({
    exportSection,
    onSectionChange,
    onCapture,
    exportStyle,
    onStyleChange,
    sections,
    qrUrl,
    onQrUrlChange,
}: {
    exportSection: string[];
    onSectionChange: (v: string[]) => void;
    onCapture: () => void;
    exportStyle: "table" | "cards";
    onStyleChange: (style: "table" | "cards") => void;
    sections: { id: string; icon?: React.ReactNode }[];
    qrUrl: string;
    onQrUrlChange: (url: string) => void;
}) => {
    const { t } = useTranslations();
    const baseUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
    const group = useGroupStore((state) => state.group);

    return (
        <div className="sticky -mt-5 top-10 bg-surface mx-1- border-b border-border p-1 rounded- shadow-xs z-10">
            <div className="flex overflow-auto items-center justify-between gap-2 pb-2 px-2">
                <div>
                    <Label className="block mb-2">
                        <IconPalette className="size-4" />
                    </Label>
                    <ToggleButtonGroup
                        buttons={[
                            {
                                id: "table",
                                icon: <IconReceipt className="size-4" />,
                            },
                            {
                                id: "cards",
                                icon: <IconLayoutList className="size-4" />,
                            },
                        ]}
                        value={exportStyle}
                        onChange={(v) => onStyleChange(v as "table" | "cards")}
                        aria-label="toggle export sections"
                    />
                </div>
                <div>
                    <Label className="block mb-2">
                        <IconAdjustments className="size-4" />
                    </Label>
                    <ToggleButtonGroup
                        multiple
                        buttons={sections}
                        value={exportSection}
                        onChange={(v) => onSectionChange(v as string[])}
                        aria-label="toggle export sections"
                    />
                </div>
                <div>
                    <Label className="block mb-2">
                        <IconQrcode className="size-4" />
                    </Label>
                    <ToggleButtonGroup
                        buttons={[
                            {
                                id: `${baseUrl}/${group?.view_token}`,
                                icon: <IconEye className="size-4" />,
                            },
                            {
                                id: `${baseUrl}/${group?.edit_token}`,
                                icon: <IconPencil className="size-4" />,
                                disabled: !group?.edit_token,
                            },
                        ]}
                        value={qrUrl}
                        onChange={(v) => onQrUrlChange(v as string)}
                        aria-label="toggle export sections"
                    />
                </div>
            </div>
            <div className="flex items-center gap-2 pb-2 px-2">
                <Button
                    size="sm"
                    onPress={onCapture}
                    className="gap-4 h-8 text-xs px-4 mt-auto w-full"
                >
                    <IconPhotoDown className="size-4" />
                    <span>{t("ui.download")}</span>
                </Button>
            </div>
        </div>
    );
};
