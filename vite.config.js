import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        laravel({
            input: ["client/src/main.tsx"],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    esbuild: {
        jsx: "automatic",
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "client/src"),
        },
    },
});
