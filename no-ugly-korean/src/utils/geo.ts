import type { LatLng } from '../config/scenario';

const R = 6371000;
const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

export function distanceMeters(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** a → b 방향 (0 = 북, 시계 방향) */
export function bearing(a: LatLng, b: LatLng): number {
  const y = Math.sin(toRad(b.lng - a.lng)) * Math.cos(toRad(b.lat));
  const x =
    Math.cos(toRad(a.lat)) * Math.sin(toRad(b.lat)) -
    Math.sin(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.cos(toRad(b.lng - a.lng));
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export type Route = {
  points: LatLng[];
  /** 각 점까지의 누적 거리 */
  cumulative: number[];
  total: number;
};

export function buildRoute(points: LatLng[]): Route {
  const cumulative = [0];
  for (let i = 1; i < points.length; i++) {
    cumulative.push(cumulative[i - 1] + distanceMeters(points[i - 1], points[i]));
  }
  return { points, cumulative, total: cumulative[cumulative.length - 1] ?? 0 };
}

/** 출발지로부터 distance(m) 지점의 위치와 진행 방향 */
export function pointAt(route: Route, distance: number): LatLng & { heading: number } {
  const { points, cumulative, total } = route;
  if (points.length === 1) return { ...points[0], heading: 0 };
  const d = Math.max(0, Math.min(distance, total));
  let i = 1;
  while (i < cumulative.length - 1 && cumulative[i] < d) i++;
  const a = points[i - 1];
  const b = points[i];
  const seg = cumulative[i] - cumulative[i - 1];
  const t = seg > 0 ? (d - cumulative[i - 1]) / seg : 0;
  return {
    lat: a.lat + (b.lat - a.lat) * t,
    lng: a.lng + (b.lng - a.lng) * t,
    heading: bearing(a, b),
  };
}
