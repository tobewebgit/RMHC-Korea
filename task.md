  # RMHC Korea 퍼블리싱 고도화 작업 관리 (task.md)

이 파일은 RMHC Korea 홈페이지 개편 퍼블리싱 프로젝트의 고도화 작업 및 마크업 수행 내역을 관리하는 태스크 리스트입니다.
마일스톤 단계별 체크리스트를 기반으로 퍼블리싱 작업 상황을 추적합니다.

---

## 🛠️ 마일스톤별 퍼블리싱 작업 현황

- [x] **0단계: 환경 및 정적 분석기 구축**
  - [x] HTMLHint 정적 린터 구성 및 린팅 룰 세팅 완료
  - [x] CSS 컴포넌트(button.css, form.css) 분리 및 style.css 연동 모듈화 완료
  - [x] index.html 키비주얼 이미지 시범 최적화 이식 완료

- [x] **1단계: 기초 정비 (공통 레이아웃 및 팝업 뼈대)**
  - [x] 헤더(header.html), 푸터(footer.html) 공통 에셋 반응형 및 웹폰트 swap 점검
  - [x] 공통 팝업(VMS 안내 모달 등 4종) 마크업 리팩토링 및 주석 가독성 강화
  - [x] 탭/UI 제어용 최소화 스크립트 외 미사용 모션 요소 제거 확인

- [x] **2단계: 회원/로그인 (총 11개 페이지)**
  - [x] 로그인 메인 (`login.html`)
  - [x] 아이디 찾기 (`login/find-id.html`)
  - [x] 아이디 찾기 결과 (`login/find-id/result.html`)
  - [x] 비밀번호 재설정 (`login/reset-pw.html`)
  - [x] 비밀번호 재설정 입력 (`login/reset-pw/new.html`)
  - [x] 비밀번호 재설정 완료 (`login/reset-pw/complete.html`)
  - [x] SNS 계정 연동 (`login/link-sns.html`)
  - [x] 회원가입 메인 (`join.html`)
  - [x] 회원가입 본인 인증 (`join/auth.html`)
  - [x] 회원가입 정보 입력 (`join/form.html`)
  - [x] 회원가입 완료 (`join/complete.html`)

- [x] **3단계: 후원 및 자원봉사 (총 5개 페이지)**
  - [x] 정기후원 (`donate/regular.html`)
  - [x] 일시후원 (`donate/one-time.html`)
  - [x] 물품후원 (`donate/goods.html`)
  - [x] 후원완료 (`donate/complete.html`)
  - [x] 자원봉사 신청 (`volunteer.html`)

- [x] **4단계: 소개 및 하우스 (총 11개 페이지)**
  - [x] 소개 메인 (`about.html`)
  - [x] 비전 & 미션 (`about/vision.html`)
  - [x] 회장 인사말 (`about/greetings.html`)
  - [x] RMHC 이사회 (`about/board.html`)
  - [x] 재정 투명성 (`about/transparency.html`)
  - [x] 파트너사 소개 (`about/partner.html`)
  - [x] 양산 부산대 하우스 (`houses/yangsan.html`)
  - [x] 서초 성모 하우스 (`houses/seocho.html`)
  - [x] 연희 하우스 (`houses/yeonhui.html`)
  - [x] 강남 세브란스 하우스 (`houses/gangnam.html`)
  - [x] 인하대 하우스 (`houses/inha.html`)

- [x] **5단계: 마이페이지 & 비회원 서비스 (총 10개 페이지)**
  - [x] 마이페이지 메인 (`mypage.html`)
  - [x] 비밀번호 검증 (`mypage/verify-password.html`)
  - [x] 개인정보 수정 (`mypage/profile.html`)
  - [x] 후원 이력 목록 (`mypage/donations.html`)
  - [x] 후원 이력 상세 (`mypage/donations/detail.html`)
  - [x] 기부금영수증 내역 (`mypage/donation-receipts.html`)
  - [x] 기부금영수증 신청 (`mypage/donation-receipts/apply.html`)
  - [x] 기부금영수증 발급현황 (`mypage/donation-receipts/status.html`)
  - [x] 회원 탈퇴 (`mypage/withdraw.html`)
  - [x] 비회원 후원조회 (`nonmember/donations.html`)

- [x] **6단계: 캠페인 및 새소식 & 정책 (총 12개 페이지)**
  - [x] 패밀리하우스 캠페인 (`campaign/family.html`)
  - [x] KCR 캠페인 (`campaign/kcr.html`)
  - [x] 갈라 디너 캠페인 (`campaign/gala.html`)
  - [x] 백일장 캠페인 (`campaign/writing-contest.html`)
  - [x] 공지사항 목록 (`news/notice.html`)
  - [x] 공지사항 상세 (`news/notice/detail.html`)
  - [x] 활동소식 목록 (`news/activity.html`)
  - [x] 활동소식 상세 (`news/activity/detail.html`)
  - [x] FAQ 목록 (`faq.html`)
  - [x] 이용약관 (`policy/terms.html`)
  - [x] 개인정보 처리방침 (`policy/privacy.html`)
  - [x] 이메일 무단수집거부 (`policy/email.html`)

- [x] **7단계: 메인 홈 하우스 소개 섹션 인터랙션 고도화 및 경로 교정**
  - [x] 메인 홈 `index.html` 내 하우스 소개 섹식 마크업 추가
  - [x] `index.html` 내의 CSS/JS/이미지 절대 경로(`/src/...`)를 상대 경로(./src/...)로 교정
  - [x] `index.css` 내 실시간 스크롤 동기화 텍스트 리빌 및 일러스트 스타일링 보정
  - [x] `main.js` 내 실시간 스크롤 진행도 비율 매핑 및 아이콘 grayscale 필터 연동 스크립트 작성
  - [x] 4개 하우스 파스텔톤 버튼 카드 그리드 및 전체보기 버튼 마크업 및 모바일 반응형 완비
  - [x] 메인 홈 하우스 소개 텍스트 스크롤 리빌 모션 시퀀스 및 속도 정밀 교정 (CSS transition 제거, 스크롤 Lerp 스무딩 및 글자 간 텀 확대)
  - [x] 메인 홈 하우스 소개 텍스트 스크롤 리빌 Y축 이동값(translateY) 5px(0.5rem) 축소 교정 (레퍼런스 1:1 싱크)
  - [x] 메인 홈 및 타이틀 강조 구역용 나눔스퀘어 네오(NanumSquare Neo) 가변 웹폰트 CDN 로드 정의 및 적용 누락 해결
  - [x] 피그마 시안 폰트 크기 매핑(48px, 20px, 28px, 18px, 48px) 및 애니메이션 최종 컬러 절대 블랙(#000000) 동기화
  - [x] 48px 크기 폰트 스타일의 line-height: 130%(1.3) 상세 교정
  - [x] 글로벌 기본 sans-serif 폰트 변수(--font-sans)를 Pretendard에서 NanumSquare Neo로 전환 및 일괄 적용
  - [x] NanumSquare Neo의 기본 넓은 자간 현상 해결을 위한 letter-spacing: -0.03em 음수 자간 적용
  - [x] HTML 린트 및 Vite 프로덕션 빌드 최종 검증 (dist 실행 시 무오류 보장)

- [x] **8단계: 스크립트 구조 고도화 (모듈화 및 최적화)**
  - [x] 공통 네비게이션 액티브 모듈 (`src/js/components/navigation.js`) 작성
  - [x] 공통 모바일 GNB 모듈 (`src/js/components/gnb.js`) 작성
  - [x] 공통 패밀리 사이트 모듈 (`src/js/components/family-site.js`) 작성
  - [x] 메인 홈 스크롤 리빌 전용 모듈 (`src/js/pages/index-reveal.js`) 작성
  - [x] 메인 엔트리포인트 (`src/js/main.js`) 통합 및 동적 임포트(Dynamic Import) 적용
  - [x] 빌드 및 린트 결과 자가 검증 완료

- [x] **9단계: 공통 스크립트 명칭 정립 (main.js -> common.js)**
  - [x] `src/js/common.js` 신규 생성 및 기존 `main.js` 삭제
  - [x] 임시 일괄 치환 스크립트 (`scratch/rename_script.js`) 작성 및 실행
  - [x] 전체 HTML 내 스크립트 로드 경로 수정 완료
  - [x] 임시 스크립트 삭제 및 청소 완료
  - [x] 빌드 및 린트 최종 검증 완료

- [x] **10단계: 업계 표준에 맞춘 공통/개별 스크립트 병렬 분리**
  - [x] `src/js/common.js`에서 메인 전용 비동기 로딩 제거 및 순수 공통화
  - [x] `index.html` 하단에 `index-reveal.js` 스크립트 태그 직접 추가
  - [x] 빌드 및 린트 최종 검증 완료

- [x] **11단계: 마이페이지 '나의 정보' 탭 퍼블리싱 및 고도화**
  - [x] `mypage.html` 내에 피그마 시안 100% 매칭 마크업(기본 정보, 계정 정보, 기부금 영수증) 구현
  - [x] `login.css` 하단에 나의 정보 전용 카드, 그리드, 폼 예외 스타일 추가
  - [x] 눈 아이콘 비밀번호 보기 토글 기능 자바스크립트 처리 추가
  - [x] HTML 린트 (`npm run lint:html`) 및 Vite 프로덕션 빌드 검증 완료

- [x] **12단계: 마이페이지 '회원탈퇴' 화면 퍼블리싱 및 고도화**
  - [x] `withdraw.html` 내에 피그마 시안 100% 매칭 마크업(안내문, 동의 체크박스, 정보 확인 3열 카드) 구현
  - [x] `login.css` 하단에 회원탈퇴 전용 레이아웃, 3열 그리드, 비활성 버튼 등 스타일 추가
  - [x] HTML 린트 (`npm run lint:html`) 및 Vite 프로덕션 빌드 검증 완료

- [x] **13단계: 마이페이지 '나의 후원 현황' 내부 정기 후원 화면 구현**
  - [x] `mypage.html` 내 서브 탭별(전체 / 정기 후원 / 일시 후원) 분기 구조 마크업 작성
  - [x] 정기 후원 탭 활성화 시 노출되는 2칸 요약 박스, 내역 테이블, 페이징 마크업 구축
  - [x] `login.css` 내 테이블 헤더(18px) 및 본문(16px), 페이징(16px) 등 폰트 사이즈 정밀 조정 및 공통화
  - [x] 페이징 화살표 아이콘 배경 경로(icon_left.png 등) 매핑 오류 수정 완료
  - [x] 서브 탭 클릭 시 하단 요약박스/테이블/페이징 영역이 알맞게 전환되는 JS 코드 보완
  - [x] HTML 린트 (`npm run lint:html`) 및 Vite 프로덕션 빌드 검증 완료

- [ ] **14단계: 마이페이지 '나의 후원 현황' 서브 탭 레이아웃 교정 및 세부 피그마 명세 동기화**
  - [ ] `mypage.html` 내 전체 탭 데이터 뷰 테이블 및 페이징 제거 (요약 박스만 남김)
  - [ ] `mypage.html` 내 일시 후원 데이터 테이블 시안 반영 (No, 구분, 캠페인, 결제방법, 금액, 기부일)
  - [ ] `button.css` 내 테이블용 높이 36px 전용 버튼(`.btn-table`) 스타일 규칙 추가 정의
  - [ ] `login.css` 내 페이징 레이아웃 분할 및 간격 보정 (좌우 화살표 그룹과 숫자 그룹 간 격리 배치)
  - [ ] `<` 및 `>` 화살표 버튼 배경 크기 보정(2.4rem) 및 비활성 페이지 버튼 보더 규칙 반영
  - [ ] HTML 린트 (`npm run lint:html`) 및 Vite 프로덕션 빌드 검증 완료
