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
  - [x] HTML 린트 및 Vite 프로덕션 빌드 최종 검증 (dist 실행 시 무오류 보장)

