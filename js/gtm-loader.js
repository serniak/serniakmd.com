function loadGTM() {
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-MHCRN864');
}

// Load GTM after a longer delay or user interaction to reduce initial JS load
const delay = 5000; // Increased to 5 seconds
let gtmLoaded = false;

function triggerGTM() {
  if (!gtmLoaded) {
    loadGTM();
    gtmLoaded = true;
  }
}

// Only load on user interaction for better performance
// Removed automatic timeout loading to reduce unused JS
['scroll', 'click', 'touchstart'].forEach(event => {
  document.addEventListener(event, triggerGTM, { once: true });
});

// Fallback: load after 10 seconds if no interaction
setTimeout(() => {
  if (!gtmLoaded) {
    triggerGTM();
  }
}, 10000);
