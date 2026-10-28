import type { RefObject } from "react";

export const SCREEN_W = 420;
export const SCREEN_H = 860;
const BEZEL = 0;
export const MOCKUP_W = SCREEN_W + BEZEL * 2;
export const MOCKUP_H = SCREEN_H + BEZEL * 2;

type Props = {
  iframeRef: RefObject<HTMLIFrameElement | null>;
  iframeKey: number;
  src: string;
  loaded: boolean;
  scale: number;
  onLoad: () => void;
};

export default function PhoneMockup({ iframeRef, iframeKey, src, loaded, scale, onLoad }: Props) {
  return (
    // 바깥 상자가 축소된 크기만큼 자리를 차지하고, 안쪽은 원래 크기로 그린 뒤 scale로 줄인다
    <div className="relative shrink-0" style={{ width: MOCKUP_W * scale, height: MOCKUP_H * scale }}>
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: MOCKUP_W, height: MOCKUP_H, transform: `scale(${scale})` }}
      >
        <div
          className="relative overflow-hidden bg-page"
          style={{ width: SCREEN_W, height: SCREEN_H, clipPath: "inset(0 12px)" }}
        >
          <iframe
            key={iframeKey}
            ref={iframeRef}
            src={src}
            title="LINE Pay 마일리지 Figma 프로토타입"
            onLoad={onLoad}
            allowFullScreen
            className="absolute block border-0"
            style={{ width: 495, height: 1072, left: -37.5, top: -106 }}
          />
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-page" role="status">
              <span
                aria-hidden
                className="h-9 w-9 rounded-full border-[3px] border-green-soft border-t-green"
                style={{ animation: "lp-spin 0.8s linear infinite" }}
              />
              <span className="sr-only">프로토타입을 불러오는 중</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
