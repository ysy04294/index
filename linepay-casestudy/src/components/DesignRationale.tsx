
const research = [
{key:"VALUE",title:"작은 보상은 가치가 작게 느껴질 수 있다",stats:[["6,947P","월평균 적립 포인트"],["2.7 / 5","시간·노력 대비 만족도"]],body:"금융 앱테크 이용자들은 월평균 6,947P를 적립하지만, 시간·노력 대비 적립 포인트 만족도는 2.7/5점으로 낮게 나타났습니다.",source:"한국소비자원"},
{key:"DIRECTION",title:"현재 포인트만으로는\n다음 목표가 보이지 않는다",stats:[["보유 → 목표 → 방법","리워드 화면에서 반복된 정보 흐름"]],body:"국내 금융·페이 서비스를 직접 비교하면서 현재 보유 현황 → 다음 목표·혜택 → 포인트를 얻는 방법이 반복적으로 사용되는 흐름임을 확인했습니다.",source:"국내 금융·페이 서비스 직접 사용 및 화면 비교"},
{key:"ROUTINE",title:"지속적인 참여는 일상적인 접점과 연결된다",stats:[["67.7%","앱테크를 습관으로 인식"],["2.44.1%","특정 일과에 맞춰 참여"]],body:"앱테크 이용자의 67.7%는 마일리지 획득 행동을 일종의 습관으로 인식했고 44.1%는 특정 일과에 맞춰 습관적으로 참여한다고 응답했습니다.",source:"대학내일 20대연구소"},
];
const principles=[
{question:"모은 만큼 ‘쌓였다’고\n느끼게 하려면?",title:"마일리지를\n갖고 싶은 재화로",elements:["3D 등급 재화","등급별 형태·컬러","+10M 코인 모션"]},
{question:"지금 어디쯤이고 다음에 뭘 받는지\n한눈에 보여주려면?",title:"현재는 한눈에,\n다음 보상을 눈앞에",elements:["스탬프 요약","퍼플까지 8,580M","다음 등급 재화 노출"]},
{question:"결제 외에도 다시 올 이유를\n어떻게 만들까?",title:"참여는 다채롭게,\n보상은 차곡차곡",elements:["출석","뽑기","리워드 광고","미션"]},
];
export default function DesignRationale(){
return <div className="mx-auto w-full max-w-[1440px] px-4 py-8 md:px-10 md:py-12">
<section aria-labelledby="research-title">
<span className="inline-block rounded-full bg-green px-4 py-1 text-[16px] font-bold text-white">기획 배경</span>
<div className="mt-5">
<div>
<h2 id="research-title" className="text-[28px] font-bold leading-[1.5] text-ink-1 md:text-[36px]">마일리지를 모을 명분은 있지만 계속할 명분도 없다,<br/>한 번의 참여를 지속적인 습관으로 이어가려면?</h2>
<article className="mt-10 rounded-3xl bg-surface p-6 md:p-12">
<p className="text-[26px] font-bold text-green">CORE ISSUE</p>
<h3 className="mt-4 text-[28px] font-bold leading-snug text-ink-1">가입 후 2개월 안에 <span className="text-[48px] text-green">74%</span>는 참여를 멈춘다.</h3>
<p className="mt-3 text-[20px] text-ink-2">이탈은 탈퇴가 아니라 ‘조용한 이탈’로 일어납니다.</p>
<div className="mt-8 flex justify-between text-[18px] font-bold text-ink-1"><span>참여 중단 · 회원은 유지</span><span className="text-green">74%</span></div>
<div role="img" aria-label="참여 중단 · 회원은 유지 74%" className="mt-2 h-4 rounded-full bg-line"><div className="h-full w-[74%] rounded-full bg-green"/></div>
<div className="mt-5 flex justify-between text-[18px] font-bold text-ink-3"><span>실제 탈퇴</span><span>3.4%</span></div>
<div role="img" aria-label="실제 탈퇴 3.4%" className="mt-2 h-4 rounded-full bg-line"><div className="h-full w-[3.4%] rounded-full bg-ink-3"/></div>
<p className="mt-5 text-right text-[12px] text-ink-3">출처 · Antavo, Global Customer Loyalty Report 2026</p>
</article>
</div>
<div className="mt-6 grid gap-5 lg:grid-cols-3">{research.map(item=><article key={item.key} className="rounded-2xl bg-surface p-5">
<p className="text-center text-[18px] font-bold text-green">{item.key}</p>
<h3 className="whitespace-pre-line text-center text-[17px] font-bold leading-snug text-ink-1">{item.title}</h3>
<div className="mt-2 flex gap-2">{item.stats.map(([value,label])=><div key={value} className="min-w-0 flex-1 rounded-xl bg-page p-2 text-center"><p className="text-[17px] font-bold text-ink-1">{value}</p><p className="text-[11px] text-ink-2">{label}</p></div>)}</div>
<p className="mt-2 text-[13px] leading-[1.7] text-ink-2">{item.body}</p>
<p className="mt-2 text-[10px] text-ink-3">출처 · {item.source}</p>
</article>)}</div>
</div>
</section>
<section aria-labelledby="principles-title" className="mt-16">
<span className="inline-block rounded-full bg-green px-4 py-1 text-[16px] font-bold text-white">디자인 원칙</span>
<h2 id="principles-title" className="mt-4 text-[28px] font-bold leading-snug text-ink-1 md:text-[36px]">첫 적립이 마지막 참여가 되지 않도록</h2>
<p className="mt-2 text-[20px] font-bold text-ink-2">받는 순간 다음 목표가 보이고 결제 없는 날에도 참여가 이어지도록 설계했습니다.</p>
<div className="mt-8 grid gap-5 lg:grid-cols-3">{principles.map((item,i)=><article key={item.title} className="rounded-2xl bg-surface p-6">
<p className="text-center text-[26px] font-bold text-green">{research[i].key}</p>
<p className="mt-3 text-center text-[12px] font-bold tracking-wide text-ink-3">MY QUESTION</p>
<p className="mt-2 whitespace-pre-line text-center text-[21px] font-bold leading-snug text-ink-1">{item.question}</p>
<p aria-hidden className="my-2 text-center text-[26px] text-green">↓</p>
<h3 className="whitespace-pre-line rounded-xl bg-green px-4 py-5 text-center text-[26px] font-bold leading-snug text-white">{item.title}</h3>
<div className="mt-5 border-t border-line pt-4"><p className="font-bold text-ink-1">화면에서</p><ul className="mt-3 flex flex-wrap gap-2">{item.elements.map(text=><li key={text} className="rounded-full bg-page px-3 py-1 text-[12px] font-bold text-ink-1">{text}</li>)}</ul></div>
</article>)}</div>
</section>
</div>;
}
