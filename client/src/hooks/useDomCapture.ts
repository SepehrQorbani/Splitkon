import { useRef } from "react";
import { preCache, snapdom } from "@zumer/snapdom";
import { expandScrollPlugin } from "@/utils/expandScrollPlugin";
import { logoOverlayPlugin } from "@/utils/logoOverlayPlugin";

export interface UseDomCaptureOptions {
    filename?: string;
    scale?: number;
    backgroundColor?: string;
    embedFonts?: boolean;
    withLogo?: boolean;
    logoOptions?: Parameters<typeof logoOverlayPlugin>[0];
}

export const useDomCapture = <T extends HTMLElement = HTMLDivElement>({
    filename = "capture",
    scale = 3,
    backgroundColor = "#ffffff",
    embedFonts = true,
    withLogo = true,
    logoOptions = { height: 10, opacity: 0.9, margin: 8 },
}: UseDomCaptureOptions = {}) => {
    const targetRef = useRef<T>(null);

    const capture = async () => {
        if (!targetRef.current) return;

        const plugins = [expandScrollPlugin];
        if (withLogo) {
            // plugins.push([logoOverlayPlugin, logoOptions]);
            plugins.push(logoOverlayPlugin(logoOptions));
        }

        try {
            await preCache(targetRef.current, {
                embedFonts,
            });
            const outputImage = await snapdom(targetRef.current, {
                scale,
                backgroundColor,
                embedFonts,
                plugins,
            });

            await outputImage.download({ filename });
        } catch (error) {
            console.error("Capture failed:", error);
        }
    };

    return { targetRef, capture };
};
