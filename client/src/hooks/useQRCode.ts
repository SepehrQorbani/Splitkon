import { useEffect, useRef, useState } from "react";
import QRCodeStyling, { Options } from "qr-code-styling";

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

export const useQRCode = (
    data: string | null,
    options: UseQRCodeOptions = {}
) => {
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

    const ref = useRef<HTMLDivElement>(null);
    const image = generateLogoSVG(color);
    const [qrCode] = useState<QRCodeStyling>(
        () =>
            new QRCodeStyling({
                type: "svg",
                shape: "square",
                width,
                height,
                data: data || "",
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
                    color: color,
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
                    color: color,
                    ...cornersSquareOptions,
                },
                cornersDotOptions: {
                    type: "rounded",
                    color: color,
                    ...cornersDotOptions,
                },
            })
    );

    useEffect(() => {
        if (data) qrCode.update({ data });
        // if (image) qrCode.update({ image });
    }, [data, image, qrCode]);

    useEffect(() => {
        if (ref.current) {
            ref.current.innerHTML = "";
            qrCode.append(ref.current);
        }
    }, [qrCode, ref]);

    return { ref };
};

export const generateLogoSVG = (color: string): string => {
    const svg = `
    <svg width="510" height="510" viewBox="0 0 510 510" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M283.624 120C293.982 120 300.319 131.368 294.873 140.178L144.473 383.472C137.469 394.803 120 389.839 120 376.519L120 133.224C120 125.921 125.921 120 133.224 120L283.624 120Z" fill="${color}"/>
      <path d="M365.527 126.528C372.531 115.197 390 120.161 390 133.481L390 376.775C390 384.079 384.079 390 376.775 390H226.376C216.018 390 209.681 378.632 215.127 369.822L365.527 126.528Z" fill="${color}"/>
      <rect x="30" y="30" width="450" height="450" rx="2" stroke="${color}" stroke-width="60"/>
    </svg>
  `.trim();

    return `data:image/svg+xml;base64,${svgToBase64(svg)}`;
};

export const svgToBase64 = (svg: string): string => {
    const encoded = encodeURIComponent(svg).replace(
        /%([0-9A-F]{2})/g,
        (_, p1) => String.fromCharCode(parseInt(p1, 16))
    );
    return btoa(encoded);
};
