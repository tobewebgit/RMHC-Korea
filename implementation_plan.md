# 헤더 GNB 서브메뉴 공통 작업 계획

## 확인한 사실
- 공통 헤더는 `includes/header.html`에 있고 각 HTML에서 `<load ="/includes/header.html" />` 방식으로 포함된다.
- 공통 스타일은 `src/css/common.css`, 공통 스크립트 진입점은 `src/js/common.js`다.
- 모바일 GNB 제어는 `src/js/components/gnb.js`에 이미 있으나, 현재 헤더의 모바일 토글 버튼은 주석 처리되어 있다.
- 현재 PC 헤더는 1depth 링크만 있어 데스크탑 hover 서브메뉴를 출력하려면 `header.html` 구조 보강이 필요하다.
- 피그마 PC 노드 `2531:57547`은 1920x100 기본, 1920x207 서브메뉴 오픈 상태이며, 1depth 20px/600, 2depth 18px/600이다.
- 피그마 MO 노드 `2531:57680`은 360x780 모바일 패널 기준이며, 메뉴/유틸 텍스트는 14px 기반이다.

## 구현 범위
- `includes/header.html`
  - PC 1depth 메뉴를 각 메뉴별 서브메뉴를 포함한 구조로 정리한다.
  - 모바일 햄버거 버튼을 활성화하고, 첨부 시안 기준 모바일 메뉴 구조로 정리한다.
- `src/css/common.css`
  - PC hover/focus 시 서브메뉴 영역 노출, hover 컬러 `#db0007` 적용.
  - 서브메뉴 hover 시 화살표는 추가하지 않고 색상만 변경.
  - 모바일 메뉴 패널, 아코디언, 하단 CTA 스타일을 피그마 기준으로 보강.
  - 스크롤 다운 시 헤더 숨김, 스크롤 업 시 fixed 노출 상태 스타일을 추가한다.
- `src/js/components/gnb.js`
  - 데스크탑 hover/focus 상태와 모바일 아코디언 aria 상태를 보강한다.
  - 스크롤 방향 감지로 헤더 숨김/노출 동작을 추가한다.

## 검증
- `npm run lint:html`
- `npm run build`
- 가능하면 로컬 화면에서 PC hover, 모바일 메뉴 오픈, 스크롤 방향 동작을 확인한다.
