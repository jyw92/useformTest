import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 1. 기존 posts 설정
      '/posts': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      // ✨ 2. 여기에 bmw 추가!
      '/bmw': {
        target: 'http://localhost:3001', // posts와 같은 백엔드 주소
        changeOrigin: true,
      },
    },
  },
});
