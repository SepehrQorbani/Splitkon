import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { Button } from "./Button";
import { IconCopy, IconCopyCheck } from "@tabler/icons-react";
import { useTranslations } from "@/hooks/useTranslations";

type Props = { data: string; className?: string };

function CopyButton({ data, className }: Props) {
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
            onPress={() => copyToClipboard(data)}
        >
            {isCopied(data) ? (
                <IconCopyCheck className="size-4" />
            ) : (
                <IconCopy className="size-4" />
            )}
        </Button>
    );
}

export default CopyButton;
