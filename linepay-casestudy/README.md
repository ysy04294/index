# LINE Pay 마일리지 · 프로토타입 설명 페이지

왼쪽 iPhone 목업 안에 Figma 프로토타입(375×812)을 띄우고, 오른쪽에 지금 보이는 화면의 디자인 설명을 보여주는 단일 페이지입니다.
상단 토글로 **설명 보기 / 프로토타입만 보기**를 전환합니다 (`?mode=proto`로 링크 공유 가능).

## 실행

```bash
npm install
npm run dev      # 개발 서버
npm run build    # dist/ 에 정적 파일 생성
```

## 문구 고치기

모든 단계 문구와 Figma node ID는 `src/data/steps.ts` 한 파일에 있습니다. 본문에서 `**굵게**` 표기를 쓸 수 있습니다.

## Figma 설정

### 1. 파일 공유 설정 (필수)
Figma 파일 오른쪽 위 **Share** → 일반 접근 권한을 **"Anyone with the link · can view"(링크가 있는 사람 누구나 보기)** 로 바꿔야 임베드가 보입니다.
그렇지 않으면 목업 안에 로그인/권한 요청 화면이 뜹니다.

### 2. `VITE_FIGMA_CLIENT_ID` 발급 (선택)
client-id가 있으면 Figma Embed API 이벤트를 받아, 프로토타입에서 화면을 이동할 때 설명이 **자동으로** 바뀝니다.

1. https://www.figma.com/developers/apps 에서 **Create a new app**으로 앱을 만듭니다.
2. 앱 설정에서 **Embed** 사용을 켜고, 배포할 도메인(예: `https://내-프로젝트.vercel.app`, 로컬 테스트는 `http://localhost:5173`)을 허용 출처로 등록합니다.
3. 발급된 **Client ID**를 `.env.local`에 넣습니다.
   ```
   VITE_FIGMA_CLIENT_ID=발급받은_client_id
   ```
   Vercel이라면 Project Settings → Environment Variables에 같은 이름으로 넣습니다. GitHub Pages라면 빌드하는 환경(Actions secrets 등)에 넣어야 합니다. 빌드할 때 값이 들어갑니다.

> Embed API 이벤트 이름·형식은 Figma 문서(https://developers.figma.com/docs/embeds/)를 기준으로 합니다. 바뀌면 `src/hooks/useFigmaEmbed.ts`만 고치면 됩니다.

### 자동 모드 / 수동 모드

| | 자동 모드 (client-id 있음) | 수동 모드 (client-id 없음) |
|---|---|---|
| 설명 바뀌는 시점 | 프로토타입 화면 이동(`PRESENTED_NODE_CHANGED`), 스탬프 펼침/접힘(`NEW_STATE`) | 오른쪽 이전·다음 버튼, 단계 점, 키보드 ← → |
| 패널에서 단계 선택 | iframe에 `NAVIGATE_TO_FRAME_AND_CLOSE_OVERLAYS` 전송 | iframe `node-id`를 바꿔 다시 로드 |
| 처음부터 다시 보기 | `RESTART` 전송 | 시작 화면으로 다시 로드 |

client-id가 있어도 10초 안에 `INITIAL_LOAD`가 오지 않으면 자동으로 수동 모드로 바뀝니다.

## 배포

`vite.config.ts`의 `base: "./"` 덕분에 `dist/`를 그대로 올리면 됩니다.

- **Vercel**: Root Directory를 `linepay-casestudy`로, Framework Preset은 Vite로 지정합니다.
- **GitHub Pages**: `npm run build` 결과물 `dist/`를 Pages 브랜치나 Actions로 올립니다.

## 구조

```
src/
  App.tsx                 # 레이아웃, 모드 전환, 목업 축소, 키보드 이동
  components/
    Header.tsx            # 타이틀 + 모드 토글
    ModeToggle.tsx
    PhoneMockup.tsx       # CSS 목업 + iframe + 로딩 스피너
    StepPanel.tsx         # 설명 패널
    StepNav.tsx           # 단계 점 + 이전/다음
  hooks/useFigmaEmbed.ts  # postMessage 수신/송신, 자동·수동 모드 판별
  data/steps.ts           # 5단계 데이터
  styles/tokens.css       # 디자인 토큰 + Tailwind
```
