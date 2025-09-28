function loadGTM() {
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-MHCRN864');
}

// Load GTM after a delay or user interaction
const delay = 3000; // 3 seconds
let gtmLoaded = false;

function triggerGTM() {
  if (!gtmLoaded) {
    loadGTM();
    gtmLoaded = true;
  }
}

setTimeout(triggerGTM, delay);

// Also trigger on user interaction
['mousemove', 'scroll', 'keydown', 'click', 'touchstart'].forEach(event => {
  document.addEventListener(event, triggerGTM, { once: true });
});
