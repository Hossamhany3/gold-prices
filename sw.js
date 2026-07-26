const CACHE='gold-prices-v1';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',e=>{
  if(e.request.url.includes('api.github.com')||e.request.url.includes('cdn.jsdelivr.net')||e.request.url.includes('fawazahmed0')||e.request.url.includes('allorigins')){
    e.respondWith(fetch(e.request).then(r=>{
      const clone=r.clone();
      caches.open(CACHE).then(c=>c.put(e.request,clone));
      return r;
    }).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
    const clone=resp.clone();
    caches.open(CACHE).then(c=>c.put(e.request,clone));
    return resp;
  }).catch(()=>new Response('<!DOCTYPE html><html dir="rtl" lang="ar"><body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;background:#0a0a1a;color:#ffd700;text-align:center"><div><h1>⚠️ بدون اتصال</h1><p style="color:#999">تحقق من اتصالك بالانترنت وحاول مرة اخرى</p></div></body></html>',{headers:{'Content-Type':'text/html; charset=utf-8'}}))));
});
