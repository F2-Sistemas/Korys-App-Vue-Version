import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

const vueConfig = {
    template: {
        transformAssetUrls: {
            base: null,
            includeAbsolute: false,
        },
    },
};

export default defineConfig(({ mode }) => ({
    server: {
        host: '::',
        port: 8081,
    },
    plugins: [vue(vueConfig), vueJsx(vueConfig)],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '~': fileURLToPath(new URL('./src', import.meta.url)),
            // '@public': fileURLToPath(new URL('./public', import.meta.url)),
            '@nm': fileURLToPath(new URL('./node_modules', import.meta.url)),

            '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
            '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
            '@composables': fileURLToPath(new URL('./src/composables', import.meta.url)),
            '@integrations': fileURLToPath(new URL('./src/integrations', import.meta.url)),
            '@router': fileURLToPath(new URL('./src/router', import.meta.url)),
            '@stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
            '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
        },
    },
    define: {
        __VUE_OPTIONS_API__: false,
        __VUE_PROD_DEVTOOLS__: false,
    },
}));
