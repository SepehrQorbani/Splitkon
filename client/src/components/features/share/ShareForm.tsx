import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useShare } from "@/hooks/useShare";
import { useTranslations } from "@/hooks/useTranslations";
import { useGroupStore } from "@/store/group";
import { IconCopy, IconCopyCheck, IconShare } from "@tabler/icons-react";
import { Button } from "@/components/common/Button";

function ShareForm() {
    const { t } = useTranslations();
    const group = useGroupStore((state) => state.group);
    const {
        isCopied,
        error: copyError,
        copyToClipboard,
    } = useCopyToClipboard({
        timeout: 2000,
    });
    const { isShared, error: shareError, canShare, share } = useShare();

    if (!group) return;

    const baseUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
    const editUrl = group?.edit_token ? `${baseUrl}/${group.edit_token}` : null;
    const viewUrl = `${baseUrl}/${group?.view_token}`;

    const shareData = (url: string) => ({
        title: group?.title,
        text: group.description,
        url,
    });

    return (
        <div className="space-y-4 mb-4">
            {editUrl && (
                <div className="space-y-1">
                    <h3 className="text-muted text-xs">{t("لینک ویرایش")}</h3>
                    <div className="flex items-center justify-between gap-2 rounded border border-border p-1">
                        <div className="flex gap-1">
                            {canShare(shareData(editUrl)) && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label={t("اشتراک لینک ویرایش")}
                                    onPress={() => share(shareData(editUrl))}
                                >
                                    <IconShare className="size-4" />
                                </Button>
                            )}

                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label={t("کپی لینک ویرایش")}
                                onPress={() => copyToClipboard(editUrl)}
                            >
                                {isCopied(editUrl) ? (
                                    <IconCopyCheck className="size-4" />
                                ) : (
                                    <IconCopy className="size-4" />
                                )}
                            </Button>
                        </div>
                        <div
                            className="overflow-x-auto overflow-y-hidden text-sm"
                            style={{ scrollbarWidth: "none" }}
                        >
                            {editUrl}
                        </div>
                    </div>
                    {(copyError || shareError) &&
                        !isCopied(editUrl) &&
                        !isShared && (
                            <p className="text-red-500 text-xs">
                                {t("خطا در عملیات")}
                            </p>
                        )}
                </div>
            )}
            <div className="space-y-1">
                <h3 className="text-muted text-xs">{t("لینک نمایش")}</h3>
                <div className="flex items-center justify-between gap-2 rounded border border-border p-1">
                    <div className="flex gap-1">
                        {canShare(shareData(viewUrl)) && (
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label={t("اشتراک لینک نمایش")}
                                onPress={() => share(shareData(viewUrl))}
                            >
                                <IconShare className="size-4" />
                            </Button>
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label={t("کپی لینک نمایش")}
                            onPress={() => copyToClipboard(viewUrl)}
                        >
                            {isCopied(viewUrl) ? (
                                <IconCopyCheck className="size-4" />
                            ) : (
                                <IconCopy className="size-4" />
                            )}
                        </Button>
                    </div>
                    <div
                        className="overflow-x-auto overflow-y-hidden text-sm"
                        style={{ scrollbarWidth: "none" }}
                    >
                        {viewUrl}
                    </div>
                </div>
                {(copyError || shareError) &&
                    !isCopied(viewUrl) &&
                    !isShared && (
                        <p className="text-red-500 text-xs">
                            {t("خطا در عملیات")}
                        </p>
                    )}
            </div>
        </div>
    );
}

export default ShareForm;
