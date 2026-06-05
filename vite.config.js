import { defineConfig } from 'vite';
import injectHTML from 'vite-plugin-html-inject';
import { resolve } from 'path';
import { globSync } from 'glob';

export default defineConfig({
  base: './', // 빌드 자산 경로를 상대 경로로 지정하여 로컬 파일 실행(file://) 시 깨짐 방지
  plugins: [
    injectHTML(),
  ],
  build: {
    rollupOptions: {
      // 루트 디렉토리 내의 모든 HTML 파일을 수집하여 빌드 대상으로 지정 (Multi-Page App 지원)
      input: globSync('./*.html').reduce((acc, file) => {
        const name = file.replace(/^\.\//, '').replace(/\.html$/, '');
        acc[name] = resolve(__dirname, file);
        return acc;
      }, {}),
    },
  },
});
