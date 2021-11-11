import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import viteSvgIcons from 'vite-plugin-svg-icons';

const resolve = (dir: string) => path.join(__dirname, dir);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteSvgIcons({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[name]'
    })
  ],
  resolve: {
    alias: {
      '@/': resolve('src/*')
    }
  },
  server: {
    proxy: {
      '/api/': 'http://localhost:5000'
    }
  }
})
