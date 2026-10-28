// 단계별 설명 데이터. 화면 이름이나 문구가 바뀌면 이 파일만 고치면 된다.

export type StepId = "start" | "main" | "stamp" | "grade" | "collect";

export type Step = {
  id: StepId;
  nodeId: string; // Figma node ID (":" 형식)
  stateTrigger?: string; // NEW_STATE로 들어오는 단계면 컴포넌트 node ID
  label: string; // 단계 점 툴팁용 짧은 이름
  eyebrow: string; // "STEP 01"
  title: string;
  body: string[]; // 문단 배열. **굵게** 표기를 지원한다
  points: { tag: string; text: string; grade?: GradeColor }[]; // 포인트 칩
  hint?: string; // "이 부분을 눌러보세요" 안내
  manualHint?: string; // 수동 모드에서 hint 대신 보여주는 안내
};

export type GradeColor = "green" | "bronze" | "blue" | "purple";

export const FIGMA_FILE_KEY = "71jSPcfmc8ldKwZtJVVVkt";
export const FIGMA_FILE_NAME = "LINE-Pay-Mileage";

export const steps: Step[] = [
  {
    id: "start",
    nodeId: "1496:22698",
    label: "출석 완료",
    eyebrow: "STEP 00",
    title: "다시 들어오고 싶은 첫 화면",
    body: [
      "마일리지를 확인하는 데서 끝나지 않고, **방문 자체가 보상으로 이어지게** 풀었습니다.",
      "화면에 들어오면 출석을 자동으로 체크하고 +10M을 받는 순간을 팝업과 모션으로 보여줍니다. 연속 출석 일수도 함께 보여줘 다음 방문의 이유를 남겼습니다.",
    ],
    points: [
      { tag: "게이미피케이션", text: "진입 즉시 보상" },
      { tag: "모션", text: "팡 터지는 출석 팝업" },
      { tag: "리텐션", text: "연속 출석 일수" },
    ],
    hint: "팝업을 닫으면 메인 화면으로 이동합니다",
  },
  {
    id: "main",
    nodeId: "1436:20764",
    label: "메인",
    eyebrow: "STEP 01",
    title: "등급이 오를수록, 매화가 피어나도록",
    body: [
      "등급을 이름과 숫자로만 구분하지 않고, **재화의 모양과 색으로 차이를 보여주고 싶었습니다.**",
      "대만을 상징하는 매화에서 형태를 가져왔습니다. 등급이 오를수록 꽃잎이 늘어나고, 마지막 퍼플 등급에서 다섯 장의 매화가 완성됩니다.",
      "색은 대만 지폐의 초록·갈색·파랑·보라를 따왔습니다. 익숙한 화폐의 색을 등급에 연결해, 재화의 가치가 커지는 느낌을 담았습니다.",
    ],
    points: [
      { tag: "재화 디자인", text: "매화 모티브 4단계" },
      { tag: "컬러", text: "대만 지폐 색", grade: "purple" },
      { tag: "정보 구조", text: "프로필 + 등급 + 진행도" },
    ],
    hint: "\"등급 안내\"나 \"퍼플이 되면 받는 보상\"을 눌러보세요",
  },
  {
    id: "stamp",
    nodeId: "1436:20764",
    stateTrigger: "1436:20820",
    label: "결제 스탬프",
    eyebrow: "STEP 02",
    title: "결제를, 보상이 쌓이는 과정으로",
    body: [
      "결제 횟수를 숫자로만 보여주는 대신 **스탬프가 채워지는 길**로 표현했습니다.",
      "평소에는 다음 보상까지 남은 횟수를 간단히 보여줍니다. 전체 스탬프를 펼치면 지금까지 모은 기록과 앞으로 받을 보상이 이어져, 다음 결제의 목표를 볼 수 있습니다.",
      "등급 재화는 작은 스탬프에서도 알아보기 쉽도록 2D 아이콘으로 다시 그렸습니다.",
    ],
    points: [
      { tag: "게이미피케이션", text: "스탬프 길" },
      { tag: "인터랙션", text: "접힘 ↔ 펼침" },
      { tag: "시스템", text: "재화 아이콘 2D 재사용", grade: "green" },
    ],
    hint: "\"전체 스탬프\"를 눌러 펼쳐보세요",
    manualHint: "‘전체 스탬프’를 눌러보세요",
  },
  {
    id: "grade",
    nodeId: "1436:20966",
    label: "등급과 혜택",
    eyebrow: "STEP 03",
    title: "다음 등급의 보상을 먼저 보여주기",
    body: [
      "현재 등급을 확인한 뒤 **다음에는 무엇을 받을 수 있는지** 자연스럽게 살펴보도록 구성했습니다.",
      "현재 재화 뒤에 다음 등급의 재화를 살짝 겹쳐 보여줬습니다. 현재 혜택과 다음 등급의 보상을 나눠, 등급을 올릴 이유가 먼저 보이게 했습니다.",
    ],
    points: [
      { tag: "동기 부여", text: "다음 등급 미리보기", grade: "blue" },
      { tag: "정보 구조", text: "현재 혜택 / 다음 보상 분리" },
      { tag: "시각 위계", text: "다음 보상 강조" },
    ],
    hint: "왼쪽 위 뒤로 가기로 메인에 돌아갈 수 있어요",
  },
  {
    id: "collect",
    nodeId: "1436:21051",
    label: "마일리지 모으기",
    eyebrow: "STEP 04",
    title: "모으는 방법을, 바로 할 수 있는 행동으로",
    body: [
      "마일리지를 모으고 싶을 때 **지금 할 수 있는 행동을 한곳에서** 찾도록 정리했습니다.",
      "출석, 뽑기, 등급 챌린지, 리워드 광고와 오늘의 미션을 모았습니다. 광고도 시청 후 마일리지를 받는 방식으로 연결해, 혜택을 얻는 선택지로 제안했습니다.",
    ],
    points: [
      { tag: "리워드 광고", text: "보면 바로 +30M", grade: "bronze" },
      { tag: "게이미피케이션", text: "마일리지 뽑기" },
      { tag: "행동 유도", text: "오늘의 미션 진행도" },
    ],
    hint: "배너와 미션을 눌러보세요",
  },
];

/** 화면(frame) node ID → 단계. 같은 화면을 쓰는 stateTrigger 단계는 제외한다. */
export function stepIndexForFrame(nodeId: string): number {
  return steps.findIndex((s) => s.nodeId === nodeId && !s.stateTrigger);
}

/** 컴포넌트 state 변경 → 단계 */
export function stepIndexForState(nodeId: string): number {
  return steps.findIndex((s) => s.stateTrigger && nodeId.includes(s.stateTrigger));
}
