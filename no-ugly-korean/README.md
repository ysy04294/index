# 노 어글리 코리안 — 유저테스트 프로토타입 (모바일 앱)

구글 지도 도보 길찾기 화면을 닮은 Expo(React Native) 앱입니다.
로마 Piazza Navona → **Sant'Eustachio Il Caffè** 로 걸어가는 상황을 시뮬레이션하고,
가게 30m 전에서 **AI 행동 가이드 알림**(A / B / C 세 가지 형태)을 띄워 비교합니다.

- Expo SDK 57 · TypeScript · 아이폰 **Expo Go**로 바로 실행 (Xcode 빌드 필요 없음)
- 실제 GPS는 쓰지 않음 — 이동은 전부 시뮬레이션 (기본 40초에 도착)

---

## 1. 실행 방법

### 준비물
- 컴퓨터: Node.js 20 이상
- 아이폰: App Store에서 **Expo Go** 설치
- 컴퓨터와 아이폰이 **같은 Wi-Fi**에 연결

### 실행
```bash
cd no-ugly-korean
npm install
cp .env.example .env      # .env 를 열어 GOOGLE_MAPS_API_KEY= 뒤에 키 붙여 넣기
npx expo start
```
1. 터미널에 QR 코드가 나오면 아이폰 **기본 카메라 앱**으로 QR을 찍습니다.
2. "Expo Go에서 열기" 알림을 누르면 앱이 실행됩니다.
3. 같은 Wi-Fi인데도 연결이 안 되면 `npx expo start --tunnel` 로 실행하세요.

> `.env` 를 바꾼 뒤에는 `npx expo start -c` 로 캐시를 지우고 다시 실행하세요.
> API 키가 없어도 앱은 동작합니다. 이 경우 지도 대신 간단한 **오프라인 그림 지도**와
> 미리 넣어 둔 경로로 진행되고, C타입 Street View 대체 화면은 나오지 않습니다.

---

## 2. Google API 키 발급

[Google Cloud 콘솔](https://console.cloud.google.com/) → 프로젝트 만들기 → **API 및 서비스 → 라이브러리**에서 아래를 **사용 설정**합니다.

| API | 쓰는 곳 |
|---|---|
| **Maps JavaScript API** | 지도, Street View(C타입 대체 화면) — Street View는 이 API에 포함 |
| **Routes API** | 도보 경로 (지도 안에서 `Route.computeRoutes` 호출) |
| Directions API (Legacy) | Routes API가 안 될 때 두 번째 시도. 새 프로젝트에서 켤 수 없으면 생략해도 됨 |

그다음 **사용자 인증 정보 → API 키 만들기** 후 `.env` 에 넣습니다.

- 결제 계정 연결이 필요합니다 (테스트 정도의 사용량은 무료 한도 안).
- 키 제한을 걸고 싶다면: **애플리케이션 제한 → 웹사이트**, 허용 리퍼러에 `https://no-ugly-korean.app/*` 추가
  (WebView 페이지가 이 주소에서 열린 것으로 처리됩니다 — `src/config/env.ts` 의 `WEBVIEW_BASE_URL`).
  API 제한에는 위 API들만 체크하세요.
- 경로를 못 받아 오면 `src/config/scenario.ts` 의 `FALLBACK_ROUTE` 로 자동 대체됩니다.
  CSV의 `route_source` 칸에서 어떤 경로를 썼는지 확인할 수 있어요 (`routes` / `directions` / `preset`(이전에 받아 둔 경로) / `fallback` / `timeout`).

---

## 3. 좌표 · 문구 수정 방법

**모든 좌표와 문구는 `src/config/scenario.ts` 한 파일에 있습니다.** 코드 수정 없이 이 파일만 고치면 됩니다.
저장하면 아이폰 화면이 자동으로 새로고침돼요.

| 바꾸고 싶은 것 | `scenario.ts` 항목 |
|---|---|
| 출발지 / 도착지 좌표, 이름 | `ORIGIN`, `DESTINATION` |
| 경로를 못 받을 때 쓸 경로 | `FALLBACK_ROUTE` (출발 → 도착 순서의 좌표 배열) |
| C타입 Street View 위치·방향 | `STREET_VIEW` (`heading`: 0=북, 90=동) |
| 도착 시간, 알림 거리(30m), 알림 후 멈춤 여부 | `SIMULATION` |
| 상단 초록 배너 안내 문구 | `NAV_STEPS` (`from` = 진행률 0~1) |
| 시작/타입/종료/진행자 메뉴 문구 | `TEXT` |
| "리뷰 128개" 숫자 | `AI_LABEL.reviewCount` |
| A타입 문구 | `NOTICE_A` |
| B타입 카드 4장, 이탈리아어 표현 | `NOTICE_B.cards` (`phrase` 가 있으면 🔊 버튼이 생김) |
| C타입 AR 라벨 문구와 위치 | `NOTICE_C` (`x`, `y` = 카메라 화면 안 % 위치), `cameraRatio` = 카메라 영역 비율 |
| 진행 순서 선택지 | `ORDER_OPTIONS` |

좌표 확인 팁: 구글 지도에서 장소를 길게 누르면 위도·경도가 나옵니다.

---

## 4. 테스트 흐름

```
시작 화면 (참여자 ID + 순서 A-B-C / B-C-A / C-A-B)
 → "A타입 시작" → 길찾기 (파란 점 자동 이동)
 → 도착 30m 전: AI 알림 + 진동
 → 알림 "확인" → 상단 우측 "완료" 활성화 → "완료"
 → 다음 타입 … → 종료 화면 → CSV 내보내기
```

- **A타입**: 초록 배너 아래 한 줄 카드
- **B타입**: 하단 시트 + 좌우로 넘기는 카드 4장 (마지막 카드에서만 "확인"), 🔊 이탈리아어 발음
- **C타입**: 위 55% 후면 카메라(Live View) + AR 라벨 / 아래 45% 지도. 카메라 권한이 없으면 가게 앞 Street View

### 진행자 메뉴 (숨김)
화면 **왼쪽 위를 2초간 길게 누르기** → 이동 속도(0.5x/1x/2x), 현재 타입 처음부터, 알림 바로 띄우기,
다음 타입으로 건너뛰기, C타입 카메라 ↔ Street View 전환, 처음 화면으로.

### 기록
타입마다 `타입 시작 탭 / 알림 등장 / 알림 확인 / 완료 탭` 시각, B타입 카드 넘긴 횟수·발음 버튼 탭 수,
C타입 화면 종류, 진행자 조작(처음부터·알림 강제·건너뛰기)을 저장합니다.
기록은 폰 안(`nuk_sessions.json`)에 계속 쌓이고, 종료 화면에서
**기록 내보내기 (CSV)** → iOS 공유 시트로 에어드롭·메일·파일 저장. 파일명 `참여자ID_날짜.csv`.
"이 폰의 전체 기록 내보내기"는 지금까지 진행한 모든 참여자를 한 파일로 내보냅니다.

---

## 5. 테스트 당일 체크리스트

- [ ] 아이폰 **충전** (100%) + 보조배터리 / 충전 케이블
- [ ] **무음 모드 해제** (왼쪽 옆 스위치/액션 버튼) — B타입 발음 듣기 소리
- [ ] 미디어 **볼륨** 올리기
- [ ] **설정 → 디스플레이 및 밝기 → 자동 잠금 → 안 함** (앱이 화면 꺼짐을 막지만 혹시 대비)
- [ ] 컴퓨터와 아이폰 **같은 Wi-Fi 연결**, 지도/Street View가 실제로 뜨는지 확인
- [ ] **방해금지 모드** 켜기 (테스트 중 다른 알림 방지), 진동은 켜 둘 것 (설정 → 사운드 및 햅틱 → 시스템 햅틱)
- [ ] 화면 밝기 최대, 자동 밝기 끄기 / 세로 화면 고정
- [ ] 시작 전에 한 번 끝까지 리허설 → **카메라 권한 허용** 확인 (C타입)
- [ ] Expo Go를 이미 연 상태로 대기 (테스트 직전 QR 다시 찍지 않도록)
- [ ] 참여자마다 시작 화면에서 **ID와 순서** 입력, 끝나면 CSV 내보내기

---

## 6. 폴더 구조

```
app.config.ts               // 앱 설정 + .env 의 GOOGLE_MAPS_API_KEY 를 extra 로 전달
src/
  App.tsx                   // 화면 전환 + 기록 + 진행자 메뉴
  config/scenario.ts        // 좌표, 경로, 문구, AR 라벨 위치, 리뷰 수 ← 여기만 고치면 됨
  config/env.ts             // API 키 읽기
  components/
    MapView.tsx             // WebView + Google Maps JS (개발 빌드 전환 시 이 파일만 교체)
    map.html.ts             // WebView에 넣는 지도 / Street View HTML
    NavTopBanner.tsx, NavBottomSheet.tsx, DoneButton.tsx, ModeratorMenu.tsx
    notices/NoticeA.tsx, NoticeB.tsx, NoticeC.tsx, common.tsx
  screens/StartScreen.tsx, TypeIntroScreen.tsx, NavScreen.tsx, EndScreen.tsx
  state/testFlow.ts         // 상태 머신: start → intro → navigating → noticeShown → confirmed → (다음 타입 | end)
  utils/logger.ts           // 기록 저장 + CSV 내보내기
  utils/geo.ts              // 경로 거리·방향 계산
```

### 앱 ↔ 지도(WebView) 통신
- 지도 → 앱: `ready`, `route`(경로 좌표), `mapStatus`
- 앱 → 지도: `position`(파란 점 위치·방향), `recenter`
- 이동 시뮬레이션과 30m 도착 판정(geofence)은 앱(`NavScreen.tsx`)에서 합니다.

### 나중에 개발 빌드로 바꾸려면
`npx expo install expo-dev-client react-native-maps` 후 `src/components/MapView.tsx` 를
`react-native-maps`(PROVIDER_GOOGLE)로 다시 구현하면 됩니다. 바깥에서 쓰는 것은
`setPosition`, `recenter`, `onRoute` 세 가지뿐입니다.
