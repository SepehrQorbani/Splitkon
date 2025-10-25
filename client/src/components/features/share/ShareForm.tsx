import { Button } from "@/components/common/Button";
import { CopyIcons } from "@/components/common/CopyButton";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useShare } from "@/hooks/useShare";
import { useTranslations } from "@/hooks/useTranslations";
import { useGroupStore } from "@/store/group";
import { useModalStore } from "@/store/modals";
import { IconQrcode, IconShare } from "@tabler/icons-react";

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
    const openModal = useModalStore((state) => state.openModal);

    if (!group) {
        return (
            <div className="flex items-center justify-center flex-1 p-12">
                <div
                    className="inline-block animate-spin rounded-full border-2 border-t-action border-r-action border-b-border border-l-border size-4"
                    role="status"
                    aria-label="Loading"
                />
            </div>
        );
    }

    const baseUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
    const editUrl = group?.edit_token ? `${baseUrl}/${group.edit_token}` : null;
    const viewUrl = `${baseUrl}/${group?.view_token}`;
    const shareData = (url: string) => ({
        title: group?.title ?? "",
        text: group?.description ?? "",
        url,
    });

    return (
        <div className="space-y-4 pb-2">
            {editUrl && (
                <div className="space-y-1">
                    <h3 className="text-muted text-xs">{t("ui.editLink")}</h3>
                    <div className="flex items-center justify-between gap-2 rounded border border-border p-1">
                        <div className="flex gap-1">
                            {editUrl && canShare(shareData(editUrl)) && (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label={t("ui.editLinkShare")}
                                        onPress={() =>
                                            share(shareData(editUrl))
                                        }
                                    >
                                        <IconShare className="size-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label={t("ui.editLinkShare")}
                                        onPress={() =>
                                            openModal("qr-code", editUrl)
                                        }
                                    >
                                        <IconQrcode className="size-4" />
                                    </Button>
                                </>
                            )}

                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label={t("ui.editLinkCopy")}
                                onPress={() => copyToClipboard(editUrl)}
                            >
                                <CopyIcons isCopied={isCopied(editUrl)} />
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
                                {t("ui.errorInAction")}
                            </p>
                        )}
                </div>
            )}
            <div className="space-y-1">
                <h3 className="text-muted text-xs">{t("ui.viewLink")}</h3>
                <div className="flex items-center justify-between gap-2 rounded border border-border p-1">
                    <div className="flex gap-1">
                        {canShare(shareData(viewUrl)) && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label={t("ui.viewLinkShare")}
                                    onPress={() => share(shareData(viewUrl))}
                                >
                                    <IconShare className="size-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label={t("ui.viewLinkShare")}
                                    onPress={() =>
                                        openModal("qr-code", viewUrl)
                                    }
                                >
                                    <IconQrcode className="size-4" />
                                </Button>
                            </>
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label={t("ui.viewLinkCopy")}
                            onPress={() => copyToClipboard(viewUrl)}
                        >
                            <CopyIcons isCopied={isCopied(viewUrl)} />
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
                            {t("ui.errorInAction")}
                        </p>
                    )}
            </div>
        </div>
    );
}

export default ShareForm;
