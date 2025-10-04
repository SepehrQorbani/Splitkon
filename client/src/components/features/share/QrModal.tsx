import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import { Button } from "@/components/common/Button";
import { Drawer } from "@/components/common/Drawer";
import { useTranslations } from "@/hooks/useTranslations";
import { IconQrcode, IconShare, IconX } from "@tabler/icons-react";
import QRCodeStyling, {
    DrawType,
    TypeNumber,
    Mode,
    ErrorCorrectionLevel,
    DotType,
    CornerSquareType,
    CornerDotType,
    Options,
} from "qr-code-styling";

function QrModal() {
    const { t } = useTranslations();

    return (
        <Drawer modalKey="qr-code">
            {({ data, close }) => {
                const [options, setOptions] = useState<Options>({
                    type: "canvas",
                    shape: "square",
                    width: 300,
                    height: 300,
                    data: data as string,
                    margin: 0,
                    qrOptions: {
                        typeNumber: 0,
                        mode: "Byte",
                        errorCorrectionLevel: "Q",
                    },
                    imageOptions: {
                        saveAsBlob: true,
                        hideBackgroundDots: true,
                        imageSize: 0.3,
                        margin: 1,
                    },
                    dotsOptions: {
                        type: "rounded",
                        color: "#000000",
                        roundSize: true,
                    },
                    backgroundOptions: { round: 0, color: "#ffffff" },
                    image: "data:image/png;base64,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",
                    cornersSquareOptions: { type: "rounded", color: "#000000" },
                    cornersDotOptions: { type: "rounded", color: "#000000" },
                });
                const [qrCode, setQrCode] = useState<QRCodeStyling>(
                    new QRCodeStyling(options)
                );
                useEffect(() => {
                    if (data) {
                        setOptions((prev) => ({
                            ...prev,
                            data: data as string,
                        }));
                        setQrCode(new QRCodeStyling(options));
                    }
                }, [data]);
                const ref = useRef<HTMLDivElement>(null);

                useEffect(() => {
                    if (ref.current) {
                        qrCode.append(ref.current);
                    }
                }, [qrCode, ref]);

                useEffect(() => {
                    if (!qrCode) return;
                    qrCode.update(options);
                }, [qrCode, options]);

                return {
                    isLoading: false,
                    title: (
                        <div className="flex items-center justify-between">
                            <div className="flex gap-1 items-center">
                                <IconQrcode className="size-4" />
                                <span>{t("ui.shareQrCode")}</span>
                            </div>
                            <Button
                                variant="ghost"
                                className="size-8 p-1 text-muted"
                                onPress={close}
                            >
                                <IconX className="size-4" />
                            </Button>
                        </div>
                    ),

                    body: (
                        <div className="pb-8 flex justify-center items-center">
                            <div ref={ref} />
                        </div>
                    ),
                };
            }}
        </Drawer>
    );
}

export default QrModal;
