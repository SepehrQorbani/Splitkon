import { Button } from "@/components/common/Button";
import { useModalStore } from "@/store/modals";
import { IconQrcode } from "@tabler/icons-react";

export default function QrCodeButton({
    data,
    label = "QrCode",
}: {
    data: string;
    label?: string;
}) {
    const openModal = useModalStore((state) => state.openModal);

    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label={label}
            onPress={() => {
                openModal("qr-code", data);
            }}
        >
            <IconQrcode className="size-4" />
        </Button>
    );
}
