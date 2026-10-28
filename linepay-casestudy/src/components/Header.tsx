import ModeToggle, { type Mode } from "./ModeToggle";

type Props = {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
};

export default function Header({ mode, onModeChange }: Props) {
  return (
    <header className="sticky top-0 z-20 bg-page/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:px-10">
        <h1 className="flex items-center gap-2 text-[20px] font-bold text-ink-1">
          <span aria-hidden className="h-2 w-2 rounded-full bg-green" />
          LINE Pay 마일리지
        </h1>
        <ModeToggle mode={mode} onChange={onModeChange} className="hidden md:flex" />
      </div>
      <div className="px-4 pb-3 md:hidden">
        <ModeToggle mode={mode} onChange={onModeChange} className="w-full" />
      </div>
    </header>
  );
}
