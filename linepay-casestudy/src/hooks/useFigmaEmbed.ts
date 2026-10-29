import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FIGMA_FILE_KEY,
  FIGMA_FILE_NAME,
  steps,
  stepIndexForFrame,
  stepIndexForState,
} from "../data/steps";

const FIGMA_ORIGINS = ["https://www.figma.com", "https://embed.figma.com"];
const START_NODE_ID = steps[0].nodeId;
// client-id가 있어도 이 시간 안에 INITIAL_LOAD가 오지 않으면 수동 모드로 바꾼다
const AUTO_FALLBACK_MS = 30_000;

const toUrlId = (nodeId: string) => nodeId.replace(/:/g, "-");

function buildEmbedSrc(nodeId: string, clientId?: string) {
  const params = new URLSearchParams({
    "node-id": toUrlId(nodeId),
    "starting-point-node-id": toUrlId(nodeId),
    scaling: "scale-down",
    "content-scaling": "fixed",
    "hide-ui": "1",
    "hotspot-hints": "0",
    "embed-host": "linepay-casestudy",
  });
  if (clientId) params.set("client-id", clientId);
  return `https://embed.figma.com/proto/${FIGMA_FILE_KEY}/${FIGMA_FILE_NAME}?${params}`;
}

type FigmaEvent = {
  type?: string;
  data?: {
    presentedNodeId?: string;
    nodeId?: string;
    newVariant?: { name?: string };
  };
};

export function useFigmaEmbed() {
  const clientId = (import.meta.env.VITE_FIGMA_CLIENT_ID as string | undefined)?.trim() || "838YAvkyE60Pcous1r76ft";

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isAuto, setIsAuto] = useState(Boolean(clientId));
  const [loaded, setLoaded] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  // 수동 모드에서 iframe이 보여줄 화면. 바뀌면 iframe을 다시 로드한다.
  const [frameNodeId, setFrameNodeId] = useState(START_NODE_ID);
  // 다시 보기는 모드와 관계없이 iframe을 새로 만들어 내부 진행 상태까지 초기화한다
  const [reloadKey, setReloadKey] = useState(0);

  const stepIndexRef = useRef(stepIndex);
  stepIndexRef.current = stepIndex;
  const gotInitialLoad = useRef(false);

  const src = useMemo(
    () => buildEmbedSrc(isAuto ? START_NODE_ID : frameNodeId, clientId),
    // 자동 모드에서는 src를 고정해 iframe이 다시 로드되지 않게 한다
    [isAuto, frameNodeId, clientId],
  );

  const post = useCallback((message: unknown) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    // iframe 출처가 문서마다 다를 수 있어 두 출처로 보낸다. 맞지 않는 쪽은 브라우저가 무시한다.
    for (const origin of FIGMA_ORIGINS) win.postMessage(message, origin);
  }, []);

  // Figma Embed API 이벤트 수신
  useEffect(() => {
    if (!isAuto) return;

    const onMessage = (event: MessageEvent) => {
      if (!FIGMA_ORIGINS.includes(event.origin) || event.source !== iframeRef.current?.contentWindow) return;
      const msg = event.data as FigmaEvent;
      if (!msg || typeof msg !== "object") return;

      switch (msg.type) {
        case "INITIAL_LOAD":
          gotInitialLoad.current = true;
          setLoaded(true);
          break;

        case "PRESENTED_NODE_CHANGED": {
          const nodeId = msg.data?.presentedNodeId;
          if (!nodeId) break;
          const next = stepIndexForFrame(nodeId);
          if (next < 0) break;
          // 같은 화면을 쓰는 단계(main ↔ stamp)에 있으면 현재 단계를 유지한다
          if (steps[stepIndexRef.current].nodeId === nodeId) break;
          setStepIndex(next);
          break;
        }

        case "NEW_STATE": {
          const nodeId = msg.data?.nodeId;
          if (!nodeId) break;
          const stateStep = stepIndexForState(nodeId);
          if (stateStep < 0) break;
          const variant = msg.data?.newVariant?.name ?? "";
          const expanded = variant.includes("펼침")
            ? true
            : variant.includes("접힘")
              ? false
              : stepIndexRef.current !== stateStep; // 이름을 알 수 없으면 토글로 판단
          const baseStep = stepIndexForFrame(steps[stateStep].nodeId);
          setStepIndex(expanded ? stateStep : baseStep);
          break;
        }
      }
    };

    window.addEventListener("message", onMessage);
    const timer = window.setTimeout(() => {
      if (!gotInitialLoad.current) {
        console.warn("[figma] INITIAL_LOAD가 오지 않아 수동 모드로 전환합니다.");
        setIsAuto(false);
        setFrameNodeId(steps[stepIndexRef.current].nodeId);
      }
    }, AUTO_FALLBACK_MS);

    return () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(timer);
    };
  }, [isAuto, reloadKey]);

  const goTo = useCallback(
    (index: number) => {
      const target = steps[Math.max(0, Math.min(steps.length - 1, index))];
      const i = steps.indexOf(target);
      setStepIndex(i);
      if (isAuto) {
        post({ type: "NAVIGATE_TO_FRAME_AND_CLOSE_OVERLAYS", data: { nodeId: target.nodeId } });
      } else {
        setLoaded(false);
        setFrameNodeId(target.nodeId);
        setReloadKey((key) => key + 1);
      }
    },
    [isAuto, frameNodeId, post],
  );

  const restart = useCallback(() => {
    stepIndexRef.current = 0;
    gotInitialLoad.current = false;
    setStepIndex(0);
    setLoaded(false);
    setFrameNodeId(START_NODE_ID);
    setReloadKey((key) => key + 1);
  }, []);

  const onIframeLoad = useCallback(() => {
    // 수동 모드에서는 INITIAL_LOAD를 기다리지 않는다
    if (!isAuto) setLoaded(true);
  }, [isAuto]);

  return {
    iframeRef,
    src,
    iframeKey: reloadKey,
    loaded,
    isAuto,
    stepIndex,
    goTo,
    restart,
    onIframeLoad,
  };
}
