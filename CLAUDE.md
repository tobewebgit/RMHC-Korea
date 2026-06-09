# 🌌 RMHC Korea 퍼블리싱 AI 운영 프로토콜 (CLAUDE.md)

이 파일은 에이전트 시스템(Claude Code, Gemini Antigravity, Cursor 등)이 기계적으로 인지하는 명령 및 기본 룰 가이드입니다. 
인격적 협업 규칙 및 상세 아키텍처는 반드시 루트 디렉토리의 [AGENTS.md](file:///d:/rmhc/front/AGENTS.md)를 탐독하고 준수하십시오.

---

## 🛠️ Build & Verification Commands
- **로컬 개발 서버 구동**: `npm run dev` (기본 포트: 5173)
- **정적 빌드 검증**: `npm run build`
- **HTML 린트 검증**: `npm run lint:html`
- **퍼블리싱 현황판**: `http://localhost:5173/index_ia.html` 접속

---

## ⚠️ Core Guidelines (제1원칙 요약)

1. **전면 한국어 사용**: 모든 계획 제안, 코드 설명, 업무보고는 100% 한국어를 사용합니다.
2. **추측 절대 금지 (No Guessing)**: 코드 수정 또는 파일 탐색 시 반드시 `grep_search`, `view_file` 도구를 사용하여 실제 파일의 존재 여부와 코드를 직접 열고 확인하십시오.
3. **디자인 및 성능(PageSpeed) 준수 제1규격**:
   - **폰트 최적화**: 웹폰트에 반드시 `font-display: swap`을 선언하여 FOIT(글자 깜빡임)을 예방하십시오.
   - **색상 대비 규격 준수 (WCAG AA)**: 일반 텍스트 4.5:1 이상 명도대비 유지. 골드/옐로우 배경 `#ffc72c` 버튼 내부 글씨는 절대로 흰색을 쓰지 말고 차콜 그레이 `#1f2937`을 적용하십시오.
   - **모바일 줌인 차단**: 모바일 뷰포트 인풋 폼의 글꼴 크기는 브라우저 강제 줌인을 막기 위해 최소 `16px (1rem)` 이상으로 적용하십시오.
   - **터치 영역 규격**: 모든 모바일 클릭 대상은 최소 `48px x 48px` 이상의 터치 크기를 유지하십시오.
   - **이미지 로딩 최적화**: LCP 중요 이미지에는 `fetchpriority="high"`, 스크롤 내부 이미지에는 `loading="lazy"`를 지정하고, CLS 예방을 위해 모든 `<img>` 태그에 `width`/`height` 상수를 명시하십시오.
4. **적정 작업 단위 커밋**:
   - 논리적인 단위로 커밋하되, 너무 사소한 개별 변경 사항들은 단독으로 즉시 커밋하지 마십시오. 최상위 [task.md](file:///d:/rmhc/front/task.md)에 누적 기록하여 최소 5개 이상의 미세 작업 단위가 모였을 때 하나의 커밋으로 진행합니다. [git_commit_rules.md](file:///d:/rmhc/front/docs/git_commit_rules.md) 규격을 준수하십시오.
5. **업무일지 작성**:
   - 일별 업무가 완료되면 [docs/업무일지/](file:///d:/rmhc/front/docs/업무일지) 경로에 날짜와 번호를 표기하여 업무일지를 기록 및 커밋하십시오.
6. **요청되지 않은 JS/모션 작업 금지**:
   - 탭(Tab) 또는 UI 레이아웃 제어를 위해 필요한 최소한의 스크립트 외에, 임의적인 스크립트 및 모션/애니메이션 작업은 일절 금지합니다.
   - 모든 HTML 및 CSS 마크업 퍼블리싱 작업이 완전히 완료된 후에 별도의 인터랙션 고도화 작업을 진행합니다.
7. **CSS 아키텍처 규칙 (style.css 모듈화 및 페이지별 1:1 매칭)**:
   - `src/css/style.css`는 전체 공통 스타일 파일입니다. 버튼, 폼 등은 `src/css/components/` 폴더에 별도 파일로 분리한 후 `style.css` 상단에 `@import` 처리하십시오. 개별 페이지 고유 스타일은 해당 페이지명과 1:1로 매칭되는 별도의 CSS 파일로 작업해야 합니다.

---

## 🗺️ Context Map
- **상세 협업 프로토콜**: [AGENTS.md](file:///d:/rmhc/front/AGENTS.md)
- **Git 커밋 규격 가이드라인**: [git_commit_rules.md](file:///d:/rmhc/front/docs/git_commit_rules.md)
- **작업 관리 체크리스트**: [task.md](file:///d:/rmhc/front/task.md)
- **퍼블리싱 IA 데이터 맵**: [publishing-ia.json](file:///d:/rmhc/front/src/js/publishing-ia.json)
