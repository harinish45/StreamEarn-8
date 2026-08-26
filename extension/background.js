const ALLOWED_ORIGIN = 'https://streamearn-ai.onrender.com';

async function handle(message, sender, sendResponse) {
  if (message?.type === 'STREAM_EARN_GET_ACTIVE_TAB') {
    const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const tab = tabs[0];
    sendResponse(tab ? { ok: true, tab: { id: tab.id, url: tab.url ?? '', title: tab.title ?? '' } } : { ok: false });
    return;
  }
  if (message?.type === 'STREAM_EARN_NAVIGATE') {
    const url = String(message.url || '');
    try { new URL(url); } catch { sendResponse({ ok: false, error: 'Invalid URL' }); return; }
    const tab = await chrome.tabs.update(message.tabId || sender.tab?.id, { url });
    sendResponse({ ok: true, tabId: tab.id });
    return;
  }
  if (message?.type === 'STREAM_EARN_READ_PAGE') {
    const tabId = message.tabId || sender.tab?.id;
    if (!tabId) { sendResponse({ ok: false, error: 'No tab selected' }); return; }
    try {
      const data = await chrome.tabs.sendMessage(tabId, { type: 'STREAM_EARN_EXTRACT_PAGE' });
      sendResponse(data);
    } catch (error) { sendResponse({ ok: false, error: String(error) }); }
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { handle(message, sender, sendResponse).catch(error => sendResponse({ ok: false, error: String(error) })); return true; });
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  if (sender.origin !== ALLOWED_ORIGIN) { sendResponse({ ok: false, error: 'Origin not allowed' }); return false; }
  handle(message, sender, sendResponse).catch(error => sendResponse({ ok: false, error: String(error) }));
  return true;
});
chrome.runtime.onInstalled.addListener(() => chrome.storage.local.set({ installedAt: Date.now() }));
