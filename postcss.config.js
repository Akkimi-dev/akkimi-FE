// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // 기존 tailwindcss 대신 이걸 씀
    autoprefixer: {},
  },
}
