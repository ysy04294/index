import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

/** 기록 저장소 (앱: 문서 폴더의 JSON 파일 / 웹: storage.web.ts) */
const STORE = new File(Paths.document, 'nuk_sessions.json');

export function loadText(): string | null {
  try {
    return STORE.exists ? STORE.textSync() : null;
  } catch {
    return null;
  }
}

export function saveText(text: string) {
  try {
    if (!STORE.exists) STORE.create({ intermediates: true });
    STORE.write(text);
  } catch (e) {
    console.warn('기록 저장 실패', e);
  }
}

/** CSV 파일을 만들어 iOS 공유 시트(에어드롭·메일·파일)를 띄움 */
export async function shareFile(fileName: string, text: string, mimeType: string) {
  const file = new File(Paths.cache, fileName);
  if (file.exists) file.delete();
  file.create();
  file.write(text);
  if (!(await Sharing.isAvailableAsync())) throw new Error('이 기기에서는 공유를 사용할 수 없어요');
  await Sharing.shareAsync(file.uri, { mimeType, UTI: 'public.comma-separated-values-text', dialogTitle: '기록 내보내기' });
}
