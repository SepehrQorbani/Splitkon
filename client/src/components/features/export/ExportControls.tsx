import { Button } from "@/components/common/Button";
import ToggleButtonGroup from "@/components/common/ToggleButtonGroup";
import { useTranslations } from "@/hooks/useTranslations";
import {
    IconAdjustments,
    IconLayoutList,
    IconPalette,
    IconPhotoDown,
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
}: {
    exportSection: string[];
    onSectionChange: (v: string[]) => void;
    onCapture: () => void;
    exportStyle: "table" | "cards";
    onStyleChange: (style: "table" | "cards") => void;
    sections: { id: string; icon?: React.ReactNode }[];
}) => {
    const { t } = useTranslations();
    return (
        <div className="flex items-center gap-2 pb-2 px-2">
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
            <Button
                size="sm"
                onPress={onCapture}
                className="gap-4 h-8 text-xs px-4 ms-auto mt-auto"
            >
                <IconPhotoDown className="size-4" />
                <span>{t("ui.download")}</span>
            </Button>
        </div>
    );
};
