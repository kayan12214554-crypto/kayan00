/* Barq Cash — Meta tracking bootstrap
   Keep PIXEL_ID empty until the verified Meta Pixel/Dataset is available. */
const BARQ_META_PIXEL_ID='';

(function(){
  const UTM_KEYS=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
  const params=new URLSearchParams(location.search);
  const campaign={};
  UTM_KEYS.forEach(k=>{const v=params.get(k);if(v)campaign[k]=v.slice(0,200)});

  function analyticsAllowed(){
    return window.barqConsent==='analytics' || localStorage.getItem('barq_consent_v1')==='analytics';
  }

  function validPixel(){return /^\d{6,25}$/.test(BARQ_META_PIXEL_ID)}

  function initMeta(){
    if(!analyticsAllowed()||!validPixel()||window.__barqMetaReady)return;
    window.__barqMetaReady=true;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init',BARQ_META_PIXEL_ID);
    fbq('track','PageView');
  }

  function serviceFrom(el){
    const node=el&&el.closest&&el.closest('.wa,.waCard');
    return node?(node.dataset.service||'استفسار عام'):'استفسار عام';
  }

  function trackContact(el){
    if(!analyticsAllowed())return;
    initMeta();
    if(typeof window.fbq!=='function')return;
    const data=Object.assign({content_name:'WhatsApp',service:serviceFrom(el),page_url:location.href,referrer:document.referrer||''},campaign);
    fbq('track','Contact',data);
  }

  document.addEventListener('click',e=>{
    const el=e.target&&e.target.closest&&e.target.closest('.wa,.waCard');
    if(el)trackContact(el);
  },true);

  window.addEventListener('barq-consent-change',e=>{if(e.detail==='analytics')initMeta()});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initMeta,{once:true});else initMeta();

  window.barqMeta={init:initMeta,pixelConfigured:validPixel(),campaign};
})();
