import { Button } from "@/components/common/Button";
import { Drawer } from "@/components/common/Drawer";
import { useTranslations } from "@/hooks/useTranslations";
import { IconQrcode, IconX } from "@tabler/icons-react";
import QRCodeStyling, { Options } from "qr-code-styling";
import { useEffect, useRef, useState } from "react";

function QrModal() {
    const { t } = useTranslations();

    return (
        <Drawer modalKey="qr-code">
            {({ data, close }) => {
                const [options, setOptions] = useState<Options>({
                    type: "canvas",
                    shape: "square",
                    width: 250,
                    height: 250,
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
                        imageSize: 0.4,
                        margin: 6,
                    },
                    dotsOptions: {
                        type: "rounded",
                        color: "#000000",
                        roundSize: true,
                    },
                    backgroundOptions: { round: 0, color: "#ffffff" },
                    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEwIiBoZWlnaHQ9IjUxMCIgdmlld0JveD0iMCAwIDUxMCA1MTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yODMuNjI0IDEyMEMyOTMuOTgyIDEyMCAzMDAuMzE5IDEzMS4zNjggMjk0Ljg3MyAxNDAuMTc4TDE0NC40NzMgMzgzLjQ3MkMxMzcuNDY5IDM5NC44MDMgMTIwIDM4OS44MzkgMTIwIDM3Ni41MTlMMTIwIDEzMy4yMjRDMTIwIDEyNS45MjEgMTI1LjkyMSAxMjAgMTMzLjIyNCAxMjBMMjgzLjYyNCAxMjBaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNMzY1LjUyNyAxMjYuNTI4QzM3Mi41MzEgMTE1LjE5NyAzOTAgMTIwLjE2MSAzOTAgMTMzLjQ4MUwzOTAgMzc2Ljc3NUMzOTAgMzg0LjA3OSAzODQuMDc5IDM5MCAzNzYuNzc1IDM5MEgyMjYuMzc2QzIxNi4wMTggMzkwIDIwOS42ODEgMzc4LjYzMiAyMTUuMTI3IDM2OS44MjJMMzY1LjUyNyAxMjYuNTI4WiIgZmlsbD0iYmxhY2siLz4KPHJlY3QgeD0iMzAiIHk9IjMwIiB3aWR0aD0iNDUwIiBoZWlnaHQ9IjQ1MCIgcng9IjIiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNjAiLz4KPC9zdmc+Cg==",
                    // image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEwIiBoZWlnaHQ9IjUxMCIgdmlld0JveD0iMCAwIDUxMCA1MTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yODMuNjI0IDEyMEMyOTMuOTgyIDEyMCAzMDAuMzE5IDEzMS4zNjggMjk0Ljg3MyAxNDAuMTc4TDE0NC40NzMgMzgzLjQ3MkMxMzcuNDY5IDM5NC44MDMgMTIwIDM4OS44MzkgMTIwIDM3Ni41MTlMMTIwIDEzMy4yMjRDMTIwIDEyNS45MjEgMTI1LjkyMSAxMjAgMTMzLjIyNCAxMjBMMjgzLjYyNCAxMjBaIiBmaWxsPSIjNjE1RkZGIi8+CjxwYXRoIGQ9Ik0zNjUuNTI3IDEyNi41MjhDMzcyLjUzMSAxMTUuMTk3IDM5MCAxMjAuMTYxIDM5MCAxMzMuNDgxTDM5MCAzNzYuNzc1QzM5MCAzODQuMDc5IDM4NC4wNzkgMzkwIDM3Ni43NzUgMzkwSDIyNi4zNzZDMjE2LjAxOCAzOTAgMjA5LjY4MSAzNzguNjMyIDIxNS4xMjcgMzY5LjgyMkwzNjUuNTI3IDEyNi41MjhaIiBmaWxsPSIjNjE1RkZGIi8+CjxyZWN0IHg9IjMwIiB5PSIzMCIgd2lkdGg9IjQ1MCIgaGVpZ2h0PSI0NTAiIHJ4PSIyIiBzdHJva2U9IiM2MTVGRkYiIHN0cm9rZS13aWR0aD0iNjAiLz4KPC9zdmc+Cg==",
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
                                <IconQrcode className="size-4 shrink-0" />
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
                            <div ref={ref} className="*:w-full *:p-2" />
                        </div>
                    ),
                };
            }}
        </Drawer>
    );
}

export default QrModal;
