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
      // 프로젝트 내의 모든 HTML 파일(하위 폴더 포함)을 수집하여 빌드 대상으로 지정 (공통 인클루드 폴더는 제외)
      input: globSync('./**/*.html', { ignore: ['node_modules/**', 'dist/**', 'src/includes/**'] }).reduce((acc, file) => {
        // 상대 경로 정리 (예: ./login/find-id.html -> login/find-id)
        const name = file.replace(/^\.\//, '').replace(/\.html$/, '').replace(/\\/g, '/');
        acc[name] = resolve(__dirname, file);
        return acc;
      }, {}),
    },
  },
});
