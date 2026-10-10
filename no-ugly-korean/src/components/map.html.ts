import type { LatLng } from '../config/scenario';

/**
 * WebView 안에서 돌아가는 Google Maps JavaScript 페이지.
 *
 * WebView → 앱: window.ReactNativeWebView.postMessage(JSON)
 *   { type: 'ready' }                                   스크립트 준비됨
 *   { type: 'route', path: LatLng[], source }           경로 확정 (routes | directions | fallback | preset)
 *   { type: 'mapStatus', status: 'google' | 'offline' } 지도 종류
 *   { type: 'log', message }                            디버그용
 *
 * 앱 → WebView: window.__fromRN(msg)
 *   { type: 'position', lat, lng, heading }             파란 점 이동 (지도가 따라감)
 *   { type: 'recenter' }                                컨테이너 크기가 바뀌었을 때
 */
export type MapHtmlOptions = {
  apiKey: string;
  origin: LatLng;
  destination: LatLng;
  fallbackPath: LatLng[];
  /** 이전에 받아 둔 경로가 있으면 다시 요청하지 않음 */
  presetPath?: LatLng[] | null;
  zoom?: number;
};

export function buildMapHtml(opts: MapHtmlOptions): string {
  const cfg = JSON.stringify({ zoom: 18, ...opts });
  const key = encodeURIComponent(opts.apiKey);
  return `<!doctype html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style>
  html,body{margin:0;padding:0;height:100%;width:100%;overflow:hidden;background:#e8eaed;
    font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo",sans-serif;-webkit-user-select:none;}
  #map{position:absolute;inset:0;}
  #offline{position:absolute;inset:0;display:none;}
  #offmsg{position:absolute;left:12px;bottom:12px;display:none;background:rgba(32,33,36,.75);color:#fff;
    font-size:12px;padding:6px 10px;border-radius:8px;}
  .gm-style-cc,.gmnoprint a,a[href^="https://maps.google.com/maps"]{display:none!important;}
</style>
</head><body>
<div id="map"></div>
<canvas id="offline"></canvas>
<div id="offmsg">오프라인 지도 (API 키를 확인하세요)</div>
<script>
var CFG = ${cfg};
function send(m){ try{ window.ReactNativeWebView.postMessage(JSON.stringify(m)); }catch(e){} }
window.onerror = function(m){ send({type:'log', message:String(m)}); };

var mode = 'loading';           // loading | google | offline
var path = null;                // [{lat,lng}]
var pos = null;                 // {lat,lng,heading}
var map, routeLine, destMarker, haloMarker, dotMarker, coneMarker;

function withTimeout(p, ms){
  return Promise.race([p, new Promise(function(_, rej){ setTimeout(function(){ rej(new Error('timeout')); }, ms); })]);
}
function ll(p){ return { lat: typeof p.lat === 'function' ? p.lat() : p.lat, lng: typeof p.lng === 'function' ? p.lng() : p.lng }; }

function finishRoute(p, source){
  if (path) return;
  path = p;
  send({type:'route', path: path, source: source});
  if (mode === 'google') drawGoogleRoute();
  if (mode === 'offline') drawOffline();
}

// ───────── Google 지도 ─────────
async function fetchRoute(){
  if (CFG.presetPath && CFG.presetPath.length > 1) return { path: CFG.presetPath, source: 'preset' };
  try {
    var lib = await withTimeout(google.maps.importLibrary('routes'), 5000);
    if (lib && lib.Route && lib.Route.computeRoutes) {
      var res = await withTimeout(lib.Route.computeRoutes({
        origin: CFG.origin, destination: CFG.destination, travelMode: 'WALKING', fields: ['path']
      }), 5000);
      if (res && res.routes && res.routes[0] && res.routes[0].path && res.routes[0].path.length > 1) {
        return { path: res.routes[0].path.map(ll), source: 'routes' };
      }
    }
  } catch (e) { send({type:'log', message:'Routes API: ' + e.message}); }
  try {
    var ds = new google.maps.DirectionsService();
    var r = await withTimeout(ds.route({
      origin: CFG.origin, destination: CFG.destination, travelMode: google.maps.TravelMode.WALKING
    }), 5000);
    var ov = r.routes[0].overview_path;
    if (ov && ov.length > 1) return { path: ov.map(ll), source: 'directions' };
  } catch (e) { send({type:'log', message:'Directions: ' + e.message}); }
  return { path: CFG.fallbackPath, source: 'fallback' };
}

function initMap(){
  if (mode === 'offline') return;
  mode = 'google';
  send({type:'mapStatus', status:'google'});
  map = new google.maps.Map(document.getElementById('map'), {
    center: CFG.origin, zoom: CFG.zoom, disableDefaultUI: true, gestureHandling: 'none',
    keyboardShortcuts: false, clickableIcons: false,
    styles: [{ featureType: 'poi.business', stylers: [{ visibility: 'simplified' }] }]
  });
  destMarker = new google.maps.Marker({ position: CFG.destination, map: map, zIndex: 5 });
  haloMarker = new google.maps.Marker({ map: map, zIndex: 8, clickable: false, icon: {
    path: google.maps.SymbolPath.CIRCLE, scale: 22, fillColor: '#1a73e8', fillOpacity: 0.16, strokeWeight: 0 } });
  coneMarker = new google.maps.Marker({ map: map, zIndex: 9, clickable: false, icon: coneIcon(0) });
  dotMarker = new google.maps.Marker({ map: map, zIndex: 10, clickable: false, icon: {
    path: google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: '#1a73e8', fillOpacity: 1,
    strokeColor: '#ffffff', strokeWeight: 3 } });
  if (path) drawGoogleRoute();
  applyPosition();
  fetchRoute().then(function(r){ finishRoute(r.path, r.source); });
}
window.initMap = initMap;

function coneIcon(heading){
  return { path: 'M 0 -4.2 L 1.6 -1.6 Q 0 -2.2 -1.6 -1.6 Z', scale: 6, rotation: heading,
    fillColor: '#1a73e8', fillOpacity: 1, strokeColor: '#ffffff', strokeWeight: 1.5,
    anchor: new google.maps.Point(0, 0) };
}

function drawGoogleRoute(){
  if (!map || !path) return;
  if (routeLine) routeLine.setMap(null);
  routeLine = new google.maps.Polyline({
    path: path, map: map, strokeOpacity: 0, zIndex: 3,
    icons: [{ icon: { path: google.maps.SymbolPath.CIRCLE, scale: 3.2, fillColor: '#1a73e8', fillOpacity: 1,
      strokeColor: '#1558b0', strokeWeight: 1 }, offset: '0', repeat: '12px' }]
  });
}

function applyPosition(){
  if (!pos) return;
  if (mode === 'google' && map) {
    var p = { lat: pos.lat, lng: pos.lng };
    haloMarker.setPosition(p); dotMarker.setPosition(p); coneMarker.setPosition(p);
    coneMarker.setIcon(coneIcon(pos.heading || 0));
    if (map.moveCamera) map.moveCamera({ center: p }); else map.setCenter(p);
  } else if (mode === 'offline') {
    drawOffline();
  }
}

window.gm_authFailure = function(){ send({type:'log', message:'gm_authFailure'}); useOffline(); };

// ───────── 오프라인(키 없음/실패) 그림 지도 ─────────
function useOffline(){
  if (mode === 'offline') return;
  mode = 'offline';
  send({type:'mapStatus', status:'offline'});
  document.getElementById('map').style.display = 'none';
  document.getElementById('offline').style.display = 'block';
  document.getElementById('offmsg').style.display = 'block';
  finishRoute(CFG.presetPath && CFG.presetPath.length > 1 ? CFG.presetPath : CFG.fallbackPath,
    CFG.presetPath ? 'preset' : 'fallback');
  drawOffline();
}

function drawOffline(){
  var c = document.getElementById('offline');
  var w = window.innerWidth, h = window.innerHeight, dpr = window.devicePixelRatio || 1;
  c.width = w * dpr; c.height = h * dpr; c.style.width = w + 'px'; c.style.height = h + 'px';
  var g = c.getContext('2d'); g.scale(dpr, dpr);
  g.fillStyle = '#f1f3f4'; g.fillRect(0, 0, w, h);
  var center = pos || CFG.origin;
  var mPerPx = 0.6;  // 줌 느낌
  var kLat = 111320, kLng = 111320 * Math.cos(center.lat * Math.PI / 180);
  function xy(p){ return [w/2 + (p.lng - center.lng) * kLng / mPerPx, h/2 - (p.lat - center.lat) * kLat / mPerPx]; }
  // 블록 느낌의 격자
  g.strokeStyle = '#ffffff'; g.lineWidth = 14;
  for (var i = -6; i <= 6; i++) {
    g.beginPath(); g.moveTo(0, h/2 + i * 90 + 30); g.lineTo(w, h/2 + i * 90 + 10); g.stroke();
    g.beginPath(); g.moveTo(w/2 + i * 110 + 20, 0); g.lineTo(w/2 + i * 110 - 10, h); g.stroke();
  }
  if (path) {
    g.fillStyle = '#1a73e8';
    for (var j = 1; j < path.length; j++) {
      var a = xy(path[j-1]), b = xy(path[j]);
      var len = Math.hypot(b[0]-a[0], b[1]-a[1]);
      for (var s = 0; s < len; s += 12) {
        g.beginPath(); g.arc(a[0] + (b[0]-a[0]) * s/len, a[1] + (b[1]-a[1]) * s/len, 3.2, 0, 7); g.fill();
      }
    }
  }
  var d = xy(CFG.destination);
  g.fillStyle = '#ea4335'; g.beginPath(); g.arc(d[0], d[1] - 18, 10, 0, 7); g.fill();
  g.beginPath(); g.moveTo(d[0] - 8, d[1] - 13); g.lineTo(d[0], d[1]); g.lineTo(d[0] + 8, d[1] - 13); g.fill();
  g.fillStyle = '#a50e0e'; g.beginPath(); g.arc(d[0], d[1] - 18, 3.5, 0, 7); g.fill();
  if (pos) {
    var p = xy(pos);
    g.fillStyle = 'rgba(26,115,232,.16)'; g.beginPath(); g.arc(p[0], p[1], 22, 0, 7); g.fill();
    g.save(); g.translate(p[0], p[1]); g.rotate((pos.heading || 0) * Math.PI / 180);
    g.fillStyle = '#1a73e8'; g.strokeStyle = '#fff'; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(0, -25); g.lineTo(9, -10); g.quadraticCurveTo(0, -13, -9, -10); g.closePath(); g.fill(); g.stroke();
    g.restore();
    g.fillStyle = '#1a73e8'; g.strokeStyle = '#fff'; g.lineWidth = 3;
    g.beginPath(); g.arc(p[0], p[1], 8, 0, 7); g.fill(); g.stroke();
  }
}

// ───────── 앱 → WebView ─────────
window.__fromRN = function(msg){
  if (!msg) return;
  if (msg.type === 'position') { pos = msg; applyPosition(); }
  if (msg.type === 'recenter') {
    if (mode === 'google' && map) { google.maps.event.trigger(map, 'resize'); applyPosition(); }
    if (mode === 'offline') drawOffline();
  }
};
window.addEventListener('resize', function(){ if (mode === 'offline') drawOffline(); else applyPosition(); });

send({type:'ready'});
if (!CFG.apiKey) { useOffline(); }
else { setTimeout(function(){ if (mode === 'loading') useOffline(); }, 10000); }
</script>
${opts.apiKey ? `<script async src="https://maps.googleapis.com/maps/api/js?key=${key}&v=weekly&language=ko&region=IT&loading=async&callback=initMap"></script>` : ''}
</body></html>`;
}

export type StreetViewHtmlOptions = {
  apiKey: string;
  lat: number;
  lng: number;
  heading: number;
  pitch: number;
  fov: number;
};

/** C타입 대체 화면: 가게 앞 Street View (입구 방향으로 고정) */
export function buildStreetViewHtml(opts: StreetViewHtmlOptions): string {
  const cfg = JSON.stringify(opts);
  const key = encodeURIComponent(opts.apiKey);
  const zoom = Math.max(0, Math.min(4, Math.log2(180 / opts.fov)));
  return `<!doctype html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style>
  html,body,#pano{margin:0;height:100%;width:100%;overflow:hidden;background:#3c4043;}
  #msg{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#e8eaed;
    font:14px -apple-system,"Apple SD Gothic Neo",sans-serif;text-align:center;padding:24px;box-sizing:border-box;}
  .gm-style-cc,.gmnoprint{display:none!important;}
</style>
</head><body>
<div id="pano"></div>
<div id="msg">${opts.apiKey ? 'Street View 불러오는 중…' : 'Street View를 보려면 API 키가 필요해요'}</div>
<script>
var CFG = ${cfg};
function send(m){ try{ window.ReactNativeWebView.postMessage(JSON.stringify(m)); }catch(e){} }
window.gm_authFailure = function(){ document.getElementById('msg').textContent = 'API 키 인증에 실패했어요'; };
function initPano(){
  var pano = new google.maps.StreetViewPanorama(document.getElementById('pano'), {
    position: { lat: CFG.lat, lng: CFG.lng },
    pov: { heading: CFG.heading, pitch: CFG.pitch },
    zoom: ${zoom.toFixed(2)},
    disableDefaultUI: true, linksControl: false, clickToGo: false, panControl: false,
    addressControl: false, showRoadLabels: false, motionTracking: false, motionTrackingControl: false,
    scrollwheel: false
  });
  pano.addListener('status_changed', function(){
    if (pano.getStatus() === 'OK') document.getElementById('msg').style.display = 'none';
    else document.getElementById('msg').textContent = '이 위치의 Street View가 없어요';
  });
  // 방향 고정: 손으로 돌려도 원래 방향으로 돌아옴
  pano.addListener('pov_changed', function(){
    var p = pano.getPov();
    if (Math.abs(p.heading - CFG.heading) > 0.5 || Math.abs(p.pitch - CFG.pitch) > 0.5)
      pano.setPov({ heading: CFG.heading, pitch: CFG.pitch });
  });
}
window.initPano = initPano;
</script>
${opts.apiKey ? `<script async src="https://maps.googleapis.com/maps/api/js?key=${key}&v=weekly&language=ko&loading=async&callback=initPano"></script>` : ''}
</body></html>`;
}
