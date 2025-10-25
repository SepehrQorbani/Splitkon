import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/utils/cn";
import type { Icon } from "@tabler/icons-react";
import { IconChecks, IconCopy } from "@tabler/icons-react";
import {
    ReactElement,
    cloneElement,
    createElement,
    isValidElement,
} from "react";
import { Button } from "./Button";

type CopyButtonProps = {
    data: string;
    className?: string;
    copyIcon?: Icon | ReactElement;
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
    copyIcon?: Icon | ReactElement;
    copiedIcon?: Icon;
    iconSize?: string;
}) {
    const CopyIconComponent = isValidElement(copyIcon)
        ? undefined
        : (copyIcon as any) ?? IconCopy;
    const CopiedIconEl = copiedIcon ?? IconChecks;

    return (
        <>
            {isValidElement(copyIcon)
                ? cloneElement(copyIcon as any, {
                      className: cn(
                          "size-4 transition-all duration-300",
                          iconSize,
                          isCopied ? "scale-0" : "scale-100",
                          (copyIcon as any).props?.className
                      ),
                  })
                : createElement(CopyIconComponent as any, {
                      className: cn(
                          "size-4 transition-all duration-300",
                          iconSize,
                          isCopied ? "scale-0" : "scale-100"
                      ),
                  })}
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
