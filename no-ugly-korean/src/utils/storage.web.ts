/** 웹 버전 기록 저장소: 브라우저 localStorage + 파일 다운로드(또는 공유) */
const KEY = 'nuk_sessions';

export function loadText(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function saveText(text: string) {
  try {
    window.localStorage.setItem(KEY, text);
  } catch (e) {
    console.warn('기록 저장 실패', e);
  }
}

export async function shareFile(fileName: string, text: string, mimeType: string) {
  const blob = new Blob([text], { type: mimeType });
  // 휴대폰 브라우저: 공유 시트(에어드롭·메일 등)로 보내기
  try {
    const file = new File([blob], fileName, { type: mimeType });
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    if (nav.canShare?.({ files: [file] }) && /iPhone|iPad|Android/i.test(navigator.userAgent)) {
      await nav.share({ files: [file], title: fileName });
      return;
    }
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') return;
  }
  // PC: 파일 다운로드
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
