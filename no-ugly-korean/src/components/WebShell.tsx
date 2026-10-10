import type { ReactNode } from 'react';

/** 앱(iOS/Android)에서는 그대로. 웹 버전은 WebShell.web.tsx 에서 PC용 폰 프레임을 씌움 */
export default function WebShell({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
