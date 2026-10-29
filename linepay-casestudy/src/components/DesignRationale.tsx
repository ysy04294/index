const research = [
  { key: "01 VALUE", title: "작은 보상은\n가치가 작게 느껴질 수 있다", stats: [["6,947P", "월평균 적립 포인트"], ["2.7 / 5", "시간·노력 대비 만족도"]], body: "금융 앱테크 이용자들은 월평균 6,947P를 적립하지만, 시간·노력 대비 적립 포인트 만족도는 2.7/5점으로 낮게 나타났습니다.", source: "한국소비자원", question: "포인트의 가치를\n어떻게 더 크게 느끼게 할까?" },
  { key: "02 DIRECTION", title: "현재 포인트만으로는\n다음 목표가 보이지 않는다", stats: [["보유 → 목표 → 방법", "리워드 화면에서 반복된 정보 흐름"]], body: "국내 금융·페이 서비스를 직접 비교하면서 현재 보유 현황 → 다음 목표·혜택 → 포인트를 얻는 방법이 반복적으로 사용되는 흐름임을 확인했습니다.", source: "국내 금융·페이 서비스 직접 사용 및 화면 비교", question: "지금 어디에 있고 무엇을 얻는지\n바로 보여줄 수 있을까?" },
  { key: "03 ROUTINE", title: "지속적인 참여는\n일상적인 접점과 연결된다", stats: [["67.7%", "앱테크를 습관으로 인식"], ["44.1%", "특정 일과에 맞춰 참여"]], body: "앱테크 이용자의 67.7%는 마일리지 획득 행동을 일종의 습관으로 인식했고 44.1%는 특정 일과에 맞춰 습관적으로 참여한다고 응답했습니다.", source: "대학내일 20대연구소", question: "결제 외에도 다시 올 이유를\n어떻게 만들까?" },
];
const principles = [
  { title: "마일리지를 갖고 싶은 재화로", body: "숫자는 쌓여도 체감되지 않습니다. 마일리지를 등급마다 모양과 색이 바뀌는 재화로 만들어, 모을수록 가치가 커지는 게 눈에 보이게 했습니다.", elements: ["3D 등급 재화", "등급별 형태·컬러", "+10M 코인 모션"] },
  { title: "현재·다음·보상을 한눈에", body: "리서치에서 확인한 '보유 → 목표 → 방법' 흐름을 한 카드에 담았습니다. 6,420M 옆에 퍼플까지 남은 양과 다음 보상을 함께 두어 다음 행동이 바로 읽힙니다.", elements: ["퍼플까지 8,580M", "다음 등급 재화 노출", "스탬프 요약"] },
  { title: "결제 없이도 모을 길을 연다", body: "앱테크는 습관처럼 반복됩니다. 결제가 없는 날에도 출석·뽑기·리워드 광고·미션 중 하나를 골라 모을 수 있게 해 매일 들를 이유를 만들었습니다.", elements: ["출석", "뽑기", "리워드 광고", "미션"] },
];
export default function DesignRationale() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-8 md:px-10 md:py-12">
      <section aria-labelledby="research-title">
        <span className="inline-block rounded-full bg-green px-4 py-1 text-[14px] font-bold tracking-wide text-white">DESK RESEARCH</span>
        <h2 id="research-title" className="mb-6 mt-4 text-[26px] font-bold leading-snug text-ink-1 md:text-[32px]">리워드 경험에서 3가지 과제를 정의했습니다</h2>
        <div className="grid gap-5 lg:grid-cols-3">
          {research.map(item => <article key={item.key} className="rounded-2xl bg-surface p-6">
            <p className="text-[20px] font-bold text-green">{item.key}</p>
            <h3 className="mt-3 whitespace-pre-line text-[21px] font-bold leading-snug text-ink-1">{item.title}</h3>
            <div className="mt-4 flex gap-2">{item.stats.map(([value,label]) => <div key={value} className="min-w-0 flex-1 rounded-xl bg-page px-3 py-4"><p className="text-[24px] font-bold leading-snug text-ink-1">{value}</p><p className="mt-1 text-[12px] text-ink-2">{label}</p></div>)}</div>
            <p className="mt-4 text-[15px] leading-[1.7] text-ink-2">{item.body}</p>
            <p className="mt-3 text-[12px] leading-relaxed text-ink-3">출처 · {item.source}</p>
            <div className="mt-5 border-t border-line pt-5"><p className="text-[12px] font-bold tracking-wide text-green">MY QUESTION</p><p className="mt-2 whitespace-pre-line text-[20px] font-bold leading-snug text-ink-1">{item.question}</p></div>
          </article>)}
        </div>
      </section>
      <section aria-labelledby="principles-title" className="mt-16">
        <span className="inline-block rounded-full bg-green px-4 py-1 text-[14px] font-bold tracking-wide text-white">DESIGN PRINCIPLES</span>
        <h2 id="principles-title" className="mb-6 mt-4 text-[26px] font-bold leading-snug text-ink-1 md:text-[32px]">3가지의 문제를 비주얼 원칙과 화면 요소로 연결했습니다</h2>
        <div className="grid gap-5 lg:grid-cols-3">
          {principles.map((item,i) => <article key={item.title} className="rounded-2xl bg-surface p-6">
            <p className="text-[20px] font-bold text-green">{research[i].key}</p>
            <p className="mt-4 text-[12px] font-bold tracking-wide text-ink-3">MY QUESTION</p>
            <p className="mt-2 whitespace-pre-line text-[20px] font-bold leading-snug text-ink-1">{research[i].question}</p>
            <p aria-hidden className="my-4 text-center text-[28px] text-green">↓</p>
            <p className="text-[12px] font-bold tracking-wide text-green">PRINCIPLE</p>
            <h3 className="mt-2 text-[23px] font-bold leading-snug text-ink-1">{item.title}</h3>
            <p className="mt-3 text-[15px] leading-[1.7] text-ink-2">{item.body}</p>
            <div className="mt-5 border-t border-line pt-4"><p className="font-bold text-ink-1">화면에서</p><ul className="mt-3 flex flex-wrap gap-2">{item.elements.map(text => <li key={text} className="rounded-full border border-line px-3 py-1 text-[13px] font-bold text-ink-1">{text}</li>)}</ul></div>
          </article>)}
        </div>
      </section>
    </div>
  );
}
