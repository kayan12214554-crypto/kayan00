/* Barq Cash — Meta tracking bootstrap */
const BARQ_META_PIXEL_ID='1116475627783726';

(function(){
  const UTM_KEYS=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
  const params=new URLSearchParams(location.search);
  const campaign={};
  UTM_KEYS.forEach(k=>{const v=params.get(k);if(v)campaign[k]=v.slice(0,200)});

  function analyticsAllowed(){
    return window.barqConsent==='analytics' || localStorage.getItem('barq_consent_v2')==='analytics';
  }

  function validPixel(){return /^\d{6,25}$/.test(BARQ_META_PIXEL_ID)}

  function initMeta(){
    if(!analyticsAllowed()||!validPixel()||window.__barqMetaReady)return;
    window.__barqMetaReady=true;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init',BARQ_META_PIXEL_ID);
    fbq('track','PageView');
  }

  function trackContact(){
    if(!analyticsAllowed())return;
    initMeta();
    if(typeof window.fbq!=='function')return;
    const data={content_name:'WhatsApp'};
    fbq('track','Contact',data);
  }

  window.addEventListener('barq-consent-change',e=>{if(e.detail==='analytics')initMeta()});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initMeta,{once:true});else initMeta();


  // Opt-in, local-only diagnostics. No personal data or additional Meta events.
  if(params.get('meta_debug')==='1'){
    const marker=document.createElement('meta');
    marker.name='barq-meta-diagnostics';
    document.head.appendChild(marker);
    const report=()=>{
      const requests=performance.getEntriesByType('resource')
        .filter(r=>{try{const u=new URL(r.name);return /(^|\.)facebook\.com$/.test(u.hostname)&&u.pathname==='/tr/'}catch{return false}})
        .slice(-12).map(r=>{const u=new URL(r.name);return {event:u.searchParams.get('ev'),pixel:u.searchParams.get('id'),status:r.responseStatus||0,duration:Math.round(r.duration)}});
      marker.content=JSON.stringify({consent:analyticsAllowed(),initialized:!!window.__barqMetaReady,libraryReady:typeof window.fbq?.callMethod==='function',queueLength:window.fbq?.queue?.length||0,requests});
    };
    report();
    setInterval(report,1000);
  }

  window.barqMeta={init:initMeta,trackContact,pixelConfigured:validPixel(),campaign};
})();
