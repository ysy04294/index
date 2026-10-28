import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Fragment } from "react";
import { steps, type GradeColor } from "../data/steps";
import StepNav from "./StepNav";

type Props = {
  index: number;
  isAuto: boolean;
  onChange: (index: number) => void;
};

const GRADE_BG: Record<GradeColor, string> = {
  green: "bg-grade-green",
  bronze: "bg-grade-bronze",
  blue: "bg-grade-blue",
  purple: "bg-grade-purple",
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
  const step = steps[index];
  const reduce = useReducedMotion();
  const total = String(steps.length).padStart(2, "0");
  const current = String(index + 1).padStart(2, "0");
  // 수동 모드에서는 수동 전용 안내가 있으면 그것으로 바꿔 보여준다
  const hint = !isAuto && step.manualHint ? step.manualHint : step.hint;

  return (
    <div className="w-full">
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
              <p key={i}>
                <RichText text={p} />
              </p>
            ))}
          </div>

          <ul className="mt-6 space-y-2">
            {step.points.map((pt) => (
              <li key={pt.tag + pt.text} className="flex items-center gap-3 rounded-card bg-surface px-4 py-[14px]">
                <span className="shrink-0 rounded-full bg-green-soft px-[10px] py-1 text-[13px] font-bold text-green">
                  {pt.tag}
                </span>
                <span className="text-[15px] font-medium text-ink-1">{pt.text}</span>
                {pt.grade && (
                  <span aria-hidden className={`ml-auto h-2 w-2 shrink-0 rounded-full ${GRADE_BG[pt.grade]}`} />
                )}
              </li>
            ))}
          </ul>

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
