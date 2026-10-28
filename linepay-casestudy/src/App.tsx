import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import Header from "./components/Header";
import type { Mode } from "./components/ModeToggle";
import PhoneMockup, { MOCKUP_H, MOCKUP_W } from "./components/PhoneMockup";
import StepPanel from "./components/StepPanel";
import { useFigmaEmbed } from "./hooks/useFigmaEmbed";

const MOBILE_BP = 768;
const HEADER_H = 64;

function readMode(): Mode {
  return new URLSearchParams(window.location.search).get("mode") === "proto" ? "proto" : "explain";
}

/** 화면 크기에 맞춰 목업 축소 비율을 정한다. 375×812 비율은 그대로 유지된다. */
function useMockupScale() {
  const calc = () => {
    const { innerWidth: w, innerHeight: h } = window;
    if (w < MOBILE_BP) return Math.min(1, (w * 0.9) / MOCKUP_W);
    // 헤더·여백·목업 아래 안내 한 줄까지 한 화면에 들어오게 줄인다
    return Math.max(0.5, Math.min(1, (h - HEADER_H - 96) / MOCKUP_H));
  };
  const [scale, setScale] = useState(calc);
  useEffect(() => {
    const onResize = () => setScale(calc());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return scale;
}

export default function App() {
  const [mode, setModeState] = useState<Mode>(readMode);
  const embed = useFigmaEmbed();
  const scale = useMockupScale();
  const reduce = useReducedMotion();
  const { stepIndex, goTo } = embed;

  const setMode = useCallback((next: Mode) => {
    setModeState(next);
    const url = new URL(window.location.href);
    if (next === "proto") url.searchParams.set("mode", "proto");
    else url.searchParams.delete("mode");
    window.history.replaceState(null, "", url);
  }, []);

  // 키보드 ← → 로 단계 이동 (설명 보기 모드에서만)
  useEffect(() => {
    if (mode !== "explain") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") goTo(stepIndex + 1);
      else if (e.key === "ArrowLeft") goTo(stepIndex - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, stepIndex, goTo]);

  const transition = { duration: reduce ? 0 : 0.3, ease: [0.4, 0, 0.2, 1] as const };
  const explain = mode === "explain";

  return (
    <div className="min-h-screen">
      <Header mode={mode} onModeChange={setMode} />

      <main
        className="relative mx-auto flex max-w-[1440px] flex-col items-center px-4 py-6 md:min-h-[calc(100vh-64px)] md:flex-row md:justify-center md:gap-20 md:px-10"
      >
        <LayoutGroup>
          {/* 목업은 항상 같은 위치의 같은 요소로 둔다. 그래야 모드를 바꿔도 iframe이 다시 로드되지 않는다. */}
          <motion.div layout="position" transition={transition} className="flex flex-col items-center">
            <PhoneMockup
              iframeRef={embed.iframeRef}
              iframeKey={embed.iframeKey}
              src={embed.src}
              loaded={embed.loaded}
              scale={scale}
              onLoad={embed.onIframeLoad}
            />
            <p className="mt-4 min-h-5 text-center text-[13px] text-ink-3">
              {explain ? (
                !embed.isAuto && (
                  <>
                    <span className="hidden md:inline">설명은 오른쪽에서 넘겨주세요</span>
                    <span className="md:hidden">설명은 아래에서 넘겨주세요</span>
                  </>
                )
              ) : (
                <>
                  화면을 직접 눌러보세요 ·{" "}
                  <button
                    type="button"
                    onClick={embed.restart}
                    className="font-medium text-ink-2 underline-offset-2 hover:text-green hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
                  >
                    처음부터 다시 보기 ↺
                  </button>
                </>
              )}
            </p>
          </motion.div>

          <AnimatePresence mode="popLayout" initial={false}>
            {explain && (
              <motion.section
                key="panel"
                aria-label="디자인 설명"
                initial={{ opacity: 0, x: reduce ? 0 : 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: reduce ? 0 : 24 }}
                transition={transition}
                className="mt-8 w-full max-w-[520px] md:mt-0 md:min-w-0 md:flex-1"
              >
                <StepPanel index={stepIndex} isAuto={embed.isAuto} onChange={goTo} />
              </motion.section>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </main>
    </div>
  );
}
