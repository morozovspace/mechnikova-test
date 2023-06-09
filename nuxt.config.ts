// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
// nuxt.config.ts
    modules: [
        "@element-plus/nuxt",
        "nuxt-lodash"
    ],
    // Lodash
    lodash: {
        prefix: "_",
        prefixSkip: ["string"],
        upperAfterPrefix: false,
        exclude: ["map"],
        alias: [],
    },
})
