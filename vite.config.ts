import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // ✨ 여기부터 추가
  server: {
    proxy: {
      // '/todos'로 시작하는 요청이 오면 target으로 보낸다!
      '/posts': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  // ✨ 여기까지
});
