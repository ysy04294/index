import ModeToggle, { type Mode } from "./ModeToggle";

type Props = {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
};

export default function Header({ mode, onModeChange }: Props) {
  return (
    <header className="sticky top-0 z-20 bg-page/90 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-[1440px] items-center justify-between gap-6 px-4 py-3 md:px-10">
        <h1 className="flex min-w-0 items-center gap-2 text-[16px] font-bold leading-snug text-ink-1 md:text-[20px]">
          <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-green" />
          <span>LINE Pay Product Designer (Promotion/Visual) 지원자 백지유</span>
        </h1>
        <ModeToggle mode={mode} onChange={onModeChange} className="hidden shrink-0 md:flex" />
      </div>
      <div className="px-4 pb-3 md:hidden">
        <ModeToggle mode={mode} onChange={onModeChange} className="w-full" />
      </div>
    </header>
  );
}
