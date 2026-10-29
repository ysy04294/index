import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Fragment, useRef } from "react";
import { createPortal } from "react-dom";
import { steps } from "../data/steps";
import StepNav from "./StepNav";

type Props = {
  index: number;
  isAuto: boolean;
  onChange: (index: number) => void;
};


/** "**굵게**" 표기를 <strong>으로 바꾼다 */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-bold text-ink-1">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

function HandIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M18 11V6a2 2 0 0 0-4 0v1" />
      <path d="M14 10V4a2 2 0 0 0-4 0v2" />
      <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

export default function StepPanel({ index, isAuto, onChange }: Props) {
  const imageDialog = useRef<HTMLDialogElement>(null);
  const step = steps[index];
  const reduce = useReducedMotion();
  const total = String(steps.length).padStart(2, "0");
  const current = String(index + 1).padStart(2, "0");
  // 수동 모드에서는 수동 전용 안내가 있으면 그것으로 바꿔 보여준다
  const hint = !isAuto && step.manualHint ? step.manualHint : step.hint;

  return (
    <div className="w-full">
      {createPortal(
        <dialog ref={imageDialog} aria-label="등급 재화 디자인 확대" className="fixed inset-0 m-auto w-[94vw] max-w-[1800px] max-h-[90vh] overflow-auto rounded-2xl border-0 bg-page p-5 shadow-2xl backdrop:bg-black/50" onClick={(event) => { if (event.target === event.currentTarget) imageDialog.current?.close(); }} onKeyDown={(event) => event.stopPropagation()}>
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-[16px] font-bold text-ink-1">매화 모티브와 대만 지폐 색으로 만든 등급 재화</h2>
            <button type="button" autoFocus onClick={() => imageDialog.current?.close()} className="shrink-0 rounded-full px-4 py-2 text-ink-1 hover:bg-line" aria-label="확대 이미지 닫기">닫기 ×</button>
          </div>
          <img src="/grade-motif.svg" alt="대만 지폐의 색과 매화 형태를 연결한 4단계 등급 재화" className="block h-auto w-full" width="1800" height="183" />
        </dialog>, document.body
      )}
      <div aria-live="polite" className="sr-only">
        {step.eyebrow} {step.title}
      </div>

      <div className="flex items-center justify-between text-[13px] font-bold tracking-[0.08em] text-green">
        <span>{step.eyebrow}</span>
        <span className="text-ink-3">
          {current} / {total}
        </span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step.id}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
        >
          <h2 className="mt-3 text-[26px] font-bold leading-[1.3] text-ink-1 md:text-[32px]">{step.title}</h2>

          <div className="mt-5 space-y-3 text-[16px] leading-[1.7] text-ink-2 md:text-[17px]">
            {step.body.map((p, i) => (
              <Fragment key={i}>
                {p.startsWith("- ") ? (
                  <ul className="list-disc space-y-1 pl-5">
                    {p.split("\n").map((item, itemIndex) => <li key={itemIndex}><RichText text={item.slice(2)} /></li>)}
                  </ul>
                ) : <p><RichText text={p} /></p>}
                {step.id === "motif" && i === step.body.length - 1 && (
                  <figure className="my-5">
                    <button type="button" onClick={() => imageDialog.current?.showModal()} className="block w-full cursor-zoom-in rounded-lg bg-page p-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green" aria-label="등급 재화 디자인 이미지 크게 보기">
                      <img src="/grade-motif.svg" alt="대만 200·500·1000·2000원권의 색과 매화 꽃잎 형태를 연결한 그린·브론즈·블루·퍼플 등급 재화" className="block h-auto w-full" width="1800" height="183" />
                    </button>
                    <figcaption className="mt-2 text-[12px] leading-relaxed text-ink-3">그린 → 브론즈 → 블루 → 퍼플 · 이미지를 누르면 크게 볼 수 있습니다.</figcaption>
                  </figure>
                )}
              </Fragment>
            ))}
          </div>


          {hint && (
            <p className="mt-4 flex items-center gap-2 text-[14px] font-medium text-ink-3">
              <HandIcon />
              {hint}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-10">
        <StepNav index={index} onChange={onChange} />
      </div>
    </div>
  );
}
