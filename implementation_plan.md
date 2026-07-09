# About > 기업 파트너 페이지 퍼블리싱 계획

## 확인한 사실
- AGENTS.md를 UTF-8로 직접 확인했다. 구현 전 관련 파일 확인, `implementation_plan.md` 작성, 사용자 승인 대기 규칙이 명시되어 있다.
- 작업 대상은 `about/partner.html`과 `src/css/about.css`다. 헤더/푸터 인클루드는 완료 상태이므로 수정하지 않는다.
- `about/partner.html`은 현재 `common.css`만 로드하고 있고, 본문에는 작업 예정 주석만 있다. 파트너 페이지 스타일 적용을 위해 `about.css` 로드가 필요하다.
- 기존 완료 페이지 패턴을 확인했다.
  - `about/greetings.html`, `about/board.html`은 `common.css` + `about.css`를 로드한다.
  - greetings/board KV는 `width: min(100% - 6.4rem, 184.8rem)`, `height: 50rem`, `margin: 5rem auto 0`, 모바일 `width: calc(100% - 4rem)`, `height: 24rem`, `margin: 0 auto` 구조다.
  - 두 페이지 모두 모바일 KV는 `<picture>`에서 `*_mo.png` 이미지를 분기한다.
- `campaign/writing-contest.html` 수상작 슬라이드 구조를 확인했다.
  - Swiper 11 CDN CSS/JS를 사용한다.
  - `.swiper > .swiper-wrapper > .swiper-slide` 구조와 별도 `.award-swiper-pagination.swiper-pagination` 도트를 사용한다.
  - 초기화 옵션은 `slidesPerView: 1`, `spaceBetween: 30`, `loop: false`, `pagination.clickable: true`다.
  - dot 스타일은 `src/css/campaign.css`의 `.award-swiper-pagination` 계열이 기준이다.
- 피그마 API로 노드 `2710:41209`, `2710:41923`을 직접 조회했다.
  - PC 프레임 크기: `1920 x 7514`
  - KV 텍스트: h1 `58px/75.4`, 본문 `22px/28.6`
  - 소개 큰 문구: `48px/62.4`, 본문 `20px/30`
  - 주요 파트너십 하이라이트: 섹션 제목 `48px/62.4`, 중제목 `38px/49.4`
  - 파트너십 모델: 제목 `48px/62.4`, 설명 `22px/26.25`
  - 파트너십 활동: 제목 `38px/49.4`, 카드 타이틀 `22px/26.4`, 카드 설명 `20px/30`, 배지 `14px/18.2`
- 이미지 자산을 실제 디렉토리에서 확인했다.
  - `src/images/about/bg_partner_round_pc.png`: `794 x 476`
  - `src/images/about/bg_partner_round_mo.png`: `208 x 212`
  - `src/images/about/logo_mision_partner_1.png` ~ `logo_mision_partner_15.png`: 15개, 각 `230 x 84`
  - `src/images/about/logo_partner_1.png` ~ `logo_partner_88.png` 중 `75~78`은 없음: 총 84개, 각 `230 x 90`
  - `src/images/partner`에는 한글 파일명 로고 27개가 있으며 대부분 `230 x 84`다.
- 현재 `src/images/about`에는 파트너 KV 원본, 소개 우측 사진, Founding 카드 좌측 사진이 명시적 파일명으로 존재하지 않는다. 첨부 PNG는 전체 시안/캔버스 성격이므로 실제 배경으로 사용하지 않는다.

## 구현 방침
- `about/partner.html`
  - `about.css`와 Swiper CSS CDN을 추가한다.
  - `<main id="main-content" class="about-partner">`로 페이지 네임스페이스를 분리한다.
  - 섹션은 시안 순서대로 구성한다.
    1. KV: 기존 greetings/board KV와 동일한 구조/크기/텍스트 중앙 정렬. PC/MO 자산이 확인되는 경우 `<picture>`로 분기한다.
    2. 소개 텍스트 + 이미지: 왼쪽 큰 문구와 본문, 오른쪽 이미지 배치. 실제 사용 가능한 사진 자산이 없으면 사용자 확인 후 진행한다.
    3. 주요 파트너십 하이라이트: 연보라 배경, Founding & Forever 카드, Mission 로고 목록, Partner 로고 슬라이드.
    4. 파트너십 모델: `bg_partner_round_pc/mo.png`를 사용해 다이어그램을 구성하고 피그마 텍스트를 배치한다.
    5. 파트너십 활동: 카드 리스트와 `더 보기` 버튼 구성, 링크는 `#` 처리.
  - 로고 슬라이드는 `/campaign/writing-contest.html`과 동일한 Swiper 구조와 dot 동작을 적용한다.
  - Partner 로고는 30개 단위로 슬라이드 분할한다. 현재 총 84개이므로 30 / 30 / 24 구성으로 마크업한다.
  - 불필요한 JS/모션은 추가하지 않고 Swiper 초기화 스크립트만 최소 작성한다.
- `src/css/about.css`
  - 기존 vision/greetings/board 스타일은 유지한다.
  - 파트너 페이지 스타일은 `.about-partner`, `.partner-*` 네임스페이스로만 추가한다.
  - KV 스타일은 greetings/board와 동일한 수치 체계를 유지한다.
  - 모바일은 첨부 MO 시안 흐름에 맞춰 단일 컬럼, 로고 3열 또는 가용폭 기준 그리드, 카드 1열로 전환한다.

## 확인 필요 사항
- 실제 페이지에 사용할 KV PC/MO 원본 이미지 파일과 소개/Founding 사진 원본이 프로젝트 안에 있는지 추가 확인이 필요하다. 현재 확인된 `src/images/about`, `src/images/partner` 기준으로는 해당 사진 자산이 없다.
- 첨부 `KV.png`, `text (1).png`, `주요파트너십 하이라이트.png`, `파트너십 활동.png`는 검정 캔버스 또는 전체 시안 이미지라 그대로 페이지 이미지로 쓰면 안 된다.

## 검증 계획
- `npx htmlhint about/partner.html`
- `npm run build`
- 가능하면 로컬 Vite 서버에서 PC/MO 확인
  - 가로 스크롤 여부
  - KV 모바일 이미지 분기 여부
  - Partner 로고 슬라이드 및 dot 동작
  - 기존 빌드 경고가 있다면 이번 작업 관련 여부 분리 보고
