import { defineConfig } from "vite";
import type { UserConfig } from "vite";

export default defineConfig({
    server: {
        host: true,
    },
    base: '/examenU2/',
    build: {
        outDir: 'docs'
    }
}) satisfies UserConfig