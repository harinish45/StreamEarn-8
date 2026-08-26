export type BridgeTab = { id: number; url: string; title: string };
export type BridgePage = { title: string; url: string; text: string; links: { title: string; url: string }[]; fields?: unknown[] };
type BridgeResponse = { ok: boolean; error?: string; tab?: BridgeTab; page?: BridgePage; tabId?: number; answer?: string; models?: string[] };

export function browserExtensionAvailable(): boolean { return typeof window !== 'undefined'; }

async function send(message: unknown): Promise<BridgeResponse> {
  if (typeof window === 'undefined') return { ok: false, error: 'Browser unavailable.' };
  const requestId = crypto.randomUUID();
  return new Promise(resolve => {
    const timeout = window.setTimeout(() => { window.removeEventListener('message', listener); resolve({ ok: false, error: 'StreamEarn Browser Bridge is not responding. Reload the extension and page.' }); }, 8000);
    const listener = (event: MessageEvent) => { if (event.source !== window || event.origin !== window.location.origin) return; if (event.data?.source !== 'streamearn-extension' || event.data?.requestId !== requestId) return; window.clearTimeout(timeout); window.removeEventListener('message', listener); resolve(event.data.response || { ok: false, error: 'Empty extension response.' }); };
    window.addEventListener('message', listener);
    window.postMessage({ source: 'streamearn-web', requestId, payload: message }, window.location.origin);
  });
}

export const browserBridge = {
  getActiveTab: () => send({ type: 'STREAM_EARN_GET_ACTIVE_TAB' }),
  navigate: (tabId: number, url: string) => send({ type: 'STREAM_EARN_NAVIGATE', tabId, url }),
  readPage: (tabId: number) => send({ type: 'STREAM_EARN_READ_PAGE', tabId }),
  fillForm: (tabId: number, fields: unknown[]) => send({ type: 'STREAM_EARN_FILL_FORM', tabId, fields }),
  click: (tabId: number, text: string) => send({ type: 'STREAM_EARN_CLICK', tabId, text }),
  localAI: (messages: { role: string; content: string }[], model?: string) => send({ type: 'STREAM_EARN_LOCAL_AI', messages, model }),
  localAIStatus: () => send({ type: 'STREAM_EARN_LOCAL_AI_STATUS' }),
};
