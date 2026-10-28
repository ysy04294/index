import { steps } from "../data/steps";

type Props = {
  index: number;
  onChange: (index: number) => void;
};

export default function StepNav({ index, onChange }: Props) {
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;

  return (
    <nav aria-label="단계 이동" className="flex flex-wrap items-center justify-between gap-4">
      <ol className="flex items-center gap-2">
        {steps.map((s, i) => {
          const current = i === index;
          return (
            <li key={s.id} className="flex">
              <button
                type="button"
                onClick={() => onChange(i)}
                title={s.label}
                aria-label={`${s.eyebrow} ${s.label}`}
                aria-current={current ? "step" : undefined}
                className="group flex h-6 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-300 ${
                    current ? "w-6 bg-green" : "w-2 bg-[#D9D9D9] group-hover:bg-ink-3"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ol>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(index - 1)}
          disabled={isFirst}
          className="h-11 rounded-full border border-line bg-surface px-5 text-[15px] font-medium text-ink-1 transition-colors hover:bg-[#FAFAFA] disabled:cursor-not-allowed disabled:text-ink-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
        >
          이전
        </button>
        <button
          type="button"
          onClick={() => onChange(index + 1)}
          disabled={isLast}
          className="h-11 rounded-full bg-green px-6 text-[15px] font-bold text-white transition-colors hover:bg-green-dark disabled:cursor-not-allowed disabled:bg-[#D9D9D9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
        >
          다음
        </button>
      </div>
    </nav>
  );
}
