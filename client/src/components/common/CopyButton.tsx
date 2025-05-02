import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { Button } from "./Button";
import { IconChecks, IconCopy, IconCopyCheck } from "@tabler/icons-react";
import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/utils/cn";

type CopyButtonProps = { data: string; className?: string };

export function CopyIcons({ isCopied }: { isCopied: boolean }) {
    return (
        <>
            <IconCopy
                className={cn(
                    "size-4 transition-all duration-300",
                    isCopied ? "scale-0" : "scale-100"
                )}
            />
            <IconChecks
                className={cn(
                    "absolute size-4 transition-all duration-300",
                    isCopied ? "scale-100" : "scale-0"
                )}
            />
        </>
    );
}

function CopyButton({ data, className }: CopyButtonProps) {
    const { t } = useTranslations();
    const { isCopied, error, copyToClipboard } = useCopyToClipboard({
        timeout: 2000,
    });
    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label={t("ui.copy")}
            className={className}
            onPress={() => !isCopied(data) && copyToClipboard(data)}
        >
            <CopyIcons isCopied={isCopied(data)} />
        </Button>
    );
}

export default CopyButton;
