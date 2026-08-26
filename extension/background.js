const ALLOWED_ORIGIN = 'https://streamearn-ai.onrender.com';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'STREAM_EARN_GET_ACTIVE_TAB') {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(tabs => {
      const tab = tabs[0];
      sendResponse(tab ? { ok: true, tab: { id: tab.id, url: tab.url ?? '', title: tab.title ?? '' } } : { ok: false });
    }).catch(() => sendResponse({ ok: false }));
    return true;
  }

  if (message?.type === 'STREAM_EARN_NAVIGATE') {
    const url = String(message.url || '');
    try { new URL(url); } catch { sendResponse({ ok: false, error: 'Invalid URL' }); return; }
    chrome.tabs.update(message.tabId || sender.tab?.id, { url }).then(tab => sendResponse({ ok: true, tabId: tab.id })).catch(e => sendResponse({ ok: false, error: String(e) }));
    return true;
  }

  if (message?.type === 'STREAM_EARN_READ_PAGE') {
    const tabId = message.tabId || sender.tab?.id;
    if (!tabId) { sendResponse({ ok: false, error: 'No tab selected' }); return; }
    chrome.tabs.sendMessage(tabId, { type: 'STREAM_EARN_EXTRACT_PAGE' }).then(data => sendResponse(data)).catch(e => sendResponse({ ok: false, error: String(e) }));
    return true;
  }
});

chrome.runtime.onInstalled.addListener(() => chrome.storage.local.set({ installedAt: Date.now() }));
