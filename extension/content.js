chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== 'STREAM_EARN_EXTRACT_PAGE') return;
  const text = document.body?.innerText?.slice(0, 50000) || '';
  const links = [...document.querySelectorAll('a[href]')].slice(0, 100).map(a => ({ title: (a.textContent || '').trim().slice(0, 200), url: a.href })).filter(x => x.title || x.url);
  sendResponse({ ok: true, page: { title: document.title, url: location.href, text, links } });
});
