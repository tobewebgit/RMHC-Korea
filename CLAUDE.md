# 🌌 RMHC Korea 퍼블리싱 AI 운영 프로토콜 (CLAUDE.md)

이 파일은 에이전트 시스템(Claude Code, Gemini Antigravity, Cursor 등)이 기계적으로 인지하는 명령 및 기본 룰 가이드입니다. 
인격적 협업 규칙 및 상세 아키텍처는 반드시 루트 디렉토리의 [AGENTS.md](file:///d:/rmhc/front/AGENTS.md)를 탐독하고 준수하십시오.

---

## 🛠️ Build & Verification Commands
- **로컬 개발 서버 구동**: `npm run dev` (기본 포트: 5173)
- **정적 빌드 검증**: `npm run build`
- **퍼블리싱 현황판**: `http://localhost:5173/index_ia.html` 접속

---

## ⚠️ Core Guidelines (제1원칙 요약)

1. **전면 한국어 사용**: 모든 계획 제안, 코드 설명, 업무보고는 100% 한국어를 사용합니다.
2. **추측 절대 금지 (No Guessing)**: 코드 수정 또는 파일 탐색 시 반드시 `grep_search`, `view_file` 도구를 사용하여 실제 파일의 존재 여부와 코드를 직접 열고 확인하십시오.
3. **디자인 및 성능(PageSpeed) 준수 제1규격**:
   - **폰트 최적화**: 웹폰트에 반드시 `font-display: swap`을 선언하여 FOIT(글자 깜빡임)을 예방하십시오.
   - **색상 대비 규격 준수 (WCAG AA)**: 일반 텍스트 4.5:1 이상 명도대비 유지. 골드/옐로우 배경(`#ffc72c`) 버튼(`.btn-secondary`) 내부 글씨는 절대로 흰색을 쓰지 말고 차콜 그레이(`#1f2937`)를 적용하십시오.
   - **모바일 줌인 차단**: 모바일 뷰포트 인풋 폼의 글꼴 크기는 브라우저 강제 줌인을 막기 위해 최소 `16px (1rem)` 이상으로 적용하십시오.
   - **터치 영역 규격**: 모든 모바일 클릭 대상은 최소 `48px x 48px` 이상의 터치 크기를 유지하십시오.
4. **마이크로 커밋 의무화**:
   - 논리적인 작은 단위마다 수시로 커밋을 실행하십시오. [git_commit_rules.md](file:///d:/rmhc/front/docs/git_commit_rules.md) 규격을 철저히 준수해야 합니다.
5. **업무일지 작성**:
   - 일별 업무가 완료되면 [docs/업무일지/](file:///d:/rmhc/front/docs/업무일지) 경로에 날짜와 번호를 표기하여 업무일지를 기록 및 커밋하십시오.

---

## 🗺️ Context Map
- **상세 협업 프로토콜**: [AGENTS.md](file:///d:/rmhc/front/AGENTS.md)
- **Git 커밋 규격 가이드라인**: [git_commit_rules.md](file:///d:/rmhc/front/docs/git_commit_rules.md)
- **퍼블리싱 IA 데이터 맵**: [publishing-ia.json](file:///d:/rmhc/front/src/js/publishing-ia.json)
