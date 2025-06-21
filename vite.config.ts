import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: "127.0.0.1",
        port: 5000,
    },
    build: {
        minify: false,
        rollupOptions: {
            output: {
                preserveModules: false,
                name: "MyBundle",
            },
        },
        terserOptions: {
            keep_classnames: true,
            keep_fnames: true,
        },
    },
});
