import { defineConfig } from 'vite'

// 相对路径，兼容 GitHub Pages 项目页与自定义域名
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
