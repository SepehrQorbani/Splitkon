import { useEffect, useMemo, useState } from "react";
import QRCodeStyling, { Options } from "qr-code-styling";
import { generateLogoSVG } from "./useQRCode";

export interface UseQRCodeOptions {
    width?: number;
    height?: number;
    image?: string;
    color?: string;
    backgroundColor?: string;
    qrOptions?: Partial<Options["qrOptions"]>;
    dotsOptions?: Partial<Options["dotsOptions"]>;
    backgroundOptions?: Partial<Options["backgroundOptions"]>;
    imageOptions?: Partial<Options["imageOptions"]>;
    cornersSquareOptions?: Partial<Options["cornersSquareOptions"]>;
    cornersDotOptions?: Partial<Options["cornersDotOptions"]>;
}

export const useQRCodeBlob = (
    data: string | null,
    options: UseQRCodeOptions = {}
) => {
    const [qrBlobUrl, setQrBlobUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const {
        width = 250,
        height = 250,
        color = "#000000",
        backgroundColor = "#ffffff",
        qrOptions = {},
        dotsOptions = {},
        backgroundOptions = {},
        imageOptions = {},
        cornersSquareOptions = {},
        cornersDotOptions = {},
    } = options;

    // ✅ useMemo همیشه فراخوانی می‌شه — حتی اگر data خالی باشه
    const qr = useMemo(() => {
        if (!data) return null; // فقط QR را null می‌کنیم

        const image = generateLogoSVG(color);
        return new QRCodeStyling({
            type: "svg",
            shape: "square",
            width,
            height,
            data,
            margin: 0,
            qrOptions: {
                typeNumber: 0,
                mode: "Byte",
                errorCorrectionLevel: "Q",
                ...qrOptions,
            },
            imageOptions: {
                saveAsBlob: true,
                hideBackgroundDots: true,
                imageSize: 0.4,
                margin: 6,
                ...imageOptions,
            },
            dotsOptions: {
                type: "rounded",
                color,
                roundSize: true,
                ...dotsOptions,
            },
            backgroundOptions: {
                round: 0,
                color: backgroundColor,
                ...backgroundOptions,
            },
            image,
            cornersSquareOptions: {
                type: "rounded",
                color,
                ...cornersSquareOptions,
            },
            cornersDotOptions: {
                type: "rounded",
                color,
                ...cornersDotOptions,
            },
        });
    }, [
        data,
        width,
        height,
        color,
        backgroundColor,
        JSON.stringify(qrOptions),
        JSON.stringify(dotsOptions),
        JSON.stringify(backgroundOptions),
        JSON.stringify(imageOptions),
        JSON.stringify(cornersSquareOptions),
        JSON.stringify(cornersDotOptions),
    ]);

    // ✅ useEffect هم همیشه فراخوانی می‌شه
    useEffect(() => {
        if (!data || !qr) {
            setQrBlobUrl(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        qr.getRawData("png").then((blob) => {
            if (blob) {
                const url = URL.createObjectURL(blob as Blob);
                setQrBlobUrl(url);
            }
            setIsLoading(false);
        });
    }, [data, qr]);

    // ✅ cleanup هم همیشه فعال است
    useEffect(() => {
        return () => {
            if (qrBlobUrl) {
                URL.revokeObjectURL(qrBlobUrl);
            }
        };
    }, [qrBlobUrl]);

    // ✅ حالا خروجی همیشه بعد از تمام هُک‌هاست
    return { qrBlobUrl, isLoading };
};
