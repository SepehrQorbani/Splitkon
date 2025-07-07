import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        laravel({
            input: "client/src/main.tsx",
            refresh: true,
        }),
        react(),
        tailwindcss(),
        VitePWA({
            registerType: "autoUpdate",
            injectRegister: "auto",
            manifest: {
                start_url: "/",
                name: "SplitKon",
                short_name: "SplitKon",
                description:
                    "اسپلیت کن: اپلیکیشن رایگان برای مدیریت و تقسیم آسان هزینه های مشترک و گروهی.",
                theme_color: "#ffffff",
                icons: [
                    {
                        src: "/images/icons/pwa-64x64.png",
                        sizes: "64x64",
                        type: "image/png",
                    },
                    {
                        src: "/images/icons/pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "/images/icons/pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                    {
                        src: "/images/icons/maskable-icon-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "client/src"),
        },
    },
    esbuild: {
        jsx: "automatic",
    },
});
