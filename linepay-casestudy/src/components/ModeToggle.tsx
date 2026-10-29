export type Mode = "rationale" | "explain" | "proto";

const OPTIONS: { value: Mode; label: string }[] = [
  { value: "rationale", label: "디자인 근거" },
  { value: "explain", label: "화면 설명" },
  { value: "proto", label: "프로토타입" },
];

type Props = {
  mode: Mode;
  onChange: (mode: Mode) => void;
  className?: string;
};

export default function ModeToggle({ mode, onChange, className = "" }: Props) {
  return (
    <div
      role="tablist"
      aria-label="보기 모드"
      className={`flex rounded-full bg-[#EBEBEB] p-1 ${className}`}
    >
      {OPTIONS.map((opt) => {
        const selected = opt.value === mode;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(opt.value)}
            className={`flex-1 whitespace-nowrap rounded-full px-4 py-2 text-[14px] font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green ${
              selected
                ? "bg-surface text-ink-1 shadow-[0_1px_3px_rgba(0,0,0,.08)]"
                : "text-ink-3 hover:text-ink-2"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
