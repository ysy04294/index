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
    newVariantId?: string;
    stateMappings?: Record<string, string>;
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
  const stampExpanded = useRef(false);
  const presentedFrame = useRef(START_NODE_ID);
  const pending = useRef<{ index: number; nodeId: string } | null>(null);
  const navigationTimer = useRef<number | undefined>(undefined);
  const clearNavigationTimer = useCallback(() => window.clearTimeout(navigationTimer.current), []);

  const src = useMemo(
    () => buildEmbedSrc(frameNodeId, clientId),
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
    const onMessage = (event: MessageEvent) => {
      if (!FIGMA_ORIGINS.includes(event.origin) || event.source !== iframeRef.current?.contentWindow) return;
      const msg = event.data as FigmaEvent;
      if (!msg || typeof msg !== "object") return;

      switch (msg.type) {
        case "INITIAL_LOAD":
          gotInitialLoad.current = true;
          setIsAuto(true);
          setLoaded(true);
          break;

        case "PRESENTED_NODE_CHANGED": {
          const nodeId = msg.data?.presentedNodeId;
          if (!nodeId) break;
          presentedFrame.current = nodeId;
          const requested = pending.current;
          if (requested && nodeId !== requested.nodeId) break;
          let next = requested ? requested.index : stepIndexForFrame(nodeId);
          if (requested) {
            pending.current = null;
            clearNavigationTimer();
            const stamp = steps.find((step) => step.id === "stamp")!;
            if (nodeId === stamp.nodeId) {
              stampExpanded.current = steps[requested.index].id === "stamp";
              post({ type: "CHANGE_COMPONENT_STATE", data: { nodeId: stamp.stateTrigger, newVariantId: stampExpanded.current ? "1:635" : "1:601" } });
            }
          }
          if (next < 0) break;
          const stampStep = steps.findIndex((step) => step.id === "stamp");
          const mappings = msg.data?.stateMappings;
          if (mappings && nodeId === steps[stampStep].nodeId) {
            const state = Object.entries(mappings).find(([id]) => stepIndexForState(id) === stampStep)?.[1];
            if (state) stampExpanded.current = state.replace(/-/g, ":").endsWith("1:635");
          }
          if (!requested && nodeId === steps[stampStep].nodeId && stampExpanded.current) next = stampStep;
          if (!requested && steps[stepIndexRef.current].id === "motif" && steps[next].id === "main" && !stampExpanded.current) break;
          stepIndexRef.current = next;
          setStepIndex(next);
          break;
        }

        case "NEW_STATE": {
          const nodeId = msg.data?.nodeId;
          if (!nodeId) break;
          const stateStep = stepIndexForState(nodeId);
          if (stateStep < 0) break;
          const variantId = msg.data?.newVariantId?.replace(/-/g, ":");
          if (!variantId) break;
          if (variantId.endsWith("1:635")) stampExpanded.current = true;
          else if (variantId.endsWith("1:601")) stampExpanded.current = false;
          else break;
          const baseStep = stepIndexForFrame(steps[stateStep].nodeId);
          const next = stampExpanded.current ? stateStep : baseStep;
          stepIndexRef.current = next;
          setStepIndex(next);
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
  }, [reloadKey, post, clearNavigationTimer]);

  useEffect(() => () => clearNavigationTimer(), [clearNavigationTimer]);

  const goTo = useCallback(
    (index: number) => {
      const target = steps[Math.max(0, Math.min(steps.length - 1, index))];
      const i = steps.indexOf(target);
      stepIndexRef.current = i;
      setStepIndex(i);
      clearNavigationTimer();
      const reloadTarget = () => {
        pending.current = null;
        gotInitialLoad.current = false;
        setIsAuto(false);
        setLoaded(false);
        setFrameNodeId(target.nodeId);
        setReloadKey((key) => key + 1);
      };
      if (gotInitialLoad.current && presentedFrame.current === target.nodeId) {
        if (target.nodeId === steps.find((step) => step.id === "stamp")!.nodeId) {
          stampExpanded.current = target.id === "stamp";
          post({ type: "CHANGE_COMPONENT_STATE", data: { nodeId: "1:2101", newVariantId: stampExpanded.current ? "1:635" : "1:601" } });
        }
      } else if (gotInitialLoad.current) {
        pending.current = { index: i, nodeId: target.nodeId };
        post({ type: "NAVIGATE_TO_FRAME_AND_CLOSE_OVERLAYS", data: { nodeId: target.nodeId } });
        navigationTimer.current = window.setTimeout(reloadTarget, 2000);
      } else {
        reloadTarget();
      }
    },
    [post, clearNavigationTimer],
  );

  const restart = useCallback(() => {
    clearNavigationTimer();
    pending.current = null;
    stepIndexRef.current = 0;
    gotInitialLoad.current = false;
    stampExpanded.current = false;
    setStepIndex(0);
    setFrameNodeId(START_NODE_ID);
    setLoaded(false);
    setReloadKey((key) => key + 1);
  }, [clearNavigationTimer]);

  const onIframeLoad = useCallback(() => {
    // 수동 모드에서는 INITIAL_LOAD를 기다리지 않는다
    setLoaded(true);
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
