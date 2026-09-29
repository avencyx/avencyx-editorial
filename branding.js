/**
 * Avencyx branding for the Sveltia CMS shell. The logo comes from
 * config.yml (`logo.src`); the product name shown on the sign-in screen is
 * not configurable, so this swaps that one text node for the app's name.
 * Deliberately narrow: only text nodes containing "Sveltia CMS" are touched
 * (the app wraps it in Unicode isolate marks, e.g. "Welcome to ⁨Sveltia
 * CMS⁩"), so an upstream UI change degrades to showing the product name,
 * nothing worse.
 */
(function () {
  const APP_NAME = "Avencyx Insights Studio";
  const PRODUCT = "Sveltia CMS";

  // The app rewrites <title> as you navigate ("Creating Article – Sveltia
  // CMS"); keep the page context and swap only the product name.
  const titleEl = document.querySelector("title") || document.head.appendChild(document.createElement("title"));
  const fixTitle = () => {
    if (document.title.includes(PRODUCT)) document.title = document.title.replace(PRODUCT, APP_NAME);
    else if (!document.title.includes(APP_NAME)) document.title = APP_NAME;
  };
  fixTitle();
  new MutationObserver(fixTitle).observe(titleEl, { childList: true, characterData: true, subtree: true });

  function rebrand(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue.includes(PRODUCT)) node.nodeValue = node.nodeValue.split(PRODUCT).join(APP_NAME);
    }
  }

  rebrand(document.body);
  new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "characterData" && m.target.nodeValue.includes(PRODUCT)) {
        m.target.nodeValue = m.target.nodeValue.split(PRODUCT).join(APP_NAME);
      }
      for (const n of m.addedNodes) {
        if (n.nodeType === 1) rebrand(n);
        else if (n.nodeType === 3 && n.nodeValue.includes(PRODUCT)) n.nodeValue = n.nodeValue.split(PRODUCT).join(APP_NAME);
      }
    }
  }).observe(document.body, { childList: true, characterData: true, subtree: true });
})();
