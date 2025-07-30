import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { Button } from "./Button";
import { IconChecks, IconCopy } from "@tabler/icons-react";
import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/utils/cn";
import type { Icon } from "@tabler/icons-react";

type CopyButtonProps = {
    data: string;
    className?: string;
    copyIcon?: Icon;
    copiedIcon?: Icon;
    iconSize?: string;
};

export function CopyIcons({
    isCopied,
    copyIcon,
    copiedIcon,
    iconSize,
}: {
    isCopied: boolean;
    copyIcon?: Icon;
    copiedIcon?: Icon;
    iconSize?: string;
}) {
    const CopyIconEl = copyIcon ?? IconCopy;
    const CopiedIconEl = copiedIcon ?? IconChecks;

    return (
        <>
            <CopyIconEl
                className={cn(
                    "size-4 transition-all duration-300",
                    iconSize,
                    isCopied ? "scale-0" : "scale-100"
                )}
            />
            <CopiedIconEl
                className={cn(
                    "absolute size-4 transition-all duration-300",
                    iconSize,
                    isCopied ? "scale-100" : "scale-0"
                )}
            />
        </>
    );
}

function CopyButton({
    data,
    className,
    copyIcon,
    copiedIcon,
    iconSize,
}: CopyButtonProps) {
    const { t } = useTranslations();
    const { isCopied, error, copyToClipboard } = useCopyToClipboard({
        timeout: 2000,
    });
    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label={t("ui.copy")}
            className={cn("p-1 relative", className)}
            onPress={() => !isCopied(data) && copyToClipboard(data)}
        >
            <CopyIcons
                isCopied={isCopied(data)}
                copyIcon={copyIcon}
                copiedIcon={copiedIcon}
                iconSize={iconSize}
            />
        </Button>
    );
}

CopyButton.displayName = "CopyButton";

export default CopyButton;
